import { checkPermissions } from '@/app/libs/auth-helpers';
import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(54);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const settingId = parseInt(params.id);
  const formData = await request.formData();

  const customerSettingsSchema = z.object({
    setLead: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    followup: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    setActivated: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    // ignoreFirstNameLastName: z
    //   .string({ invalid_type_error: 'Please enter a valid value' })
    //   .min(1, 'Please enter a value'),
    activateLostCustomerWhenContacted: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    showFollowupWindowWhenCompletingATask: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    completeAllOpenPhoneTasksWhenSpokeToProspectDispositionIsTaken: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = customerSettingsSchema.safeParse({
    setLead: formData.get('setLead'),
    followup: formData.get('followup'),
    setActivated: formData.get('setActivated'),
    // ignoreFirstNameLastName: formData.get('ignoreFirstNameLastName'),
    activateLostCustomerWhenContacted: formData.get('activateLostCustomerWhenContacted'),
    showFollowupWindowWhenCompletingATask: formData.get('showFollowupWindowWhenCompletingATask'),
    completeAllOpenPhoneTasksWhenSpokeToProspectDispositionIsTaken: formData.get(
      'completeAllOpenPhoneTasksWhenSpokeToProspectDispositionIsTaken',
    ),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const {
    activateLostCustomerWhenContacted,
    completeAllOpenPhoneTasksWhenSpokeToProspectDispositionIsTaken,
    followup,
    // ignoreFirstNameLastName,
    setActivated,
    setLead,
    showFollowupWindowWhenCompletingATask,
  } = validatedData.data;

  try {
    const data = await prisma.customer_settings.update({
      where: {
        id: settingId,
      },
      data: {
        lead_lost_after: parseInt(setLead),
        active_lost_customer: activateLostCustomerWhenContacted === 'true' ? true : false,
        complete_all_open_tasks:
          completeAllOpenPhoneTasksWhenSpokeToProspectDispositionIsTaken === 'true' ? true : false,
        set_active_lost_customer_status_to: parseInt(setActivated),
        followup_task_visibility: parseInt(followup),
        // ignore_first_name: ignoreFirstNameLastName === 'true' ? true : false,
        show_followup: showFollowupWindowWhenCompletingATask === 'true' ? true : false,
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Customer Settings Successfully Changed' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
