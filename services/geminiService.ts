
import { GoogleGenAI, Type, Part } from "@google/genai";
import type { AnalysisResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        if (typeof reader.result === 'string') {
            resolve(reader.result.split(',')[1]);
        } else {
            resolve(''); // Should not happen with readAsDataURL
        }
    };
    reader.readAsDataURL(file);
  });
  const base64EncodedData = await base64EncodedDataPromise;
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        isGenuine: {
          type: Type.BOOLEAN,
          description: "True if the offer letter appears genuine, false if it appears to be a fake or scam."
        },
        reason: {
          type: Type.STRING,
          description: "A brief, one-sentence summary of the main reason for the verdict."
        },
        keyIndicators: {
          type: Type.ARRAY,
          description: "A list of checks performed on the offer letter.",
          items: {
            type: Type.OBJECT,
            properties: {
              indicator: { 
                type: Type.STRING, 
                description: "The specific feature that was analyzed (e.g., 'Email Domain', 'Grammar', 'Company Details', 'Urgency')." 
              },
              status: { 
                type: Type.STRING, 
                description: "The status of the indicator. Must be one of: 'Pass', 'Fail', or 'Warning'." 
              },
              details: { 
                type: Type.STRING, 
                description: "A short, user-friendly explanation of the finding for this indicator." 
              }
            }
          }
        }
    }
};

export const analyzeOfferLetter = async (
  file: File | null,
  text: string
): Promise<AnalysisResult> => {
  const model = 'gemini-2.5-flash';
  const systemInstruction = `You are an expert fraud detection analyst specializing in fake job offers. Your task is to analyze the provided offer letter content (from text or an image) and determine if it is genuine or fake. 
  
  Evaluate the content based on these criteria:
  1.  **Contact Information & Domain:** Check for generic email domains (e.g., @gmail.com, @yahoo.com) instead of a corporate domain. Verify company details if possible.
  2.  **Grammar & Professionalism:** Look for spelling mistakes, poor grammar, and unprofessional language.
  3.  **Vague Details:** Check if job title, salary, start date, and responsibilities are clear and specific.
  4.  **Urgency & Pressure:** Note any language that pressures the recipient to act quickly.
  5.  **Requests for Money or Personal Info:** Flag any request for payment (e.g., for equipment, training, background checks) or sensitive personal information beyond what's normal for hiring.
  6.  **Formatting & Branding:** Assess if the document layout, logo, and branding look professional and authentic.
  
  Return your analysis ONLY in the provided JSON schema. Do not output any other text. Classify the offer as fake if you find significant red flags.`;

  const promptParts: Part[] = [];
  
  const instructionPart = { text: "Analyze this job offer letter." };
  promptParts.push(instructionPart);

  if (file) {
    const imagePart = await fileToGenerativePart(file);
    promptParts.push(imagePart);
  } else if (text) {
    promptParts.push({text: `Here is the text of the offer letter:\n\n---\n\n${text}\n\n---`});
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: promptParts },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1,
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText) as AnalysisResult;
    
    // Basic validation to ensure the response shape is correct
    if (typeof parsedJson.isGenuine !== 'boolean' || !Array.isArray(parsedJson.keyIndicators)) {
        throw new Error("AI response is not in the expected format.");
    }

    return parsedJson;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from AI. The model may be unable to process the request. Please try again.");
  }
};
