// ⚠️ Auto-fixed placeholder for build. This file is not used by the application.
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  return new NextResponse(JSON.stringify({ message: "Safe build placeholder" }), {
    headers: { "Content-Type": "application/json" }
  });
}

export async function POST(req: Request) {
  return new NextResponse(JSON.stringify({ message: "Safe build placeholder" }), {
    headers: { "Content-Type": "application/json" }
  });
}
