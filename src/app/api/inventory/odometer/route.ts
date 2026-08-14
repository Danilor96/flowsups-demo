import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = '';

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
