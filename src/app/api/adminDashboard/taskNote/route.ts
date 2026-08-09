import { checkPermissions } from '@/app/libs/auth-helpers';
import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(request: Request) {
  const permissionsCheck = await checkPermissions(20);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const formData = await request.formData();

  const taskNoteSchema = z.object({
    note: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    createdById: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    createdAt: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    taskId: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = taskNoteSchema.safeParse({
    note: formData.get('note'),
    createdById: formData.get('createdById'),
    createdAt: formData.get('createdAt'),
    taskId: formData.get('taskId'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { createdById, note, createdAt, taskId } = validatedData.data;

  try {
    const data = await prisma.task_Notes.create({
      data: {
        created_at: new Date(createdAt),
        created_by_id: parseInt(createdById),
        note: note,
        task_id: parseInt(taskId),
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Note Successfully Created' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
