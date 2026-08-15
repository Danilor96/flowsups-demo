import { checkPermissions } from '@/app/libs/auth-helpers';
import { mockDb } from '@/app/libs/mock-db';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(request: Request) {
  const permissionsCheck = await checkPermissions(46);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const formData = await request.formData();

  const primaryWebsiteSchema = z.object({
    primaryDealerWebsiteUrl: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .startsWith('https://', 'A website must start with a valid secure URL format')
      .min(18, 'Please, enter at least 18 character including all URL format'),
  });

  const validatedData = primaryWebsiteSchema.safeParse({
    primaryDealerWebsiteUrl: formData.get('primaryDealerWebsiteUrl'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { primaryDealerWebsiteUrl } = validatedData.data;

  try {
    const data = mockDb.business_primary_website_url.create({
      data: {
        url: primaryDealerWebsiteUrl,
      },
    });

    return NextResponse.json({ successMessage: 'Website Successfully Saved' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error ' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const data = mockDb.business_primary_website_url.findFirst();

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
