import { NextResponse } from 'next/server';
import { z } from 'zod';
import { mockDb } from '@/app/libs/mock-db';

const mockUploadUrl = (name: string) =>
  `https://firebasestorage.googleapis.com/v0/b/flowsups-iles.appspot.com/o/images%2F${encodeURIComponent(name)}?alt=media`;

export async function GET() {
  try {
    const data = mockDb.letterhead.findFirst();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const letterheadSchema = z.object({
    headerInput: z.any().refine((file: File) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Only .jpg, .jpeg, .png and .webp formats are supported',
    }),
    footerInput: z.any().refine((file: File) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Only .jpg, .jpeg, .png and .webp formats are supported',
    }),
  });

  const validatedData = letterheadSchema.safeParse({
    headerInput: formData.get('headerInput'),
    footerInput: formData.get('footerInput'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { footerInput, headerInput } = validatedData.data;

  try {
    let letterheadId: number | null = null;

    if (headerInput) {
      const path = mockUploadUrl(headerInput.name);

      const header = mockDb.header_email_template.create({
        data: {
          header: path,
          name: headerInput.name,
        },
      });

      const letterhead = mockDb.letterhead.create({
        data: {
          header_id: header.id,
        },
      });

      letterheadId = letterhead.id;
    }

    if (footerInput && letterheadId) {
      const path = mockUploadUrl(footerInput.name);

      const footer = mockDb.footer_email_template.create({
        data: {
          footer: path,
          name: footerInput.name,
        },
      });

      mockDb.letterhead.update({
        where: {
          id: letterheadId,
        },
        data: {
          footer_id: footer.id,
          footer: {
            id: footer.id,
            footer: path,
            name: footerInput.name,
          },
        },
      });
    } else if (footerInput && !letterheadId) {
      const path = mockUploadUrl(footerInput.name);

      const footer = mockDb.footer_email_template.create({
        data: {
          footer: path,
          name: footerInput.name,
        },
      });

      mockDb.letterhead.create({
        data: {
          footer_id: footer.id,
        },
      });
    }

    return NextResponse.json({ successMessage: 'Letterhead Successfully Created' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}