import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function GET() {
  const permissionsCheck = await checkPermissions(43);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  try {
    const data = mockDb.system_accesses.findMany();

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
