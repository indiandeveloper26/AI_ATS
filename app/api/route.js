import { NextResponse } from "next/server";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { ChatGroq } from "@langchain/groq";

// 1. Initialize LLM
const llm = new ChatGroq({
    apiKey: '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',
    model: "llama-3.1-8b-instant",
    temperature: 0,
});

export async function POST(req) {


    try {
        // A. FormData parse karein (Next.js built-in)
        const data = await req.formData();
        const file = data.get("resume");
        const userJD = data.get("jobDescription");

        // B. Strict Validation
        if (!file || !userJD || userJD.trim().length < 10) {
            return NextResponse.json(
                { success: false, error: "Resume and valid JD are required." },
                { status: 400 }
            );
        }

        // C. PDF Content Extract karein (Bina file save kiye)
        // Next.js mein file ek Blob hoti hai
        const loader = new PDFLoader(file);
        const docs = await loader.load();
        const resumeText = docs.map((d) => d.pageContent).join("\n");

        if (!resumeText) {
            return NextResponse.json(
                { success: false, error: "Could not read PDF content." },
                { status: 422 }
            );
        }

        // D. Strict Prompt Logic
        const atsPrompt = `
      You are a highly critical ATS Scanner. Compare the Resume against the Job Description.

      STRICT RULES:
      1. Use ONLY the provided Job Description.
      2. matchPercentage must be 0% if unrelated.
      3. Be very strict with scoring.

      JOB DESCRIPTION:
      ${userJD}

      RESUME CONTENT:
      ${resumeText}

      Return ONLY a JSON object:
      {
        "matchPercentage": number,
        "missingKeywords": ["string"],
        "profileSummary": "string",
        "improvements": ["string"]
      }`;

        // E. Get LLM Response
        const response = await llm.invoke(atsPrompt);

        // JSON cleaning logic
        const cleaned = response.content
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const analysis = JSON.parse(cleaned);

        return NextResponse.json({
            success: true,
            analysis: analysis,
        });

    } catch (error) {
        console.error("ATS API Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}