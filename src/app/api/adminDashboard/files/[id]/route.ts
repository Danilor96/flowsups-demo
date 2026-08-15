import { mockDb } from '@/app/libs/mock-db';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const clientFileRows = mockDb.client_file.findMany({
      where: {
        client_id: parseInt(params.id),
      },
    });

    const data = clientFileRows.map((row: any) => {
      const file = mockDb.files.findUnique({ where: { id: row.file_id } });
      return file
        ? {
            ...file,
            client_file: [
              {
                id: row.id,
                file_id: row.file_id,
                client_id: row.client_id,
                uploader_user_id: row.uploader_user_id,
                uploader_user: row.uploader_user,
              },
            ],
          }
        : null;
    });

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

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
    const data = mockDb.files.create({
      data: {
        file: file,
        path: path,
        stipulation: stipulation,
        uploaded_by: parseInt(uploadedBy),
        uploaded_on: new Date(uploadedOn),
        content_type: contentType,
        client_file: [
          {
            client_id: parseInt(params.id),
            uploader_user_id: parseInt(uploadedBy),
          },
        ],
      },
    });

    mockDb.client_file.create({
      data: {
        file_id: data.id,
        client_id: parseInt(params.id),
        uploader_user_id: parseInt(uploadedBy),
      },
    });

    return NextResponse.json({ successMessage: 'File Uploaded' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const fileId = params.id;

  try {
    const data = mockDb.files.delete({
      where: {
        id: parseInt(fileId),
      },
    });

    return NextResponse.json({ successMessage: 'File Successfully Deleted' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}