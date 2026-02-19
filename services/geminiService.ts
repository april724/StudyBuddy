
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, AppMode } from "../types";

const API_KEY = process.env.API_KEY || "";

export const analyzeStudyMaterial = async (
  base64Image: string,
  mode: AppMode
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  let systemInstruction = "";
  let responseSchema: any = {
    type: Type.OBJECT,
    properties: {
      question: { type: Type.STRING, description: "The extracted question text from image" },
      explanation: { type: Type.STRING, description: "Detailed explanation of the problem" },
      answer: { type: Type.STRING, description: "The correct final answer" },
      mnemonics: { type: Type.STRING, description: "A creative, cute, and lively way to remember this concept" }
    },
    required: ["question", "explanation", "answer"]
  };

  if (mode === AppMode.MISTAKE_EXPLANATION) {
    systemInstruction = "你是一位親切活潑的家教老師。請分析圖片中的題目，提供詳盡的解題思路與正確答案。請使用繁體中文。";
  } else if (mode === AppMode.PROBLEM_PRACTICE) {
    systemInstruction = "你是一位充滿活力的學習教練。提取題目內容，並準備一個生動、好記且易於理解的講解。請使用繁體中文。";
  } else if (mode === AppMode.KEY_POINTS) {
    systemInstruction = "你是一位資訊視覺化專家。請從圖片中提取重點內容，並將其整理成適合做成資訊圖表的結構。請使用繁體中文。";
    responseSchema = {
      type: Type.OBJECT,
      properties: {
        mainTitle: { type: Type.STRING },
        summary: { type: Type.STRING },
        keyPoints: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              icon: { type: Type.STRING, description: "A simple emoji representing the concept" }
            },
            required: ["title", "description"]
          }
        }
      },
      required: ["mainTitle", "summary", "keyPoints"]
    };
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { mimeType: "image/jpeg", data: base64Image } },
        { text: `請分析這張學習照片。目前的模式是：${mode}。如果是生物或理科題目，請特別注意圖形細節。` }
      ]
    },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: responseSchema
    }
  });

  return JSON.parse(response.text || "{}");
};
