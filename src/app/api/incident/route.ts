import { z } from 'zod';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { mockDb } from '@/app/libs/mock-db';

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

    mockDb.incidents.create({
      data: {
        incident: incident,
        section: section,
      },
    });

    return NextResponse.json({ successMessage: 'Incident Successfully Sended' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}