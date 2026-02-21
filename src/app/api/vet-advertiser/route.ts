import { NextResponse } from 'next/server';
import { vetAdvertiser } from '@/ai/flows/vet-advertiser-flow';
import { VetAdvertiserInputSchema } from '@/types/advertiser-vetting';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = VetAdvertiserInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid request body',
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const result = await vetAdvertiser(parsed.data);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('VET_ADVERTISER_API_ERROR', error);
    return NextResponse.json(
      { error: 'Failed to vet advertiser. Please try again later.' },
      { status: 500 },
    );
  }
}

