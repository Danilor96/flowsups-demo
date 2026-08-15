import { mockDb } from '@/app/libs/mock-db';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { ensureActiveUserOrGetReplacement } from '@/app/libs/round-robin';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const taskId = parseInt(params.id);

  const formData = await request.formData();

  const session = await auth();

  const userId = session?.user?.id || 1;

  const followUpSchema = z
    .object({
      noteInput: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      assignedTo: z
        .array(z.string({ invalid_type_error: 'Please enter a valid value' }))
        .optional(),
      followUpDate: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
      completedBy: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
    })
    .superRefine((data, ctx) => {
      const { followUpDate, assignedTo } = data;

      if (followUpDate) {
        if (!assignedTo) {
          ctx.addIssue({
            path: ['assignedTo'],
            message: 'Please select at least one user',
            code: 'custom',
          });
        }

        if (assignedTo && assignedTo.length < 1) {
          ctx.addIssue({
            path: ['assignedTo'],
            message: 'Please select at least one user',
            code: 'custom',
          });
        }
      }
    });

  const assignedArray = formData.get('assignedTo');

  const validatedData = followUpSchema.safeParse({
    noteInput: formData.get('noteInput'),
    assignedTo: typeof assignedArray === 'string' ? JSON.parse(assignedArray) : [],
    followUpDate: formData.get('followUpDate'),
    completedBy: formData.get('completedBy'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { assignedTo, completedBy, followUpDate, noteInput } = validatedData.data;

  try {
    const relatedTaskUser = await mockDb.tasks.findUnique({
      where: {
        id: taskId,
      },
    });

    if (followUpDate && assignedTo && assignedTo.length > 0 && userId) {
      const customerRelated = relatedTaskUser?.customer
        ? `${relatedTaskUser?.customer?.first_name || ''} ${
            relatedTaskUser?.customer?.last_name || ''
          }`
        : null;

      const baseTaskData = {
        created_by: userId,
        deadline: new Date(followUpDate).toISOString(),
        description: noteInput,
        status: 1,
        title: `Follow Up${customerRelated ? ` with ${customerRelated}` : ''}`,
      };

      const tasksToCreate = [];
      const customerId = relatedTaskUser?.customer?.id;

      for (const el of assignedTo) {
        const assignedId = await ensureActiveUserOrGetReplacement(parseInt(el), customerId);
        tasksToCreate.push({
          ...baseTaskData,
          assigned_to: assignedId,
        });
      }

      const newtasks = await mockDb.tasks.createMany({
        data: tasksToCreate,
      });
    }

    const data = await mockDb.tasks.update({
      where: {
        id: taskId,
      },
      data: {
        status: 2,
        completed_by: parseInt(completedBy),
        finished_at: new Date().toISOString(),
      },
    });

    const createdNote = await mockDb.task_Notes.create({
      data: {
        note: noteInput,
        created_at: new Date().toISOString(),
        created_by_id: userId,
        task_id: taskId,
      },
    });

    mockDb.tasks.update({
      where: {
        id: taskId,
      },
      data: {
        notes: [...(data.notes || []), createdNote],
      },
    });

    return NextResponse.json({ successMessage: 'Task Successfully Completed' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
