"use server";

import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import pdfParse from "pdf-parse";
import fetch from "node-fetch";
import { geminiCalls } from "../gemini/gemini";


export async function pdfParser() {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            console.log("User session not found");
            return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized access" }) };
        }

        const foundFile = await prisma.files.findFirst({
            where: { userId: parseInt(session.user.id) },
            orderBy: { createdAt: 'desc' }
        });

        if (!foundFile) {
            console.log("No file found");
            return { statusCode: 404, body: JSON.stringify({ error: "No file found" }) };
        }

        const pdfUrl = foundFile.fileURL;
        console.log("PDF URL:", pdfUrl);

        const response = await fetch(pdfUrl);
        console.log(response);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const pdfBuffer = Buffer.from(arrayBuffer);

        const pdfData = await pdfParse(pdfBuffer);
        
        const entireContent=pdfData.text;

        console.log(entireContent);
        
        const geminiResponse=await geminiCalls(entireContent);
        
        console.log("Extracted Text by pdf parsing:", entireContent);
        return {success:200, geminiResponse:geminiResponse}

    } catch (error) {
        console.error("Error occurred:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "Internal server error", details: error.message }) };
    }
}
