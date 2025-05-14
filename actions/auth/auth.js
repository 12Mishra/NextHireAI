"use server";

import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function createNewUser(name, email, password) {
    console.log(name, email, password);

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return {
                success: false,
                message: "User already exists",
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return {
            success: true,
            message: "User created successfully",
        };
    } catch (error) {
        console.error("Error creating user:", error);
        return {
            success: false,
            message: "Internal Server Error",
        };
    }
}
