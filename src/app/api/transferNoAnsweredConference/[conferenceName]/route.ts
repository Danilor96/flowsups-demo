import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(request: Request, { params }: { params: { conferenceName: string } }) {
  const conferenceName = params.conferenceName;

  const formData = await request.formData();

  const currentCallSchema = z.object({
    conferenceSid: z.string({ invalid_type_error: 'Please enter a value' }).min(1),
    salesrepnum: z.string({ invalid_type_error: 'Please enter a value' }).nullable(),
    bdcnum: z.string({ invalid_type_error: 'Please enter a value' }).nullable(),
  });

  const validatedData = currentCallSchema.safeParse({
    conferenceSid: formData.get('conferenceSid'),
    salesrepnum: formData.get('salesrepnum'),
    bdcnum: formData.get('bdcnum'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { bdcnum, conferenceSid, salesrepnum } = validatedData.data;

  try {
    mockDb.conferences_names.update({
      where: {
        conference_name: conferenceName,
      },
      data: {
        answered: true,
      },
    });

    const conferenceInProgess = { status: 'in-progress' };

    const participantsList = [
      { callSid: 'CA-mock-customer', endConferenceOnExit: true },
      { callSid: 'CA-mock-agent', endConferenceOnExit: false },
    ];

    const callCreation = async (phoneNumber: string) => {
      // conference participant creation mocked
    };

    if (conferenceInProgess.status !== 'completed' && participantsList.length > 0) {
      if (salesrepnum) {
        await callCreation(salesrepnum);
      }

      if (bdcnum) {
        await callCreation(bdcnum);
      }
    }

    return NextResponse.json({ successMessage: 'Transfer Successfully Completed' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}