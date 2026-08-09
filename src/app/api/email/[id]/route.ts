import {
  ActivityType,
  sellerActivityEventEmitterAsync,
} from '@/app/libs/services/salesPointsService';
import { NextResponse } from 'next/server';
import { checkPermissions } from '@/app/libs/auth-helpers';
import { Resend } from 'resend';
import { Permissions } from '@/app/libs/definitions/permissions/permissions';
import { z } from 'zod';
import { auth } from '@/auth';
import { getCustomerSmsTemplateVariablesValues } from '@/app/libs/data';
import { dataObject, replaceVariables } from '@/app/libs/smsTemplateFunctionsAndTwilioSms';
import prisma from '@/app/libs/prisma';
import { createEvent } from '@/app/libs/events/events';
import { LeadHistoryCategoriesEnum } from '@/app/ui/dashboard/clientSystem/clientDetail/leadHistory/categoriesIdMap';
import { CustomersStatuses } from '@/app/libs/customer/customersFunctions';

const apiKey = process.env.RESEND_API_KEY;
const resend = new Resend(apiKey);

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(Permissions.CustomerSendEmail);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const customerId = Number(params.id);

  const session = await auth();
  const userSession = session?.user;

  const formData = await request.formData();

  const emailSchema = z.object({
    emailBody: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a message in the email body'),
    subject: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a subject'),
    recipient: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a email recipient'),
    senderId: z.coerce
      .number({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    headerImage: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    footerImage: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    assignedTo: z.coerce.number({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  });

  const validatedData = emailSchema.safeParse({
    emailBody: formData.get('emailBody'),
    subject: formData.get('subject'),
    recipient: formData.get('recipient'),
    senderId: formData.get('senderId'),
    headerImage: formData.get('headerImage'),
    footerImage: formData.get('footerImage'),
    assignedTo: formData.get('assignedTo'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { emailBody, recipient, senderId, subject, footerImage, headerImage, assignedTo } =
    validatedData.data;

  try {
    const customerVariablesValues = await getCustomerSmsTemplateVariablesValues(
      customerId.toString(),
    );

    const dataObj = dataObject(customerVariablesValues);

    const body = replaceVariables(emailBody || '', dataObj);
    const header = `<p><img width="100%" height="auto" src="${headerImage}" alt="Image for the email header template"></p>`;
    const footer = `<p><img width="100%" height="auto" src="${footerImage}" alt="Image for the email footer template"></p>`;

    const html = `${header}${body}${footer}`;

    await resend.emails.send({
      from: 'Flowsups <team@mail.flowsups.com>',
      to: [recipient],
      subject: subject,
      html: html,
    });

    await prisma.client_has_lead.create({
      data: {
        created_at: new Date(),
        assigned_to_id: assignedTo ? assignedTo : undefined,
        client_id: customerId,
        status_id: 2,
        created_by_id: senderId,
        lead_id: LeadHistoryCategoriesEnum.ManualEmailSent,
      },
    });

    await prisma.leads.updateMany({
      where: {
        customer_id: customerId,
        is_active: true,
        customer_status_id: {
          in: [CustomersStatuses.New, CustomersStatuses.Lost],
        },
      },
      data: {
        customer_status_id: CustomersStatuses.Contact_Attempt,
      },
    });

    const description = 'Email sent';

    await createEvent(description, senderId, customerId, new Date());

    // logic for assigning points to sellers
    if (userSession?.id) {
      // event is sent to the socket server to run the seller activity counter in the background without adding latency to the current response.
      sellerActivityEventEmitterAsync({
        userId: userSession.id,
        activityType: ActivityType.EMAIL_SENT,
      });
    }

    return NextResponse.json({ successMessage: 'Email Successfully Sent' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
