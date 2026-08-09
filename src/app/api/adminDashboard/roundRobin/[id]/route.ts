import { checkPermissions } from '@/app/libs/auth-helpers';
import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(55);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const roundRobinId = parseInt(params.id);

  const formData = await request.formData();

  const roundRobinSchema = z.object({
    readyForLeads: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    automaticReassignLeads: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .optional(),
    spanTimeId: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    avoidAutomaticReassignOldersLeads: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .optional(),
    daysUntilAvoid: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    assignLeadsDuringStoreHours: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .optional(),
    assignLeadsDuringShiftHours: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .optional(),
    usersMustActivateReadyForLeads: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .optional(),
    createTaskAfterAssignNewLead: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .optional(),
  });

  const validatedData = roundRobinSchema.safeParse({
    readyForLeads: formData.get('readyForLeads'),
    automaticReassignLeads: formData.get('automaticReassignLeads'),
    spanTimeId: formData.get('spanTimeId'),
    avoidAutomaticReassignOldersLeads: formData.get('avoidAutomaticReassignOldersLeads'),
    daysUntilAvoid: formData.get('daysUntilAvoid'),
    assignLeadsDuringStoreHours: formData.get('assignLeadsDuringStoreHours'),
    assignLeadsDuringShiftHours: formData.get('assignLeadsDuringShiftHours'),
    usersMustActivateReadyForLeads: formData.get('usersMustActivateReadyForLeads'),
    createTaskAfterAssignNewLead: formData.get('createTaskAfterAssignNewLead'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const {
    readyForLeads,
    automaticReassignLeads,
    spanTimeId,
    avoidAutomaticReassignOldersLeads,
    daysUntilAvoid,
    assignLeadsDuringStoreHours,
    assignLeadsDuringShiftHours,
    usersMustActivateReadyForLeads,
    createTaskAfterAssignNewLead,
  } = validatedData.data;

  try {
    const data = await prisma.round_robin.update({
      where: { id: roundRobinId },
      data: {
        ready_for_leads: readyForLeads === '1' ? true : false,
        automatic_reassign_leads: automaticReassignLeads === '1' ? true : false,
        span_time_id: spanTimeId ? parseInt(spanTimeId) : null,
        avoid_automatic_reassign_olders_leads:
          avoidAutomaticReassignOldersLeads === '1' ? true : false,
        days_until_avoid: daysUntilAvoid ? parseInt(daysUntilAvoid) : null,
        assign_leads_during_store_hours: assignLeadsDuringStoreHours === '1' ? true : false,
        assign_leads_during_shift_hours: assignLeadsDuringShiftHours === '1' ? true : false,
        users_must_activate_ready_for_leads: usersMustActivateReadyForLeads === '1' ? true : false,
        create_task_after_assign_new_lead: createTaskAfterAssignNewLead === '1' ? true : false,
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Configuration Successfully Saved' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
