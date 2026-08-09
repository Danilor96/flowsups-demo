import prisma from '@/app/libs/prisma';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await prisma?.files.findMany({
      where: {
        client_file: {
          some: {
            client_id: parseInt(params.id),
          },
        },
      },
      select: {
        id: true,
        stipulation: true,
        uploaded_on: true,
        file: true,
        path: true,
        content_type: true,
        client_file: {
          select: {
            uploader_user: {
              select: {
                name: true,
                last_name: true,
                id: true,
              },
            },
          },
        },
      },
    });

    //await prisma?.$disconnect();

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const formData = await request.formData();

  const fileSchema = z.object({
    file: z
      .string({ invalid_type_error: 'Please, enter a valida value' })
      .min(1, 'Please enter a value'),
    path: z
      .string({ invalid_type_error: 'Please, enter a valida value' })
      .min(1, 'Please enter a value'),
    stipulation: z
      .string({ invalid_type_error: 'Please, enter a valida value' })
      .min(1, 'Please enter a value'),
    uploadedOn: z
      .string({ invalid_type_error: 'Please, enter a valida value' })
      .min(1, 'Please enter a value'),
    uploadedBy: z
      .string({ invalid_type_error: 'Please, enter a valida value' })
      .min(1, 'Please enter a value'),
    contentType: z
      .string({ invalid_type_error: 'Please, enter a valida value' })
      .min(1, 'Please enter a value'),
  });

  const validatedFields = fileSchema.safeParse({
    file: formData.get('file'),
    path: formData.get('path'),
    stipulation: formData.get('stipulation'),
    uploadedOn: formData.get('uploadedOn'),
    uploadedBy: formData.get('uploadedBy'),
    contentType: formData.get('contentType'),
  });

  if (!validatedFields.success) {
    return NextResponse.json(
      { fieldsError: validatedFields.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { contentType, file, path, stipulation, uploadedBy, uploadedOn } = validatedFields.data;

  try {
    const data = await prisma?.files.create({
      data: {
        file: file,
        path: path,
        stipulation: stipulation,
        uploaded_by: parseInt(uploadedBy),
        uploaded_on: new Date(uploadedOn),
        content_type: contentType,
        client_file: {
          create: {
            client_id: parseInt(params.id),
            uploader_user_id: parseInt(uploadedBy),
          },
        },
      },
    });

    //await prisma?.$disconnect();

    return NextResponse.json({ successMessage: 'File Uploaded' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const fileId = params.id;

  try {
    const data = await prisma.files.delete({
      where: {
        id: parseInt(fileId),
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'File Successfully Deleted' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
