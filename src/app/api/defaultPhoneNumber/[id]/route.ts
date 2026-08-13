import { z } from 'zod';
import { NextResponse } from 'next/server';
import { checkPermissions } from '@/app/libs/auth-helpers';
import { mockDb } from '@/app/libs/mock-db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions([67]);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const customerId = parseInt(params.id);

  const formData = await request.formData();

  const defaultSchema = z
    .object({
      mobileSelected: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      homeSelected: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      workSelected: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      phoneNumber: z
        .string({
          invalid_type_error: 'Default phone number is required',
          required_error: 'Default phone number is required'
        })
        .min(10, 'Enter a valid phone number format')
        .max(10, 'Enter a valid phone number format')
    })
    .superRefine((data, ctx) => {
      const { homeSelected, mobileSelected, workSelected } = data;

      if (!homeSelected && !mobileSelected && !workSelected) {
        ctx.addIssue({
          path: ['mobilePhone'],
          message: 'Please enter a value for default phone number',
          code: 'custom',
        });
      }
    });

  const validatedData = defaultSchema.safeParse({
    mobileSelected: formData.get('mobileSelected'),
    homeSelected: formData.get('homeSelected'),
    workSelected: formData.get('workSelected'),
    phoneNumber: formData.get('phoneNumber'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { mobileSelected, homeSelected, workSelected, phoneNumber } = validatedData.data;

  try {
    mockDb.clients.update({
      where: {
        id: customerId,
      },
      data: {
        mobile_default: mobileSelected ? true : false,
        home_default: homeSelected ? true : false,
        work_default: workSelected ? true : false,
        mobile_phone: mobileSelected ? phoneNumber : undefined,
        home_phone: homeSelected ? phoneNumber : undefined,
        work_phone: workSelected ? phoneNumber : undefined,
      },
    });

    return NextResponse.json({ successMessage: 'Phone Number Successfully Established' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}