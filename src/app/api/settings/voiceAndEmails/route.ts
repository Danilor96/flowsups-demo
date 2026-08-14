import { NextResponse } from 'next/server';
import { z } from 'zod';
import { mockDb } from '@/app/libs/mock-db';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function POST(request: Request) {
  const permissionsCheck = await checkPermissions(48);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const formData = await request.formData();

  const voiceAndEmailsSchema = z.object({
    customerConsentAutoSmsForBuyingVehiclesFromCustomers: z.string({
      invalid_type_error: 'Please enter a valid value',
    }),
    customerConsentAutoSmsIncludeDealershipAddress: z.string({
      invalid_type_error: 'Please enter a valid value',
    }),
    customerConsentAutoSmsInSpanish: z.string({
      invalid_type_error: 'Please enter a valid value',
    }),
    systemEmailPublishingVerified: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    disableAutoEmailsToCustomers: z.string({ invalid_type_error: 'Please enter a valid value' }),
    disableSendingAutoSmsOverMontlyLimit: z.string({
      invalid_type_error: 'Please enter a valid value',
    }),
    displayNameForEmailsSentToProspect: z.string({
      invalid_type_error: 'Please enter a valid value',
    }),
    forwardIncomingCalls: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    forwardIncomingCallsNumber: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    systemEmailPublishing: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    systemPhonePublishing: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    useDealershipPhoneNumber: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
  });

  const validatedData = voiceAndEmailsSchema.safeParse({
    customerConsentAutoSmsForBuyingVehiclesFromCustomers: formData.get(
      'customerConsentAutoSmsForBuyingVehiclesFromCustomers',
    ),
    customerConsentAutoSmsIncludeDealershipAddress: formData.get(
      'customerConsentAutoSmsIncludeDealershipAddress',
    ),
    customerConsentAutoSmsInSpanish: formData.get('customerConsentAutoSmsInSpanish'),
    systemEmailPublishingVerified: formData.get('systemEmailPublishingVerified'),
    disableAutoEmailsToCustomers: formData.get('disableAutoEmailsToCustomers'),
    disableSendingAutoSmsOverMontlyLimit: formData.get('disableSendingAutoSmsOverMontlyLimit'),
    displayNameForEmailsSentToProspect: formData.get('displayNameForEmailsSentToProspect'),
    forwardIncomingCalls: formData.get('forwardIncomingCalls'),
    forwardIncomingCallsNumber: formData.get('forwardIncomingCallsNumber'),
    systemEmailPublishing: formData.get('systemEmailPublishing'),
    systemPhonePublishing: formData.get('systemPhonePublishing'),
    useDealershipPhoneNumber: formData.get('useDealershipPhoneNumber'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const {
    customerConsentAutoSmsForBuyingVehiclesFromCustomers,
    customerConsentAutoSmsIncludeDealershipAddress,
    customerConsentAutoSmsInSpanish,
    systemEmailPublishingVerified,
    disableAutoEmailsToCustomers,
    disableSendingAutoSmsOverMontlyLimit,
    displayNameForEmailsSentToProspect,
    forwardIncomingCalls,
    forwardIncomingCallsNumber,
    systemEmailPublishing,
    systemPhonePublishing,
    useDealershipPhoneNumber,
  } = validatedData.data;

  try {
    const data = mockDb.voice_and_sms.create({
      data: {
        system_phone_for_publishing: systemPhonePublishing,
        system_email_address_for_publishing: systemEmailPublishing,
        dealership_phone_number: useDealershipPhoneNumber === '1' ? true : false,
        disable_auto_emails_to_customer: disableAutoEmailsToCustomers === '1' ? true : false,
        disable_sending_auto_sms_over_montly_limit:
          disableSendingAutoSmsOverMontlyLimit === '1' ? true : false,
        email_name_displayed_id: parseInt(displayNameForEmailsSentToProspect),
        forward_incoming_calls_option_id: forwardIncomingCalls
          ? parseInt(forwardIncomingCalls)
          : undefined,
        email_verfified: systemEmailPublishingVerified === '1' ? true : false,
        for_buying_vehicles_from_customers:
          customerConsentAutoSmsForBuyingVehiclesFromCustomers === '1' ? true : false,
        in_spanish: customerConsentAutoSmsInSpanish === '1' ? true : false,
        include_dealership_address:
          customerConsentAutoSmsIncludeDealershipAddress === '1' ? true : false,
        forward_incoming_calls_to: forwardIncomingCallsNumber,
      },
    });

    return NextResponse.json({ successMessage: 'Configuration Saved Successfully', data: data.id });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

//deberia ser (multi tenant)
export async function GET() {
  try {
    const data = mockDb.voice_and_sms.findFirst();
    const numberPhonActive = mockDb.business_phone_numbers.findFirst({
      where: {
        is_publishing_number: true,
      },
    });

    return NextResponse.json([
      { ...data, system_phone_for_publishing: numberPhonActive?.phone_number || '' },
    ]);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const permissionsCheck = await checkPermissions(48);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const formData = await request.formData();

  const voiceAndEmailsSchema = z.object({
    id: z.string({ invalid_type_error: 'Please enter a valid value' }).min(1),
    customerConsentAutoSmsForBuyingVehiclesFromCustomers: z.string({
      invalid_type_error: 'Please enter a valid value',
    }),
    customerConsentAutoSmsIncludeDealershipAddress: z.string({
      invalid_type_error: 'Please enter a valid value',
    }),
    customerConsentAutoSmsInSpanish: z.string({
      invalid_type_error: 'Please enter a valid value',
    }),
    systemEmailPublishingVerified: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    disableAutoEmailsToCustomers: z.string({ invalid_type_error: 'Please enter a valid value' }),
    disableSendingAutoSmsOverMontlyLimit: z.string({
      invalid_type_error: 'Please enter a valid value',
    }),
    displayNameForEmailsSentToProspect: z.string({
      invalid_type_error: 'Please enter a valid value',
    }),
    forwardIncomingCalls: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    forwardIncomingCallsNumber: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    systemEmailPublishing: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    systemPhonePublishing: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    useDealershipPhoneNumber: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
  });

  const validatedData = voiceAndEmailsSchema.safeParse({
    id: formData.get('id'),
    customerConsentAutoSmsForBuyingVehiclesFromCustomers: formData.get(
      'customerConsentAutoSmsForBuyingVehiclesFromCustomers',
    ),
    customerConsentAutoSmsIncludeDealershipAddress: formData.get(
      'customerConsentAutoSmsIncludeDealershipAddress',
    ),
    customerConsentAutoSmsInSpanish: formData.get('customerConsentAutoSmsInSpanish'),
    systemEmailPublishingVerified: formData.get('systemEmailPublishingVerified'),
    disableAutoEmailsToCustomers: formData.get('disableAutoEmailsToCustomers'),
    disableSendingAutoSmsOverMontlyLimit: formData.get('disableSendingAutoSmsOverMontlyLimit'),
    displayNameForEmailsSentToProspect: formData.get('displayNameForEmailsSentToProspect'),
    forwardIncomingCalls: formData.get('forwardIncomingCalls'),
    forwardIncomingCallsNumber: formData.get('forwardIncomingCallsNumber'),
    systemEmailPublishing: formData.get('systemEmailPublishing'),
    systemPhonePublishing: formData.get('systemPhonePublishing'),
    useDealershipPhoneNumber: formData.get('useDealershipPhoneNumber'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const {
    id,
    customerConsentAutoSmsForBuyingVehiclesFromCustomers,
    customerConsentAutoSmsIncludeDealershipAddress,
    customerConsentAutoSmsInSpanish,
    systemEmailPublishingVerified,
    disableAutoEmailsToCustomers,
    disableSendingAutoSmsOverMontlyLimit,
    displayNameForEmailsSentToProspect,
    forwardIncomingCalls,
    forwardIncomingCallsNumber,
    systemEmailPublishing,
    systemPhonePublishing,
    useDealershipPhoneNumber,
  } = validatedData.data;

  try {
    const data = mockDb.voice_and_sms.update({
      where: {
        id: parseInt(id),
      },
      data: {
        system_phone_for_publishing: systemPhonePublishing,
        system_email_address_for_publishing: systemEmailPublishing,
        dealership_phone_number: useDealershipPhoneNumber === '1' ? true : false,
        disable_auto_emails_to_customer: disableAutoEmailsToCustomers === '1' ? true : false,
        disable_sending_auto_sms_over_montly_limit:
          disableSendingAutoSmsOverMontlyLimit === '1' ? true : false,
        email_name_displayed_id: parseInt(displayNameForEmailsSentToProspect),
        forward_incoming_calls_option_id: forwardIncomingCalls
          ? parseInt(forwardIncomingCalls)
          : undefined,
        email_verfified: systemEmailPublishingVerified === '1' ? true : false,
        for_buying_vehicles_from_customers:
          customerConsentAutoSmsForBuyingVehiclesFromCustomers === '1' ? true : false,
        in_spanish: customerConsentAutoSmsInSpanish === '1' ? true : false,
        include_dealership_address:
          customerConsentAutoSmsIncludeDealershipAddress === '1' ? true : false,
        forward_incoming_calls_to: forwardIncomingCallsNumber,
      },
    });

    return NextResponse.json({ successMessage: 'Configuration Saved Successfully' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
