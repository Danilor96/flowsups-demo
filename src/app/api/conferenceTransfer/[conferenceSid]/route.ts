import { NextResponse } from 'next/server';
import { z } from 'zod';
import { mockDb } from '@/app/libs/mock-db';

export async function POST(request: Request, { params }: { params: { conferenceSid: string } }) {
  const conferenceSid = params.conferenceSid;

  const formData = await request.formData();

  const currentCallSchema = z.object({
    conferenceName: z.string({ invalid_type_error: 'Please enter a value' }).min(1),
    salesrepnum: z.string({ invalid_type_error: 'Please enter a value' }).nullable(),
    bdcnum: z.string({ invalid_type_error: 'Please enter a value' }).nullable(),
  });

  const validatedData = currentCallSchema.safeParse({
    conferenceName: formData.get('conferenceName'),
    salesrepnum: formData.get('salesrepnum'),
    bdcnum: formData.get('bdcnum'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { salesrepnum, bdcnum, conferenceName } = validatedData.data;

  try {
    const conferenceInProgess = { status: 'in-progress' };

    const participantsList = [
      { callSid: 'CA-mock-customer', endConferenceOnExit: true },
      { callSid: 'CA-mock-agent', endConferenceOnExit: false },
    ];

    const customerCall = participantsList.find(
      (participant) => participant.endConferenceOnExit === true,
    );

    const handleCustomer = async () => {
      const customerCallSid = customerCall?.callSid;

      if (customerCallSid && participantsList.length > 1) {
        // conference participant hold update mocked
      }
    };

    const foundCall = mockDb.client_calls.findUnique({
      where: {
        call_sid: conferenceSid,
      },
    });

    const customerPhoneNumber = foundCall ? { phone_number: foundCall.phone_number } : null;

    if (
      conferenceInProgess.status !== 'completed' &&
      participantsList.length > 0 &&
      (salesrepnum || bdcnum)
    ) {
      await handleCustomer();
    }

    return NextResponse.json({ successMessage: 'Call Successfully Transferred' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}