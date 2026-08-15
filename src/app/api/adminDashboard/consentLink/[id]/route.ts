import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { randomBytes, randomUUID } from 'crypto';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const customerId = parseInt(params.id);

  const generateCode = async () => {
    let code;
    let exists = true;
    const actualDate = new Date();

    while (exists) {
      code = randomUUID?.() ?? randomBytes(32).toString('hex');

      const dbCode = mockDb.consent_code.findUnique({
        where: {
          customer_id: customerId,
        },
      });

      if (!dbCode) {
        const codeExists = mockDb.consent_code.findUnique({
          where: {
            token: code,
          },
        });

        if (!codeExists) {
          mockDb.consent_code.create({
            data: {
              code_expired: new Date(actualDate.getTime() + 24 * 60 * 60 * 1000),
              customer_id: customerId,
              token: code,
            },
          });

          break;
        }
      }

      if (dbCode) {
        if (new Date() >= dbCode.code_expired) {
          mockDb.consent_code.delete({
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

  try {
    const code = await generateCode();
    const path = process.env.NEXTAUTH_URL;

    return NextResponse.json(`${path}/consent/${code}`, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
