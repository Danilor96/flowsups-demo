import { z } from 'zod';
import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { checkDuplicateEmailTemplatesNames } from '@/app/libs/duplicateValues/duplicateValues';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function POST(request: Request) {
  const permissionsCheck = await checkPermissions(51);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const formData = await request.formData();

  const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const emailTemplateSchema = z.object({
    userId: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    name: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(5, 'Please, enter at least 5 characters'),
    header: z.any().refine((file: File) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Only .jpg, .jpeg, .png and .webp formats are supported',
    }),
    template: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(10, 'Please, enter at least 10 characters'),
    subject: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    footer: z.any().refine((file: File) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Only .jpg, .jpeg, .png and .webp formats are supported',
    }),
    category: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    letterhead: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  });

  const validatedData = emailTemplateSchema.safeParse({
    userId: formData.get('userId'),
    name: formData.get('name'),
    header: formData.get('header'),
    template: formData.get('template'),
    subject: formData.get('subject'),
    footer: formData.get('footer'),
    category: formData.get('category'),
    letterhead: formData.get('letterhead'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { name, header, template, footer, category, letterhead, userId, subject } =
    validatedData.data;

  let data: any;

  try {
    if (letterhead) {
      const letterheadData = mockDb.letterhead.findFirst();

      const templateName = await checkDuplicateEmailTemplatesNames(name);

      data = mockDb.email_template.create({
        data: {
          body: template,
          created_at: new Date(),
          created_by: parseInt(userId),
          category_id: parseInt(category),
          name: templateName,
          subject: subject,
          header_id: letterheadData?.header_id || null,
          footer_id: letterheadData?.footer_id || null,
          published: true,
        },
      });
    } else {
      let headerUrl: number | null = null;
      let footerUrl: number | null = null;

      if (header) {
        const headerImage = mockDb.header_email_template.create({
          data: {
            header: `https://firebasestorage.googleapis.com/v0/b/demo/o/images%2F${header.name}`,
            name: header.name,
          },
        });

        headerUrl = headerImage.id;
      }

      if (footer) {
        const footerImage = mockDb.footer_email_template.create({
          data: {
            footer: `https://firebasestorage.googleapis.com/v0/b/demo/o/images%2F${footer.name}`,
            name: footer.name,
          },
        });

        footerUrl = footerImage.id;
      }

      const templateName = await checkDuplicateEmailTemplatesNames(name);

      data = mockDb.email_template.create({
        data: {
          body: template,
          created_at: new Date(),
          created_by: parseInt(userId),
          category_id: parseInt(category),
          name: templateName,
          subject: subject,
          header_id: headerUrl ? headerUrl : null,
          footer_id: footerUrl ? footerUrl : null,
          published: true,
        },
      });
    }

    return NextResponse.json({ successMessage: 'Template Created Successfully' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const data = mockDb.email_template.findMany();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}