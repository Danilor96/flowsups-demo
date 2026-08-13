import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(request: Request, { params }: { params: { callSid: string } }) {
  const currentCallSid = params.callSid;

  const formData = await request.formData();

  const currentCallSchema = z.object({
    sellerPhoneNumber: z.string({ invalid_type_error: 'Please enter a value' }).nullable(),
    bdcPhoneNumber: z.string({ invalid_type_error: 'Please enter a value' }).nullable(),
  });

  const validatedData = currentCallSchema.safeParse({
    sellerPhoneNumber: formData.get('sellerPhoneNumber'),
    bdcPhoneNumber: formData.get('bdcPhoneNumber'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { bdcPhoneNumber, sellerPhoneNumber } = validatedData.data;

  try {
    if (bdcPhoneNumber || sellerPhoneNumber) {
      if (currentCallSid) {
        const twiml = `
        <Response>
          <Say>${
            sellerPhoneNumber
              ? 'This call will be transfered to a flowsups sales representative'
              : 'This call will be transfered to a flowsups bdc manager'
          }</Say>
          <Dial>
            <Number>+1${sellerPhoneNumber ? sellerPhoneNumber : bdcPhoneNumber}</Number>
          </Dial>
        </Response>
            `;
      }
    }

    return NextResponse.json({ successMessage: 'Call Successfully Transferred' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}