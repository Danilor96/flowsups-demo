import { checkPermissions } from '@/app/libs/auth-helpers';
import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(46);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const urlId = parseInt(params.id);
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
    const data = mockDb.business_primary_website_url.update({
      where: {
        id: urlId,
      },
      data: {
        url: primaryDealerWebsiteUrl,
      },
    });

    return NextResponse.json({ successMessage: 'Website Successfully Updated' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(46);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const urlId = parseInt(params.id);

  try {
    const data = mockDb.business_primary_website_url.delete({
      where: {
        id: urlId,
      },
    });

    return NextResponse.json({ successMessage: 'Website Successfully Deleted' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
