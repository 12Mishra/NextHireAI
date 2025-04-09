"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
export default function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const router = useRouter();

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      console.log(email, password);

      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      console.log(response);
      if (response.status===200) {
        toast.success("Successfully logged in.");
        router.push('/insight');
      } else {
        toast.error("Error loggin in user");
      }
    } catch (error) {
      console.error("Error has occured", error);
      toast.error("Could not login");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-black/60 p-8 rounded-lg shadow-lg border border-purple-500/20 backdrop-blur-md w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <Link href="/auth/signup" className="text-purple-200 mt-2">
            Sign up to your account
          </Link>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-purple-200 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 rounded-lg bg-black/50 border border-purple-500/30 text-white focus:outline-none focus:border-purple-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-purple-200 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 rounded-lg bg-black/50 border border-purple-500/30 text-white focus:outline-none focus:border-purple-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
