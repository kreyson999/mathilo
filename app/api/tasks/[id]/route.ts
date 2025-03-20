import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export async function POST(request: NextRequest) {
  try {
    const { image, question, options } = await request.json();

    if (!image || !question || !options) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { solution, solutionSteps } = options

    console.log("czekam na odpowiedź")

    const result = await generateText({
        model: google('gemini-2.0-flash-001'),
        system: 'Jesteś nauczycielem, który sprawdza zadanie ucznia. Bądź dokładny i zwracaj uwagę na szczegóły. Zadanie musi być zgodne z podanym rozwiązaniem. Twoja odpowiedź powinna być w formacie JSON i wygladać tak: { isCorrect: true/false, points: zsumowana liczba punktów uzyskanych, reasoning: wyjaśnij swoją logikę }.',
        messages: [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: `Sprawdź czy to zdjęcie przedstawia poprawną odpowiedź na poniższe pytanie: ${question}. Oczekiwana odpowiedź to: ${solution}. Policz też na ile punktów zasługuje rozwiązanie użytkownika. Kroki do uzyskania punktów to: ${solutionSteps}.`
                    },
                    {
                        type: 'image',
                        image
                    }
                ]
            }
        ]
      });

    const response = result.text.replace('```json', '').replace('```', '')

    const parsedObject = JSON.parse(response)

    return NextResponse.json(parsedObject);
    
  } catch (error) {
    console.error('Error processing answer:', error);
    return NextResponse.json(
      { error: 'Failed to process answer' },
      { status: 500 }
    );
  }
}