import { mockDb } from '@/app/libs/mock-db';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { checkDuplicateEmailTemplatesNames } from '@/app/libs/duplicateValues/duplicateValues';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(51);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const templateId = parseInt(params.id);

  const formData = await request.formData();

  const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const emailTemplateSchema = z.object({
    name: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(5, 'Please, enter at least 5 characters'),
    header: z.any().refine((file: File) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Only .jpg, .jpeg, .png and .webp formats are supported',
    }),
    template: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(10, 'Please, enter at least 10 characters'),
    footer: z.any().refine((file: File) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Only .jpg, .jpeg, .png and .webp formats are supported',
    }),
    category: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    letterhead: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  });

  const validatedData = emailTemplateSchema.safeParse({
    name: formData.get('name'),
    header: formData.get('header'),
    template: formData.get('template'),
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

  const { name, header, template, footer, category, letterhead } = validatedData.data;

  let data: any;

  try {
    if (letterhead) {
      const letterheadData = mockDb.letterhead.findFirst();

      const templateName = await checkDuplicateEmailTemplatesNames(name);

      data = mockDb.email_template.update({
        where: {
          id: templateId,
        },
        data: {
          body: template,
          category_id: parseInt(category),
          name: templateName,
          header_id: letterheadData?.header_id || null,
          footer_id: letterheadData?.footer_id || null,
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

      const prevVal = mockDb.email_template.findUnique({
        where: {
          id: templateId,
        },
        select: {
          header_id: true,
          footer_id: true,
        },
      });

      const templateName = await checkDuplicateEmailTemplatesNames(name);

      data = mockDb.email_template.update({
        where: {
          id: templateId,
        },
        data: {
          body: template,
          category_id: parseInt(category),
          name: templateName,
          header_id: headerUrl ? headerUrl : prevVal?.header_id,
          footer_id: footerUrl ? footerUrl : prevVal?.footer_id,
        },
      });
    }

    return NextResponse.json({ successMessage: 'Template Updated Successfully' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const templateId = parseInt(params.id);

  try {
    const data = mockDb.email_template.findUnique({
      where: {
        id: templateId,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}