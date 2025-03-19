import { NextResponse } from "next/server";
import  prisma  from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        console.log("route hit");
        
        const { name, email, password } = await req.json();
        console.log("this is the api log: ", name, email, password);
        
        const existingUser = await prisma.user.findUnique({ where: { email } });
        console.log(existingUser);
        
        if (existingUser) {
            return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        
        await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });
        
        return NextResponse.json({ success: true, message: "User created successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
