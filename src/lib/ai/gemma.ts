import { createGoogleGenerativeAI } from "@ai-sdk/google";

// Google AI provider
export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
});

// Gemini 2.0 Flash - gratuito y con buen soporte de espanol
export const defaultModel = "gemini-2.0-flash";
