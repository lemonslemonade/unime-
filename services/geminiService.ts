import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const complaintSeveritySchema = {
  type: Type.OBJECT,
  properties: {
    severity: {
      type: Type.STRING,
      description: 'The estimated severity level of the complaint. e.g., "Low", "Medium", "High".',
    },
  },
  required: ["severity"],
};

export interface ComplaintAnalysis {
  category: string;
  severity: string;
}

export const categorizeComplaint = async (complaintDetails: string, category: string): Promise<ComplaintAnalysis | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following data privacy complaint, which has been categorized by the user as "${category}". Based on the details, determine the severity level. Details: ${complaintDetails}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: complaintSeveritySchema,
        temperature: 0,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      console.error("Gemini API returned an empty response text.");
      return null;
    }

    const result = JSON.parse(jsonText) as { severity: string };
    return { category, severity: result.severity };
  } catch (error) {
    console.error("Error analyzing complaint severity with Gemini API:", error);
    return null;
  }
};

export const generateFeatureImage = async (prompt: string): Promise<string | null> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
        console.warn("Gemini API returned no images for prompt:", prompt);
        return null;
    } catch (error) {
        console.error("Error generating image with Gemini API:", error);
        return null;
    }
};