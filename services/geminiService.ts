import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const complaintAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    severity: {
      type: Type.STRING,
      description: 'The estimated severity level of the complaint. e.g., "Low", "Medium", "High".',
    },
    recommendations: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'A list of 2-3 concise, actionable next steps for the user based on their complaint. For example: "Contact the business\'s data protection officer." or "Keep a record of all communication."'
    }
  },
  required: ["severity", "recommendations"],
};

export interface ComplaintAnalysis {
  category: string;
  severity: string;
  recommendations: string[];
}

export const categorizeComplaint = async (complaintDetails: string, category: string): Promise<ComplaintAnalysis | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following data privacy complaint, which has been categorized by the user as "${category}". Based on the details, determine the severity level (Low, Medium, or High) and provide a list of 2-3 concise, actionable recommendations for the user to take next. Details: ${complaintDetails}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: complaintAnalysisSchema,
        temperature: 0,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      console.error("Gemini API returned an empty response text.");
      return null;
    }

    const result = JSON.parse(jsonText) as { severity: string; recommendations: string[] };
    return { category, severity: result.severity, recommendations: result.recommendations };
  } catch (error) {
    console.error("Error analyzing complaint with Gemini API:", error);
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