import { mockDb } from '@/app/libs/mock-db';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createEvent, trackChanges } from '@/app/libs/events/events';
import { checkPermissions } from '@/app/libs/auth-helpers';
import { revalidatePath } from 'next/cache';
import { CustomersStatuses, filterNumber } from '@/app/libs/customer/customersFunctions';
import { LostReasons } from '@/app/libs/definitions/customer/lostReason/lostReason.definitions';
import { auth } from '@/auth';
import { LeadHistoryCategoriesEnum } from '@/app/ui/dashboard/clientSystem/clientDetail/leadHistory/categoriesIdMap';

export async function GET(request: NextRequest, { params }: { params: { client_id: string } }) {
  try {
    const customerId = parseInt(params.client_id);

    const data = await mockDb.clients.findUnique({
      where: {
        id: customerId,
      },
    });

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { client_id: string } }) {
  const permissionsCheck = await checkPermissions([67, 68, 69]);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const urlRequest = new URL(request.url);

  const searchParams = urlRequest.searchParams;

  const currentLeadId = searchParams.get('leadId');

  const data = await request.formData();

  const customerId = parseInt(params.client_id);

  const clientSchema = z
    .object({
      userId: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      currentDate: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      firstname: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      lastname: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      salutation: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      nickname: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      middleInitials: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      suffix: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      nameLastname: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      interestedVehicle: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      mobilePhone: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(10, 'Enter a valid phone number format'),
      homephone: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(10, 'Enter a valid phone number format')
        .nullish(),
      workphone: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(10, 'Enter a valid phone number format')
        .nullish(),
      email: z
        .string({ invalid_type_error: 'Please enter a valid email' })
        .email('Please enter a valid email address')
        .nullish(),
      language: z.string({ invalid_type_error: 'Please enter a valid value' }).nullish(),
      contactTime: z.string({ invalid_type_error: 'Please enter a valid value' }).nullish(),
      contactMethod: z.string({ invalid_type_error: 'Please enter a valid value' }).nullish(),
      leadType: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      leadSource: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      leadSourceName: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      inquiryType: z.string({ invalid_type_error: 'Please enter a valid value' }).nullish(),
      salesRep: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      bdc: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      financeManager: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      salesManager: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      adId: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      mobileDefault: z.string().nullish(),
      homeDefault: z.string().nullish(),
      workDefault: z.string().nullish(),
    })
    .refine((data) => data.leadSource || data.leadSourceName, {
      message: 'Please enter a value',
      path: ['leadSourceName'],
    });

  const validatedData = clientSchema.safeParse({
    userId: data.get('userId'),
    currentDate: data.get('currentDate'),
    firstname: data.get('firstname'),
    lastname: data.get('lastname'),
    salutation: data.get('salutation'),
    nickname: data.get('nickname'),
    middleInitials: data.get('middleInitials'),
    suffix: data.get('suffix'),
    nameLastname: data.get('nameLastname'),
    interestedVehicle: data.get('interestedVehicle'),
    mobilePhone: data.get('mobilePhone'),
    homephone: data.get('homephone'),
    workphone: data.get('workphone'),
    email: data.get('email'),
    language: data.get('language'),
    contactTime: data.get('contactTime'),
    contactMethod: data.get('contactMethod'),
    leadType: data.get('leadType'),
    leadSource: data.get('leadSource'),
    leadSourceName: data.get('leadSourceName'),
    inquiryType: data.get('inquiryType'),
    salesRep: data.get('salesRep'),
    bdc: data.get('bdc'),
    financeManager: data.get('financeManager'),
    salesManager: data.get('salesManager'),
    adId: data.get('adId'),
    mobileDefault: data.get('mobileDefault'),
    homeDefault: data.get('homeDefault'),
    workDefault: data.get('workDefault'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const {
    userId,
    currentDate,
    firstname,
    lastname,
    salutation,
    nickname,
    middleInitials,
    suffix,
    nameLastname,
    interestedVehicle,
    mobilePhone,
    homephone,
    workphone,
    email,
    language,
    contactTime,
    contactMethod,
    leadType,
    leadSource,
    leadSourceName,
    inquiryType,
    salesRep,
    bdc,
    financeManager,
    salesManager,
    adId,
  } = validatedData.data;

  try {
    // const check = await checkDuplicateCustomerValues(mobilePhone, email, customerId);

    const phoneNumbers = [mobilePhone, homephone, workphone].filter(
      (number) => number !== '' && number !== null && number !== undefined,
    );

    const duplicateData = mockDb.clients.findFirst({
      where: {
        id: {
          not: customerId,
        },
        OR: [
          { mobile_phone: { in: phoneNumbers as string[] } },
          { home_phone: { in: phoneNumbers as string[] } },
          { work_phone: { in: phoneNumbers as string[] } },
          { email: email ? email.toLowerCase() : undefined },
        ],
      },
    });

    const fieldErrors: {
      email?: [string];
      mobilePhone?: [string];
      homephone?: [string];
      workphone?: [string];
    } = {};

    const { mobileDefault, homeDefault, workDefault } = validatedData.data;
    if (mobileDefault && !mobilePhone) {
      fieldErrors.mobilePhone = ['Default phone number is required'];
    }
    if (homeDefault && !homephone) {
      fieldErrors.homephone = ['Default phone number is required'];
    }
    if (workDefault && !workphone) {
      fieldErrors.workphone = ['Default phone number is required'];
    }

    if (duplicateData && duplicateData.email?.toLowerCase() === email?.toLocaleLowerCase()) {
      fieldErrors.email = ['Email already registered'];
    }

    const existingPhoneNumbers = [
      duplicateData?.mobile_phone,
      duplicateData?.home_phone,
      duplicateData?.work_phone,
    ].filter((phone) => phone !== null && phone !== undefined && phone !== '');

    if (duplicateData && existingPhoneNumbers.includes(mobilePhone)) {
      fieldErrors.mobilePhone = ['Mobile phone already registered'];
    }
    if (duplicateData && existingPhoneNumbers.includes(homephone)) {
      fieldErrors.homephone = ['Home phone already registered'];
    }
    if (duplicateData && existingPhoneNumbers.includes(workphone)) {
      fieldErrors.workphone = ['Work phone already registered'];
    }

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json({ fieldErrors }, { status: 422 });
    }

    const prevData = mockDb.clients.findUnique({
      where: {
        id: customerId,
      },
    });

    let leadId;
    let leadChange = false;

    if (leadSource) {
      leadId = parseInt(leadSource);
    } else if (leadSourceName) {
      const leadSources = mockDb.lead_sources.findMany();

      const existsLeadSource = leadSources.find(
        (source) =>
          source.source && source.source.toLowerCase() === (leadSourceName as string).toLowerCase(),
      );

      if (!existsLeadSource) {
        const newLead = mockDb.lead_sources.create({
          data: {
            source: leadSourceName,
          },
        });

        leadId = newLead.id;
        leadChange = true;
      } else {
        leadId = existsLeadSource.id;
      }
    }

    const prevDataValues = mockDb.clients.findUnique({
      where: {
        id: customerId,
      },
    });

    const updatedData = mockDb.clients.update({
      where: {
        id: customerId,
      },
      data: {
        name_lastname: nameLastname,
        first_name: firstname,
        last_name: lastname,
        middle_initials: middleInitials,
        nickname: nickname,
        salutation: salutation,
        suffix: suffix,
        email: email,
        mobile_phone: filterNumber(mobilePhone),
        home_phone: homephone ? filterNumber(homephone) : null,
        work_phone: workphone ? filterNumber(workphone) : null,
        intereseted_vehicle_id: interestedVehicle ? parseInt(interestedVehicle) : null,
        contact_time_id: contactTime ? parseInt(contactTime) : null,
        contact_method_id: contactMethod ? parseInt(contactMethod) : null,
        lead_type_id: parseInt(leadType),
        lead_source_id: leadId,
        inquiry_type_id: inquiryType ? parseInt(inquiryType) : null,
        seller_id: salesRep ? parseInt(salesRep) : null,
        bdc_id: bdc ? parseInt(bdc) : null,
        finance_manager_id: financeManager ? parseInt(financeManager) : null,
        sales_manager_id: salesManager ? parseInt(salesManager) : null,
        client_language_id: language ? parseInt(language) : null,
        // ad_id: adId ? parseInt(adId) : null,
      },
    });

    const usersIds = {
      seller_id: updatedData.seller_id,
      bdc_id: updatedData.bdc_id,
      sales_manager_id: updatedData.sales_manager_id,
      finance_manager_id: updatedData.finance_manager_id,
    };

    const usersRelated = [];

    for (const key in usersIds) {
      const objKey = key as keyof typeof usersIds;

      const value = usersIds[objKey];
      const prevValue = prevDataValues ? prevDataValues[objKey] : undefined;

      if (value && value !== prevValue) {
        usersRelated.push({
          customer_id: customerId,
          user_id: value,
        });
      }
    }

    if (usersRelated && usersRelated.length > 0) {
      mockDb.users_has_customers.createMany({ data: usersRelated });
    }

    let leadWhereClause: Record<string, any> | null = null;

    if (currentLeadId) {
      leadWhereClause = {
        id: Number(currentLeadId),
      };
    } else {
      const activeLead = mockDb.leads.findFirst({
        where: {
          customer_id: customerId,
          is_selected: true,
          is_active: true,
        },
      });

      leadWhereClause = {
        id: activeLead?.id,
      };
    }

    if (leadWhereClause && leadWhereClause.id) {
      mockDb.leads.update({
        where: leadWhereClause,
        data: {
          vehicle_id: interestedVehicle ? parseInt(interestedVehicle) : null,
          sales_rep_id: salesRep ? parseInt(salesRep) : null,
          bdc_id: bdc ? parseInt(bdc) : null,
          finance_manager_id: financeManager ? parseInt(financeManager) : null,
          sales_manager_id: salesManager ? parseInt(salesManager) : null,
        },
      });
    }

    const worksWith = [
      'first_name',
      'last_name',
      'middle_initials',
      'nickname',
      'salutation',
      'suffix',
      'mobile_phone',
      'email',
      'home_phone',
      'work_phone',
      'intereseted_vehicle_id',
      'contact_time_id',
      'contact_method_id',
      'lead_type_id',
      'lead_source_id',
      'inquiry_type_id',
      'seller_id',
      'bdc_id',
      'finance_manager_id',
      'sales_manager_id',
      'client_language_id',
    ];

    const updatedFields = await trackChanges({ prevData, updatedData, worksWith });

    const eventDescription = `Fields modified: ${
      updatedFields.length > 1 ? updatedFields.join(', ') : updatedFields
    }`;

    if (updatedFields.length > 0) {
      await createEvent(eventDescription, parseInt(userId), customerId, new Date(currentDate));
    }

    return NextResponse.json({ successMessage: 'Customer Updated', data: leadChange });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { client_id: string } }) {
  const permissionsCheck = await checkPermissions([80]);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const session = await auth();

  const userId = session?.user.id;

  const id = parseInt(params.client_id);

  try {
    const data = mockDb.clients.update({
      where: {
        id: id,
      },
      data: {
        deleted: true,
        client_status_id: CustomersStatuses.Lost,
        client_status_changed_at: new Date(),
        lost_reason_id: LostReasons.ManualDeleted,
      },
    });

    const noteDb = mockDb.notes.create({
      data: {
        note: 'Manual Deleted',
        created_at: new Date(),
        created_by_id: userId || 0,
        client_id: id,
        from_id: 3,
      },
    });

    mockDb.client_has_lead.create({
      data: {
        created_at: new Date(),
        client_id: id,
        status_id: 2,
        created_by_id: userId || 0,
        lead_id: LeadHistoryCategoriesEnum.MarkAsLost,
        note_id: noteDb.id || null,
      },
    });

    const activeLead = mockDb.leads.findFirst({
      where: {
        customer_id: id,
        is_selected: true,
      },
    });

    if (activeLead) {
      mockDb.leads.update({
        where: {
          id: activeLead.id,
          customer_id: id,
          is_selected: true,
        },
        data: {
          customer_status_id: 12,
        },
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
