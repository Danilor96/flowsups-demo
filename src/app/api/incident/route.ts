import { z } from 'zod';
import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { auth } from '@/auth';

const apiKey = process.env.RESEND_API_KEY;
const resend = new Resend(apiKey);

export async function POST(request: Request) {
  const formData = await request.formData();

  const session = await auth();

  const user = session?.user;

  const incidentSchema = z.object({
    incident: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please, enter at least 10 characters'),
    section: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
  });

  const validatedData = incidentSchema.safeParse({
    incident: formData.get('incident'),
    section: formData.get('section'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { incident, section } = validatedData.data;

  try {
    const reporterUser = `${
      `${user?.name}${user?.last_name ? ' ' + user?.last_name : ''}${
        user?.username ? ' ' + user?.username : ''
      }` ||
      user?.email ||
      'Guest User'
    }`;

    const { data, error } = await resend.emails.send({
      from: 'Flowsups <team@mail.flowsups.com>',
      to: ['maintenance@flowsups.com'],
      subject: `Flowsups incident report by ${reporterUser}`,
      html: `<img src="https://firebasestorage.googleapis.com/v0/b/flowsups-iles.appspot.com/o/documents%2Fflowsups%20(1).png?alt=media&token=b4bd1d74-1794-4687-bbd5-bae1bf0dcd68"/>
      <p><strong>An incident was reported by:</strong> ${reporterUser}</p>
      <p><strong>Section:</strong> ${section || 'no specific section'}</p>
      <p><strong>Description:</strong> ${incident}</p>`,
    });

    const incidentData = await prisma.incidents.create({
      data: {
        incident: incident,
        section: section,
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Incident Successfully Sended' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
