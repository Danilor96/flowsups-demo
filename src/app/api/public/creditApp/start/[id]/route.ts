import { mockDb } from '@/app/libs/mock-db';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { StartData } from '@/app/api/adminDashboard/creditApp/types';
import { createEvent } from '@/app/libs/events/events';
import { io } from 'socket.io-client';

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:3001';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const customerId = parseInt(params.id);

  const formData = await request.formData();

  const creditAppSchema = z.object({
    idType: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    idState: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    ssn: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    idNumber: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    dateOfBirth: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    issueDate: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    expirationDate: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    cashdown: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    gender: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    noId: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    nextToAddress: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    consent: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  });

  const validatedData = creditAppSchema.safeParse({
    idType: formData.get('idType'),
    idState: formData.get('idState'),
    ssn: formData.get('ssn'),
    idNumber: formData.get('idNumber'),
    dateOfBirth: formData.get('dateOfBirth'),
    issueDate: formData.get('issueDate'),
    expirationDate: formData.get('expirationDate'),
    cashdown: formData.get('cashdown'),
    gender: formData.get('gender'),
    noId: formData.get('noId'),
    nextToAddress: formData.get('nextToAddress'),
    consent: formData.get('consent'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const {
    idType,
    idState,
    ssn,
    idNumber,
    dateOfBirth,
    issueDate,
    expirationDate,
    cashdown,
    gender,
    noId,
    nextToAddress,
    consent,
  } = validatedData.data;

  try {
    mockDb.credit_app_navigation.upsert({
      where: {
        customer_id: customerId,
      },
      update: {
        nextToAddress: nextToAddress === 'true',
      },
      create: {
        customer_id: customerId,
        nextToAddress: nextToAddress === 'true',
      },
    });

    const updatedData = mockDb.credit_app.upsert({
      where: {
        client_id: customerId,
      },
      update: {
        cash_down: cashdown,
        date_of_birth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender_id: gender ? parseInt(gender) : null,
        id_expiration_date: expirationDate ? new Date(expirationDate) : null,
        id_issue_date: issueDate ? new Date(issueDate) : null,
        id_number: idNumber,
        id_state_id: idState ? parseInt(idState) : null,
        id_type_id: idType ? parseInt(idType) : null,
        ssn: ssn,
        no_id: noId ? true : false,
        send_automated_sms: consent ? true : false,
      },
      create: {
        client_id: customerId,
        cash_down: cashdown,
        date_of_birth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender_id: gender ? parseInt(gender) : null,
        id_expiration_date: expirationDate ? new Date(expirationDate) : null,
        id_issue_date: issueDate ? new Date(issueDate) : null,
        id_number: idNumber,
        id_state_id: idState ? parseInt(idState) : null,
        id_type_id: idType ? parseInt(idType) : null,
        ssn: ssn,
        no_id: noId ? true : false,
        send_automated_sms: consent ? true : false,
      },
    });

    mockDb.clients.update({
      where: {
        id: customerId,
      },
      data: {
        consent_to_sent_sms: consent ? true : false,
        social_security: ssn || '',
        born_date: dateOfBirth ? new Date(dateOfBirth) : null,
      },
    });

    const description = `Fields at Credit App modified by customer`;

    await createEvent(description, undefined, customerId);

    const dataToReturn: StartData = {
      cashdown: updatedData.cash_down,
      consent: updatedData.send_automated_sms,
      dateOfBirth: updatedData.date_of_birth,
      gender: updatedData.gender_id,
      expirationDate: updatedData.id_expiration_date,
      issueDate: updatedData.id_issue_date,
      idNumber: updatedData.id_number,
      idType: updatedData.id_type_id,
      noId: updatedData.no_id,
      ssn: updatedData.ssn,
      idState: updatedData.id_state_id,
    };

    const socket = io(socketUrl);

    socket?.emit('ask_for_update_data', 'creditApp', false, '', {
      customerId,
      employmentStatus: true,
    });

    socket?.disconnect();

    return NextResponse.json({ successMessage: 'Data Successfully Updated', data: dataToReturn });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
