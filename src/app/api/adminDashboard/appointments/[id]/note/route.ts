import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  //   const permissionsCheck = await checkPermissions([76]);

  //   if (permissionsCheck) {
  //     return permissionsCheck;
  //   }

  const appointmentId = parseInt(params.id);
  const formData = await request.formData();

  const noteSchema = z.object({
    note: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    userId: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
  });

  const validatedData = noteSchema.safeParse({
    note: formData.get('note'),
    userId: formData.get('userId'),
  });

  if (!validatedData.success) {
    return NextResponse.json({ fieldErrors: validatedData.error.flatten().fieldErrors }, { status: 422 });
  }

  const { note, userId } = validatedData.data;

  try {
    const appoiment = await prisma.appointments.findFirst({
      where: { id: appointmentId },
      select: {
        id: true,
        user_id: true,
        customer_id: true,
        lead_appointment: {
          select: {
            id: true,
            note_id: true,
            client_id: true,
          },
        },
      },
    });

    if (!appoiment) {
      return NextResponse.json({ serverError: 'Appointment not found' }, { status: 404 });
    }

    if(!userId){
      return NextResponse.json({ serverError: 'User required' }, { status: 404 });
    }

    let lead_appointment = appoiment?.lead_appointment && appoiment?.lead_appointment?.length > 0 ? appoiment?.lead_appointment[0] : null;
    if (!lead_appointment) {
      lead_appointment = await prisma.client_has_lead.create({
        data: {
          created_at: new Date(),
          assigned_to_id: appoiment.user_id,
          client_id: appoiment.customer_id,
          status_id: 2,
          created_by_id: parseInt(userId), 
          lead_id: 2,
          appointment_id: appoiment.id,
          note_id: null,
        },
      });
      //   return NextResponse.json({ serverError: 'Lead Appointment not found' }, { status: 404 });
    }

    if (lead_appointment.note_id) {
      await prisma.notes.update({
        where: { id: lead_appointment.note_id },
        data: { note: note || '' },
      });
    } else {
      const newNote = await prisma.notes.create({
        data: {
          note: note || '',
          client_id: appoiment.customer_id,
          created_at: new Date(),
          created_by_id: parseInt(userId),   
        },
      });
      await prisma.client_has_lead.update({
        where: { id: lead_appointment.id },
        data: { note_id: newNote.id },
      });
    }

    return NextResponse.json({ successMessage: 'Note Successfully Updated' });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
