
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are "Aiolos AI", the helpful assistant for Aiolos Media. 
Aiolos Media builds custom AI Voice & Text Agents for local businesses (plumbers, HVAC, lawyers, dental clinics).
Our key value propositions:
1. We stop businesses from losing 30% of revenue due to missed calls.
2. We provide 24/7 coverage.
3. We book appointments directly into their CRM/Calendar.
4. We qualify leads instantly via SMS or Voice.

Your tone is professional, high-tech, yet friendly and accessible. 
If the user asks about cost, say it depends on complexity but typically starts with a low setup fee.
Encourage the user to "Get a Custom Audit" using the button on the page.
Keep responses concise (max 2-3 sentences).
`;

export const chatWithAgent = async (message: string) => {
  try {
    // Instantiate right before the call to ensure the latest API key is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Check if API key is present for easier debugging in the browser console
    if (!process.env.API_KEY) {
      console.warn("Gemini API: API_KEY is missing from process.env. If on Vercel, ensure it is set as an environment variable.");
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: message }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
      },
    });
    
    return response.text || "I'm sorry, I couldn't generate a response. Please try again!";
  } catch (error: any) {
    console.error("Gemini API Text Error:", error);
    if (error?.message?.includes("API_KEY_INVALID")) {
      return "The API Key appears to be invalid. Please check your Vercel environment variables.";
    }
    return "I'm having trouble connecting to my brain right now. Please try again in a few seconds!";
  }
};
