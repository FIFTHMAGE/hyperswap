import { NextRequest, NextResponse } from 'next/server';

import { wrappedAnalyticsService } from '@/lib/api/wrapped-analytics';

export async function POST(request: NextRequest) {
  try {
    const { address, year } = await request.json();

    if (!address || !year) {
      return NextResponse.json({ error: 'Address and year are required' }, { status: 400 });
    }

    const wrappedData = await wrappedAnalyticsService.generateWrappedData(address, year);

    return NextResponse.json(wrappedData);
  } catch (error) {
    console.error('Wrapped generation error:', error);
    return NextResponse.json({ error: 'Failed to generate wrapped' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');
  const year = searchParams.get('year');

  if (!address || !year) {
    return NextResponse.json({ error: 'Address and year are required' }, { status: 400 });
  }

  // Mock wrapped data retrieval
  return NextResponse.json({
    address,
    year: parseInt(year),
    generated: true,
  });
}
