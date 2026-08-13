import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { randomBytes, randomUUID } from 'crypto';

export async function POST(request: Request) {
  const formData = await request.formData();

  const creditAppCodeSchema = z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value');

  const customerIdValue = formData.get('customerId');

  const validatedData = creditAppCodeSchema.safeParse(customerIdValue);

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const customerId = validatedData.data;

  try {
    const code = await generateCode(parseInt(customerId));

    const path = process.env.NEXTAUTH_URL;

    return NextResponse.json({
      successMessage: 'Credit App Code Created',
      data: `${path}/creditApp/${code}`,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

const generateCode = async (customerId: number) => {
  let code = '';
  let exists = true;
  const currentDate = new Date();

  while (exists) {
    code = randomUUID?.() ?? randomBytes(32).toString('hex');

    const dbCode = mockDb.credit_app_code.findUnique({
      where: {
        customer_id: customerId,
      },
    });

    if (!dbCode) {
      const codeExists = mockDb.credit_app_code.findUnique({
        where: {
          token: code,
        },
      });

      if (!codeExists) {
        mockDb.credit_app_code.create({
          data: {
            code_expired: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000),
            customer_id: customerId,
            token: code,
          },
        });

        break;
      }
    }

    if (dbCode) {
      if (new Date() >= dbCode.code_expired) {
        mockDb.credit_app_code.delete({
          where: {
            id: dbCode.id,
          },
        });
      } else {
        code = dbCode.token;
        break;
      }
    }
  }

  return code;
};