import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { success: false, message: "OpenAI API key not configured" },
      { status: 503 }
    );
  }

  try {
    // Return some default questions for now
    return NextResponse.json({
      success: true,
      questions: [
        "What's a hobby you've recently started?",
        "If you could have dinner with any historical figure, who would it be?",
        "What's a simple thing that makes you happy?"
      ]
    });
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      // OpenAI API error handling
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      // General error handling
      console.error('An unexpected error occurred:', error);
      throw error;
    }
  }
}