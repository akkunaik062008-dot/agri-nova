import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

export const GEMINI_MODEL = 'gemini-2.5-flash';

export const SYSTEM_PROMPT = `You are AgriVision AI, a world-class agronomist, plant pathologist, and agricultural economist. Your recommendations must be scientific, localized, actionable, and mathematically precise. You must evaluate soil N-P-K balances, pH thresholds, climate conditions, and market viability. Never recommend chemical treatments without specifying safety wear, exact dosage per acre/hectare, and withdrawal periods. Always return responses formatted strictly according to the provided JSON Schema.`;

let aiClient = null;

if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key') {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
    console.log('[Gemini SDK] Initialized successfully with model:', GEMINI_MODEL);
  } catch (error) {
    console.warn('[Gemini SDK] Initialization warning:', error.message);
  }
} else {
  console.warn('[Gemini SDK] Notice: GEMINI_API_KEY not configured. Intelligent agronomical simulation fallback active for development.');
}

export const ai = aiClient;
export const isGeminiConfigured = () => Boolean(aiClient && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key');
