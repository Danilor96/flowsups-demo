import { checkPermissions } from '@/app/libs/auth-helpers';
import { getCustomerSmsTemplateVariablesValues } from '@/app/libs/data';
import { createEvent } from '@/app/libs/events/events';
import prisma from '@/app/libs/prisma';
import { dataObject, replaceVariables, sendSms } from '@/app/libs/smsTemplateFunctionsAndTwilioSms';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(5);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const appointmentId = parseInt(params.id);

  const formData = await request.formData();

  const session = await auth();

  const userId = session?.user.id;

  const confirmationSchema = z.object({
    customerId: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    toggleNumber: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    manualConfirmationMssg: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
  });

  const validatedData = confirmationSchema.safeParse({
    customerId: formData.get('customerId'),
    toggleNumber: formData.get('toggleNumber'),
    manualConfirmationMssg: formData.get('manualConfirmationMssg'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { customerId, toggleNumber, manualConfirmationMssg } = validatedData.data;

  try {
    // send appointment confirmation message to customer

    const customerMobileNumberAndSellerId = await prisma.clients.findUnique({
      where: {
        id: parseInt(customerId),
      },
      select: {
        mobile_phone: true,
        home_phone: true,
        home_default: true,
        seller_id: true,
      },
    });

    const appointmentData = await prisma.appointments.findUnique({
      where: {
        id: appointmentId,
      },
    });

    const sellerId = userId;

    let phoneNumber = customerMobileNumberAndSellerId?.mobile_phone;
    let appointmentMessage = '';

    if (
      (customerMobileNumberAndSellerId &&
        customerMobileNumberAndSellerId.home_default &&
        customerMobileNumberAndSellerId.home_phone &&
        toggleNumber) ||
      (customerMobileNumberAndSellerId &&
        !customerMobileNumberAndSellerId.home_default &&
        customerMobileNumberAndSellerId.home_phone &&
        toggleNumber)
    ) {
      phoneNumber = customerMobileNumberAndSellerId.home_phone;
    }

    const startDate = appointmentData?.start_date.toISOString();

    const endDate = appointmentData?.end_date.toISOString();

    const automaticSmsSettings = await prisma.automatic_sms.findFirst({
      select: {
        appointment_confirmation: true,
        appointment_confirmation_template: true,
      },
    });

    if (
      automaticSmsSettings &&
      automaticSmsSettings.appointment_confirmation &&
      automaticSmsSettings.appointment_confirmation_template?.id
    ) {
      appointmentMessage = automaticSmsSettings.appointment_confirmation_template.template;
    } else if (manualConfirmationMssg) {
      appointmentMessage = manualConfirmationMssg;
    } else {
      throw 'There must be a message for the appointment confirmation';
    }

    const customerVariablesValues = await getCustomerSmsTemplateVariablesValues(customerId);

    const dataObj = dataObject(customerVariablesValues, startDate, endDate);

    const sms = replaceVariables(appointmentMessage || '', dataObj);

    sendSms(sms, phoneNumber || '', sellerId?.toString() || '', undefined, undefined, false);

    const confirmationSent = await prisma.clients.update({
      where: {
        id: parseInt(customerId),
      },
      data: {
        appointment_confirmation_sms_sent: true,
      },
    });

    const appointment = await prisma.appointments.update({
      where: {
        id: appointmentId,
      },
      data: {
        confirmation_sent: true,
      },
    });

    const description = 'Appointment confirmation sms sent';

    if (userId) await createEvent(description, userId, parseInt(customerId));

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Message Successfully Sended' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
