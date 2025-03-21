import fs from "fs";
import path from "path";

const prompt1Path = path.join(process.cwd(), "prompts", "prompt1.txt");
const prompt2Path = path.join(process.cwd(), "prompts", "prompt2.txt");

const extractionPrompt = fs.readFileSync(prompt1Path, "utf-8");
const extractionPrompt2 = fs.readFileSync(prompt2Path, "utf-8");

export const getExtractionPrompt = (entireContent) => `${extractionPrompt}\n\n${entireContent}`;

export const getCareerRoadmapPrompt = (extractedText) => `${extractionPrompt2}\n\n${extractedText}`;
