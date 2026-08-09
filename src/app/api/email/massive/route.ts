import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { getCustomerSmsTemplateVariablesValues } from '@/app/libs/data';
import { dataObject, replaceVariables } from '@/app/libs/smsTemplateFunctionsAndTwilioSms';
import { createEvent } from '@/app/libs/events/events';
import { checkPermissions } from '@/app/libs/auth-helpers';

const apiKey = process.env.RESEND_API_KEY;
const resend = new Resend(apiKey);

export async function POST(request: Request) {
  const permissionsCheck = await checkPermissions(59);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const formData = await request.formData();

  const emailSchema = z.object({
    emailBody: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a message in the email body'),
    subject: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a subject'),
    recipients: z.array(z.number({ invalid_type_error: 'Please enter a valid value' })),
    senderId: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    headerImage: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    footerImage: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  });

  const arrayData = formData.get('recipientsArray');

  const validatedData = emailSchema.safeParse({
    emailBody: formData.get('emailBody'),
    subject: formData.get('subject'),
    recipients: typeof arrayData === 'string' ? JSON.parse(arrayData) : undefined,
    senderId: formData.get('senderId'),
    headerImage: formData.get('headerImage'),
    footerImage: formData.get('footerImage'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { emailBody, recipients, senderId, subject, footerImage, headerImage } = validatedData.data;

  try {
    const customers = await prisma.clients.findMany({
      where: {
        id: {
          in: recipients,
        },
      },
      select: {
        id: true,
        mobile_phone: true,
        email: true,
        seller_id: true,
      },
    });

    for (let i = 0; i < recipients.length; i++) {
      const customerId = recipients[i];

      const customerVariablesValues = await getCustomerSmsTemplateVariablesValues(
        customerId.toString(),
      );

      const dataObj = dataObject(customerVariablesValues);

      const body = replaceVariables(emailBody || '', dataObj);

      const customer = customers.find((el) => el.id === customerId);

      if (customer && customer.email) {
        const email = customer.email;

        const dataEmail = await sendEmail(body, subject, email, headerImage, footerImage);

        await prisma.client_has_lead.create({
          data: {
            created_at: new Date(),
            assigned_to_id: customer?.seller_id ? customer.seller_id : undefined,
            client_id: customerId,
            status_id: 2,
            created_by_id: parseInt(senderId),
            lead_id: 8,
          },
        });

        const description = 'Email sent';

        await createEvent(description, parseInt(senderId), customerId, new Date());
      }
    }

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Emails Successfully Sent' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

async function sendEmail(
  body: string,
  subject: string,
  to: string,
  headerImage?: string | null,
  footerImage?: string | null,
) {
  const header = `<p><img width="100%" height="auto" src="${headerImage}" alt="Image for the email header template"></p>`;

  const footer = `<p><img width="100%" height="auto" src="${footerImage}" alt="Image for the email footer template"></p>`;

  const html = `${header}${body}${footer}`;

  const { data, error } = await resend.emails.send({
    from: 'Flowsups <team@mail.flowsups.com>',
    to: [to],
    subject: subject,
    html: html,
  });

  return { data, error };
}
