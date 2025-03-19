import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error("Credentials are required");
      }
      console.log(credentials.email, credentials.password);
      
      try {
        const foundUser = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })
        console.log("Found user", foundUser);
        
        if (!foundUser) {
          return {
            failure:"User does not exist",
            status:400,
          }
        }

        console.log(credentials.password, "and", foundUser.password);
        const passwordMatch = await bcrypt.compare(credentials.password, foundUser.password);

        if (!passwordMatch) throw new Error("Invalid credentials");

        return {
          sucess:"Log in successful",
          id: foundUser.id.toString(),
          email: foundUser.email
        }
      } catch (error) {
        console.error("Error has occured");
        throw new Error("Error occured" + error);
      }
    }
  })],

  secret:process.env.NEXT_AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 3 * 60 * 60 
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/login" 
  }
})