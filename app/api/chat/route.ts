import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.0-flash-001'),
    system: 'You are a helpful assistant.',
    messages,
  });

  return result.toDataStreamResponse();
}