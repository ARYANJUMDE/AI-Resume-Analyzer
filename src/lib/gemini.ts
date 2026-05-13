import { GoogleGenAI, Type } from "@google/genai";

// Use import.meta.env for Vite and package as fallback. 
// Note: In deployment environments like Vercel, VITE_ prefix is required for client-side access.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '');

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined. The AI features will not work until an API key is provided in the environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'MISSING_KEY' });

export interface AnalysisResult {
  overallScore: number;
  contentScore: number;
  atsScore: number;
  strengths: string[];
  weaknesses: string[];
  skillsDetected: string[];
  keywordMatch: {
    matched: string[];
    missing: string[];
  };
  recommendations: string[];
  summary: string;
}

export async function analyzeResume(resumeText: string, jobDescription?: string): Promise<AnalysisResult> {
  const prompt = `
    Analyze the following resume text. ${jobDescription ? `Compare it against this job description: "${jobDescription}"` : "Provide a general professional analysis."}
    
    Resume Text:
    ${resumeText}
    
    Please provide the analysis in JSON format with the following structure:
    {
      "overallScore": number (0-100),
      "contentScore": number (0-100),
      "atsScore": number (0-100),
      "strengths": string[],
      "weaknesses": string[],
      "skillsDetected": string[],
      "keywordMatch": {
        "matched": string[],
        "missing": string[]
      },
      "recommendations": string[],
      "summary": string
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.NUMBER },
          contentScore: { type: Type.NUMBER },
          atsScore: { type: Type.NUMBER },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          skillsDetected: { type: Type.ARRAY, items: { type: Type.STRING } },
          keywordMatch: {
            type: Type.OBJECT,
            properties: {
              matched: { type: Type.ARRAY, items: { type: Type.STRING } },
              missing: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["matched", "missing"]
          },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          summary: { type: Type.STRING }
        },
        required: ["overallScore", "contentScore", "atsScore", "strengths", "weaknesses", "skillsDetected", "keywordMatch", "recommendations", "summary"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Failed to generate analysis");
  return JSON.parse(text);
}
