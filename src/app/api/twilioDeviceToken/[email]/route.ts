import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { email: string } }) {
  const userEmail = params.email;

  try {
    const token = Buffer.from(
      JSON.stringify({ identity: userEmail ?? 'flowsups', ttl: 86400 }),
    ).toString('base64');

    return NextResponse.json({ token });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}