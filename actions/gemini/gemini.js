import { GoogleGenerativeAI } from "@google/generative-ai";
import { getExtractionPrompt, getCareerRoadmapPrompt } from "@/prompts/extractionPrompt";

export async function geminiCalls(entireContent) {
    const genAI = new GoogleGenerativeAI(process.env.NEXT_GEMINI_API_KEY);
    // console.log(entireContent);
    
    const model = genAI.getGenerativeModel({ model: process.env.NEXT_GEMINI_MODEL});
    const prompt = getExtractionPrompt(entireContent);
    // console.log("The prompt is: \n ",prompt);
    
    const result = await model.generateContent(prompt);
    let extractedText = await result.response.text();  
    
    console.log("Extracted Data from Gemini:\n",extractedText); //initial prompt result

    // extractedText = extractedText.replace(/```json\n?/, "").replace(/\n?```/, "").trim();

    // let parsedData;
    // try {
    //     parsedData = JSON.parse(extractedText);  
    // } catch (error) {
    //     console.error("Error parsing extracted text into JSON:", error);
    //     return; 
    // }

    // Second prompt: Career roadmap using extracted JSON
    const newModel = genAI.getGenerativeModel({ model: process.env.NEXT_GEMINI_TUNED_MODEL});
    
    // Inject extracted JSON into the second prompt
    // const newPrompt = `${process.env.NEXT_GEMINI_PROMPT_2}\nHere is the user's data in JSON:\n\`\`\`json\n${JSON.stringify(parsedData, null, 2)}\n\`\`\``;

    const career_prompt=getCareerRoadmapPrompt(extractedText);
    const newResult = await newModel.generateContent(career_prompt);
    const careerRoadmap = await newResult.response.text();  
    
    console.log("Career Roadmap: \n", careerRoadmap);
}
