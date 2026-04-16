// File: app/api/gemini/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// PRODUCTION STANDARD: Force dynamic execution so Next.js doesn't cache AI responses
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // 1. Parse the incoming request from the Ask Gemini page
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, message: 'Prompt is required' },
        { status: 400 }
      );
    }

    // 2. Validate the API Key securely on the server side
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is missing from environment variables.');
      return NextResponse.json(
        { success: false, message: 'Server configuration error: Missing API Key' },
        { status: 500 }
      );
    }

    // 3. Initialize the Google Generative AI SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // We use gemini-1.5-flash as it is the recommended model for fast, general text tasks
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // 4. Send the prompt to Gemini and await the response
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // 5. Return the successful response back to the frontend
    return NextResponse.json({ success: true, reply: text }, { status: 200 });

  } catch (error: unknown) {
    console.error('Error in Gemini API route:', error);
    
    // Safely check if the caught error is an instance of an Error object
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred while processing your request.';

    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage 
      },
      { status: 500 }
    );
  }
}