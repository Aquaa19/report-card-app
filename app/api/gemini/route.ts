// File: app/api/gemini/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// PRODUCTION STANDARD: Force dynamic execution so Next.js doesn't cache AI responses
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  // Define maskedKey outside the try block so the catch block can access it for error messages
  let maskedKey = 'UNKNOWN';

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
    const rawApiKey = process.env.GEMINI_API_KEY;
    if (!rawApiKey) {
      console.error('GEMINI_API_KEY is missing from environment variables.');
      return NextResponse.json(
        { success: false, message: 'Server configuration error: Missing API Key' },
        { status: 500 }
      );
    }

    // Clean the API key to prevent 401 errors caused by accidental spaces or quotes in .env.local
    const apiKey = rawApiKey.replace(/['"]/g, '').trim();
    
    // Create a safe, masked version of the key for debugging (e.g., "AQ.Ab...Qlw" or "AIzaS...abc")
    maskedKey = apiKey.length > 8 ? `${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 3)}` : 'INVALID_LENGTH';
    console.log(`[Gemini API] Attempting connection with key format: ${maskedKey}`);

    // 3. Initialize the Google Generative AI SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Using the officially supported stable model string found via your diagnostic script
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // 4. Send the prompt to Gemini and await the response
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // 5. Return the successful response back to the frontend
    return NextResponse.json({ success: true, reply: text }, { status: 200 });

  } catch (error: unknown) {
    console.error('Error in Gemini API route:', error);
    
    // Safely check if the caught error is an instance of an Error object
    let errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred while processing your request.';

    // Specifically intercept the 401 Unauthorized / Token Type error
    if (errorMessage.includes('401') || errorMessage.includes('ACCESS_TOKEN_TYPE_UNSUPPORTED')) {
      errorMessage = `Authentication Failed (401). Google rejected the API key ("${maskedKey}"). Please verify that the "Generative Language API" is enabled in your Google Cloud Console for this project, and ensure the API key has NO application restrictions (like IP or Web restrictions) blocking your local development environment.`;
    }

    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage 
      },
      { status: 500 }
    );
  }
}