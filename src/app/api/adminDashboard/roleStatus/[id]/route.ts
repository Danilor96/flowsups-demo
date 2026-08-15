import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const roleId = parseInt(params.id);

  const formData = await request.formData();

  const roleStatusSchema = z.object({
    roleStatus: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = roleStatusSchema.safeParse({
    roleStatus: formData.get('roleStatus'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldsError: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { roleStatus } = validatedData.data;

  try {
    const data = mockDb.roles.update({
      where: {
        id: roleId,
      },
      data: {
        status_id: roleStatus === '1' ? 2 : 1,
      },
    });

    return NextResponse.json({ successMessage: 'Role Status Sucessfully Changed' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
