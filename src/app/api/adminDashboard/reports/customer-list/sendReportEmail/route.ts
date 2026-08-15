import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { auth } from '@/auth';

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_EMAIL_FROM || 'Acme <onboarding@resend.dev>';

function getResend() {
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not defined');
  }

  return new Resend(apiKey);
}

export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();

  const emailSchema = z.object({
    emailBody: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a message in the email body'),
    subject: z.string({ invalid_type_error: 'Please enter a valid value' }).min(1, 'Please enter a subject'),
    recipients: z.array(z.string({ invalid_type_error: 'Please enter a valid value' })),
    senderId: z.string({ invalid_type_error: 'Please enter a valid value' }).min(1, 'Please enter a value'),
    fileAtt: z.instanceof(File, { message: 'error in file' })
  });

  const arrayData = formData.get('recipientsArray');

  const validatedData = emailSchema.safeParse({
    emailBody: formData.get('emailBody'),
    subject: formData.get('subject'),
    recipients: typeof arrayData === 'string' ? JSON.parse(arrayData) : undefined,
    senderId: formData.get('senderId'),
    fileAtt: formData.get('fileAtt')
  });

  if (!validatedData.success) {
    return NextResponse.json({ fieldErrors: validatedData.error.flatten().fieldErrors }, { status: 422 });
  }

  const { emailBody, recipients, senderId, subject, fileAtt } = validatedData.data;
  const fileForResend = Buffer.from(await fileAtt.arrayBuffer());

  if (!recipients || recipients.length === 0) {
    return NextResponse.json({ fieldErrors: { recipients: ['Please select at least one recipient'] } }, { status: 422 });
  }

  try {

    const resend = getResend();

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: recipients,
      subject: subject,
      html: emailBody,
      attachments: [
        {
          filename: fileAtt.name,
          content: fileForResend,
          content_type: fileAtt.type
        }
      ]
    });

    return NextResponse.json({ successMessage: 'Emails Successfully Sent' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
