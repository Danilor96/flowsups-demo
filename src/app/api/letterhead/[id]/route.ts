import { z } from 'zod';
import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { storage } from '@/firebase/firebase.config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const letterheadId = parseInt(params.id);

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
    if (headerInput) {
      await prisma.$transaction(async (prisma) => {
        const letterhead = await prisma.letterhead.findUnique({
          where: {
            id: letterheadId,
          },
          include: {
            header: true,
          },
        });

        if (letterhead && letterhead.header) {
          const fileLetterheadRef = ref(storage, `images/${letterhead.header.name}`);

          await deleteObject(fileLetterheadRef);
        }
        const fileRef = ref(storage, `images/${headerInput.name}`);

        const doUpload = await uploadBytes(fileRef, headerInput);

        const path = await getDownloadURL(doUpload.ref);

        const header = await prisma.letterhead.update({
          where: {
            id: letterheadId,
          },
          data: {
            header: {
              update: {
                header: path,
                name: headerInput.name,
              },
            },
          },
        });
      });
    }

    if (footerInput) {
      await prisma.$transaction(async (prisma) => {
        const letterhead = await prisma.letterhead.findUnique({
          where: {
            id: letterheadId,
          },
          include: {
            footer: true,
          },
        });

        if (letterhead && letterhead.footer) {
          const fileLetterheadRef = ref(storage, `images/${letterhead.footer.name}`);

          await deleteObject(fileLetterheadRef);
        }
        const fileRef = ref(storage, `images/${footerInput.name}`);

        const doUpload = await uploadBytes(fileRef, footerInput);

        const path = await getDownloadURL(doUpload.ref);

        const footer = await prisma.letterhead.update({
          where: {
            id: letterheadId,
          },
          data: {
            footer: {
              update: {
                footer: path,
                name: headerInput.name,
              },
            },
          },
        });
      });
    }

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Letterhead Successfully Updated' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
