import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prisma';
import { z } from 'zod';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function GET() {
  try {
    const data = await prisma.sms_limit_warning_recipients.findMany();

    //await prisma.$disconnect();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const permissionsCheck = await checkPermissions(48);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const formData = await request.formData();

  const recipientSchema = z.object({
    smsLimitWarningRecipiens: z.string().email({ message: 'Please enter a valid value' }),
  });

  const validatedData = recipientSchema.safeParse({
    smsLimitWarningRecipiens: formData.get('smsLimitWarningRecipiens'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { smsLimitWarningRecipiens } = validatedData.data;

  try {
    const data = await prisma.sms_limit_warning_recipients.create({
      data: {
        recipient: smsLimitWarningRecipiens,
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Recipient Saved Successfully' }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Sever Error' }, { status: 500 });
  }
}
