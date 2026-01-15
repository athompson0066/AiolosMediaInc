
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
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
      },
    });
    
    return response.text || "I'm sorry, I'm having trouble connecting to my brain right now. Please try again!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm currently in high demand! Try again in a second or reach out via our audit form below.";
  }
};
