
import { NextResponse } from 'next/server';
import { generateImageFromHint } from '@/ai/flows/generate-image-from-hint-flow';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { hint } = body;

    if (!hint || typeof hint !== 'string' || hint.trim() === '') {
      console.warn('GENERATE_IMAGE_API_VALIDATION_FAIL: Hint is missing or invalid.');
      return NextResponse.json({ error: 'A valid "hint" is required.' }, { status: 400 });
    }
    
    // Check if Gemini API key is configured
    if (!process.env.GOOGLE_GENAI_API_KEY) {
      console.warn('GENERATE_IMAGE_API_MISSING_KEY: GOOGLE_GENAI_API_KEY is not set.');
      return NextResponse.json({ 
        error: 'Image generation service is not configured. Please set GOOGLE_GENAI_API_KEY environment variable.' 
      }, { status: 503 }); // Service Unavailable
    }
    
    // Call the Genkit flow from the backend
    const result = await generateImageFromHint({ hint });
    
    if (!result || !result.imageDataUri) {
        console.error('GENERATE_IMAGE_API_EMPTY_RESPONSE: Genkit flow did not return image data.', { hint });
        return NextResponse.json({ error: 'Image generation failed on the server.' }, { status: 500 });
    }

    // Return the successful response from the flow
    return NextResponse.json(result);

  } catch (error: any) {
    if (error instanceof SyntaxError) {
        console.warn('GENERATE_IMAGE_API_INVALID_JSON: Failed to parse request body.');
        return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    // Handle specific Genkit/API errors
    if (error.message?.includes('API key') || error.message?.includes('403') || error.message?.includes('unauthorized')) {
      console.error('GENERATE_IMAGE_API_AUTH_ERROR: Authentication failed.', {
        errorMessage: error.message,
      });
      return NextResponse.json({ 
        error: 'Image generation service authentication failed. Please check GOOGLE_GENAI_API_KEY configuration.' 
      }, { status: 503 });
    }

    console.error('GENERATE_IMAGE_API_UNHANDLED_EXCEPTION: An unhandled error occurred.', {
      errorMessage: error.message,
      errorStack: error.stack,
    });
    
    // Return a generic server error to the client
    return NextResponse.json({ error: 'An internal server error occurred during image generation.' }, { status: 500 });
  }
}
