"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getExtractionPrompt, getCareerRoadmapPrompt } from "@/prompts/extractionPrompt";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function geminiCalls(entireContent) {
    const session = await auth();

    const genAI = new GoogleGenerativeAI(process.env.NEXT_GEMINI_API_KEY);
    // console.log(entireContent);

    const model = genAI.getGenerativeModel({ model: process.env.NEXT_GEMINI_MODEL });
    const prompt = getExtractionPrompt(entireContent);
    // console.log("The prompt is: \n ",prompt);

    const result = await model.generateContent(prompt);
    let extractedText = await result.response.text();

    // console.log("Extracted Data from Gemini:\n", extractedText); //initial prompt result

    // extractedText = extractedText.replace(/```json\n?/, "").replace(/\n?```/, "").trim();

    // let parsedData;
    // try {
    //     parsedData = JSON.parse(extractedText);  
    // } catch (error) {
    //     console.error("Error parsing extracted text into JSON:", error);
    //     return; 
    // }

    // Second prompt: Career roadmap using extracted JSON
    const newModel = genAI.getGenerativeModel({ model: process.env.NEXT_GEMINI_TUNED_MODEL });

    const career_prompt = getCareerRoadmapPrompt(extractedText);
    const newResult = await newModel.generateContent(career_prompt);

    const careerRoadmap = await newResult.response.text();

    // Clean the response (remove markdown code blocks)
    const refinedData = careerRoadmap
        .replace(/```json\n?/, "") // Remove opening ```json
        .replace(/\n?```/, "") // Remove closing ```
        .trim(); // Remove extra whitespace

    console.log("Refined data: ", refinedData);

    try {
        // Parse the cleaned response into a JSON object
        const parsedData = JSON.parse(refinedData);

        console.log("Career Roadmap: \n", parsedData);

        //storing in DB
        const findUser = await prisma.user.findUnique({
            where: {
                id: parseInt(session.user.id)
            }
        });
        console.log(findUser);

        const foundFile = await prisma.files.findFirst({
            where: { userId: parseInt(session.user.id) },
            orderBy: { createdAt: 'desc' }
        });

        console.log(foundFile);

        if (!foundFile) {
            throw new Error("No file found for this user.");
        }

        // Create new past insight
        const newInsight = await prisma.pastInsights.create({
            data: {
                insights: parsedData,
                userId: parseInt(session.user.id),
                fileId: foundFile.id
            }
        });


        console.log(newInsight);

        // Return the parsed object to the frontend
        return { success: 200, body: parsedData };

    } catch (error) {
        console.error("Error parsing JSON:", error);
        return { success: 500, body: "Invalid JSON response from Gemini" };
    }

}
