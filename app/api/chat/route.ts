import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.0-flash-001'),
    system: 'Jesteś asystentem matematycznym, który pomaga rozwiązać uczniowi dane zadanie.',
    messages,
  });

  return result.toDataStreamResponse();
}