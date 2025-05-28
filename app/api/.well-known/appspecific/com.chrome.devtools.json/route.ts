import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    version: "1.0",
    name: "Unindo Destinos",
    description: "PWA para planejamento de viagens"
  }, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    }
  });
}
