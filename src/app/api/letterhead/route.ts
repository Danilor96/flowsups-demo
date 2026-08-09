import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { storage } from '@/firebase/firebase.config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function GET() {
  try {
    const data = await prisma.letterhead.findFirst({
      include: {
        header: {
          select: {
            header: true,
          },
        },
        footer: {
          select: {
            footer: true,
          },
        },
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

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

    await prisma.$transaction(async (prisma) => {
      if (headerInput) {
        const fileRef = ref(storage, `images/${headerInput.name}`);
        const doUpload = await uploadBytes(fileRef, headerInput);

        const path = await getDownloadURL(doUpload.ref);

        const header = await prisma.header_email_template.create({
          data: {
            header: path,
            name: headerInput.name,
          },
        });

        const letterhead = await prisma.letterhead.create({
          data: {
            header_id: header.id,
          },
        });

        letterheadId = letterhead.id;
      }

      if (footerInput && letterheadId) {
        const fileRef = ref(storage, `images/${footerInput.name}`);
        const doUpload = await uploadBytes(fileRef, footerInput);

        const path = await getDownloadURL(doUpload.ref);

        const footer = await prisma.footer_email_template.create({
          data: {
            footer: path,
            name: footerInput.name,
          },
        });

        await prisma.letterhead.update({
          where: {
            id: letterheadId,
          },
          data: {
            footer_id: footer.id,
          },
        });
      } else if (footerInput && !letterheadId) {
        const fileRef = ref(storage, `images/${footerInput.name}`);
        const doUpload = await uploadBytes(fileRef, footerInput);

        const path = await getDownloadURL(doUpload.ref);

        const footer = await prisma.footer_email_template.create({
          data: {
            footer: path,
            name: footerInput.name,
          },
        });

        await prisma.letterhead.create({
          data: {
            footer_id: footer.id,
          },
        });
      }
    });

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Letterhead Successfully Created' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
