import { createGoogleGenerativeAI } from "@ai-sdk/google";

// Google AI provider - usa Gemma o Gemini segun el modelo que se pase
// Lee GOOGLE_GENERATIVE_AI_API_KEY del env por defecto
export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
});
