import prisma from '@/app/libs/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { startOfDay, endOfDay } from 'date-fns';
import { checkDuplicateCustomerValues } from '@/app/libs/duplicateValues/duplicateValues';
import { createEvent, trackChanges } from '@/app/libs/events/events';
import { checkPermissions } from '@/app/libs/auth-helpers';
import { revalidatePath } from 'next/cache';
import { CustomersStatuses, filterNumber } from '@/app/libs/customer/customersFunctions';
import { LostReasons } from '@/app/libs/definitions/customer/lostReason/lostReason.definitions';
import { auth } from '@/auth';
import { LeadHistoryCategoriesEnum } from '@/app/ui/dashboard/clientSystem/clientDetail/leadHistory/categoriesIdMap';
import { Prisma } from '@prisma/client';
import { returnLeadPrismaClauses } from '@/app/libs/functions/customers/customers';

export async function GET(request: NextRequest, { params }: { params: { client_id: string } }) {
  const searchParams = request.nextUrl.searchParams;

  const leadId = searchParams.get('leadId');

  try {
    const customerId = parseInt(params.client_id);

    const leadSelection = {
      id: true,
      customer_funding_list_status_id: true,
      customer_status_id: true,
    };

    const leadClause: Prisma.LeadsFindManyArgs = leadId
      ? {
          where: {
            id: Number(leadId),
          },
          select: leadSelection,
        }
      : {
          select: leadSelection,
          take: 1,
          orderBy: {
            created_at: 'desc',
          },
        };

    const userDataSelect = {
      name: true,
      last_name: true,
      id: true,
      email: true,
      mobile_phone: true,
      username: true,
    };

    const data = await prisma?.clients.findUnique({
      where: {
        id: customerId,
      },
      select: {
        id: true,
        name_lastname: true,
        first_name: true,
        last_name: true,
        suffix: true,
        mobile_default: true,
        home_default: true,
        work_default: true,
        nickname: true,
        salutation: true,
        last_activity: true,
        middle_initials: true,
        consent_approved: true,
        country_code: true,
        consent_to_sent_sms: true,
        email: true,
        mobile_phone: true,
        home_phone: true,
        lead: {
          where: {
            ...leadClause.where,
          },
          select: {
            ...leadClause.select,
            sales_rep: {
              select: userDataSelect,
            },
            sales_manager: {
              select: userDataSelect,
            },
            finance_manager: {
              select: userDataSelect,
            },
            bdc: {
              select: userDataSelect,
            },
          },
        },
        funding_list_status_id: true,
        work_phone: true,
        born_date: true,
        created_at: true,
        gender: {
          select: {
            gender: true,
          },
        },
        language: {
          select: {
            language: true,
            id: true,
          },
        },
        current_address: true,
        current_job: true,
        previous_address: true,
        previous_job: true,
        social_security: true,
        duplicate: true,
        contact_method: {
          select: {
            id: true,
            method: true,
          },
        },
        contact_time: {
          select: {
            id: true,
            time: true,
          },
        },
        cash_down: true,
        file: {
          select: {
            file: true,
          },
        },
        inquiry_type: {
          select: {
            id: true,
            type: true,
          },
        },
        lead_source: {
          select: {
            id: true,
            source: true,
          },
        },
        lead_type: {
          select: {
            id: true,
            type: true,
          },
        },
        mailing_address: true,
        other_income: true,
        reference: true,
        referrer_client: {
          ...returnLeadPrismaClauses({ customerId, leadId }),
          select: {
            buyer: {
              select: {
                name_lastname: true,
                email: true,
                mobile_phone: true,
                current_address: true,
                id: true,
                first_name: true,
                last_name: true,
              },
            },
            referrer: {
              select: {
                name_lastname: true,
                email: true,
                mobile_phone: true,
                current_address: true,
                id: true,
                first_name: true,
                last_name: true,
              },
            },
          },
        },
        buyer_referrer: {
          ...returnLeadPrismaClauses({ customerId, leadId }),
          select: {
            buyer: {
              select: {
                name_lastname: true,
                email: true,
                mobile_phone: true,
                current_address: true,
                id: true,
                first_name: true,
                last_name: true,
                suffix: true,
                salutation: true,
                middle_initials: true,
                nickname: true,
                client_address: {
                  select: {
                    street: true,
                    city: true,
                    county_id: true,
                    state_id: true,
                    zip: true,
                    county: true,
                    id: true,
                    state: true,
                  },
                },
              },
            },
            referrer: {
              select: {
                name_lastname: true,
                email: true,
                mobile_phone: true,
                current_address: true,
                id: true,
                first_name: true,
                last_name: true,
                suffix: true,
                salutation: true,
                middle_initials: true,
                nickname: true,
                client_address: {
                  select: {
                    street: true,
                    city: true,
                    county_id: true,
                    state_id: true,
                    zip: true,
                    county: true,
                    id: true,
                    state: true,
                  },
                },
              },
            },
          },
        },
        seller: {
          ...(returnLeadPrismaClauses({
            customerId,
            leadId,
            noOrderBy: true,
            whereLeadRelationName: 'leadSalesRep',
          }) as Prisma.UsersWhereInput),
          select: {
            name: true,
            last_name: true,
            id: true,
            email: true,
            mobile_phone: true,
            username: true,
          },
        },
        bdc: {
          ...(returnLeadPrismaClauses({
            customerId,
            leadId,
            noOrderBy: true,
            whereLeadRelationName: 'leadBdc',
          }) as Prisma.UsersWhereInput),
          select: {
            name: true,
            last_name: true,
            id: true,
            email: true,
            mobile_phone: true,
            username: true,
          },
        },
        finance_manager: {
          ...(returnLeadPrismaClauses({
            customerId,
            leadId,
            noOrderBy: true,
            whereLeadRelationName: 'leadFinanceManager',
          }) as Prisma.UsersWhereInput),
          select: {
            name: true,
            last_name: true,
            id: true,
            email: true,
            mobile_phone: true,
            username: true,
          },
        },
        sales_manager: {
          ...(returnLeadPrismaClauses({
            customerId,
            leadId,
            noOrderBy: true,
            whereLeadRelationName: 'leadSalesManager',
          }) as Prisma.UsersWhereInput),
          select: {
            name: true,
            last_name: true,
            id: true,
            email: true,
            mobile_phone: true,
            username: true,
          },
        },
        interested_vehicle: {
          ...returnLeadPrismaClauses({
            customerId,
            leadId,
            noOrderBy: true,
          }),
          include: {
            general_info: true,
            vehicle_status: true,
            key_info: true,
            purchase_info: true,
            title_license: true,
            vehicle_identification_numbers: true,
            vehicle_brands: true,
            vehicle_models: true,
            exterior_vehicle_colors: true,
            interior_vehicle_colors: true,
            vehicle_mileages: true,
            vehicle_trim: true,
            vehicle_manufacture_years: true,
          },
        },
        client_status: {
          ...returnLeadPrismaClauses({
            customerId,
            leadId,
            noOrderBy: true,
          }),
          select: {
            id: true,
            status: true,
          },
        },
        message: {
          select: {
            message: true,
            date_sent: true,
            sent_by_user: true,
          },
          orderBy: {
            date_sent: 'asc',
          },
        },
        cobuyer: true,
        cobuyer_client: {
          ...returnLeadPrismaClauses({
            customerId,
            leadId,
            noOrderBy: true,
          }),
          orderBy: {
            lead: {
              _count: 'desc',
            },
          },
          take: 1,
          select: {
            cobuyer: {
              select: {
                name_lastname: true,
                id: true,
                current_address: true,
                home_phone: true,
                mobile_phone: true,
                work_phone: true,
                email: true,
              },
            },
            relationship: {
              select: {
                id: true,
                relationship: true,
              },
            },
          },
        },
        buyer_client: {
          ...returnLeadPrismaClauses({
            customerId,
            leadId,
            noOrderBy: true,
          }),
          orderBy: {
            lead: {
              _count: 'desc',
            },
          },
          take: 1,
          select: {
            cobuyer: {
              select: {
                name_lastname: true,
                id: true,
                current_address: true,
                home_phone: true,
                mobile_phone: true,
                work_phone: true,
                email: true,
              },
            },
            relationship: {
              select: {
                id: true,
                relationship: true,
              },
            },
          },
        },
        client_language_id: true,
        client_lead_temperature: {
          ...returnLeadPrismaClauses({
            customerId,
            leadId,
            noOrderBy: true,
          }),
          select: {
            id: true,
            temperature: true,
          },
        },
        tradein_client: {
          select: {
            book_value: true,
            comment: {
              select: {
                comment: true,
              },
            },
            ext_color_id: true,
            int_color_id: true,
            id: true,
            make: true,
            model: true,
            trade_allowance: true,
            mileage_id: true,
            trade_payoff: true,
            trim: true,
            vehicle_type_id: true,
            vin: true,
            year: true,
          },
        },
        client_address: {
          include: {
            state: true,
            county: true,
          },
        },
        wishlist_client: {
          select: {
            id: true,
            body_type: true,
            exterior_color_id: true,
            max_mileage_id: true,
            max_price_id: true,
            year: true,
            vehicle: {
              select: {
                vehicle_type_id: true,
                vehicle_manufacture_years: {
                  select: {
                    year: true,
                  },
                },
                vehicle_brands: {
                  select: {
                    brand: true,
                  },
                },
                vehicle_models: {
                  select: {
                    model: true,
                  },
                },
                vehicle_prices: {
                  select: {
                    price: true,
                  },
                },
                vehicle_identification_numbers: {
                  select: {
                    vin: true,
                  },
                },
                vehicle_status: {
                  select: {
                    status: true,
                  },
                },
                exterior_vehicle_colors: {
                  select: {
                    color: true,
                  },
                },
                interior_vehicle_colors: {
                  select: {
                    color: true,
                  },
                },
                vehicle_mileages: {
                  select: {
                    mileage: true,
                  },
                },
              },
            },
          },
        },
        appointment: {
          select: {
            id: true,
            status_id: true,
          },
          where: {
            start_date: {
              gte: startOfDay(new Date()),
              lte: endOfDay(new Date()),
            },
          },
        },
        deal: true,
      },
    });

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

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

    const duplicateData = await prisma?.clients.findFirst({
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

    const prevData = await prisma.clients.findUnique({
      where: {
        id: customerId,
      },
    });

    let leadId;
    let leadChange = false;

    if (leadSource) {
      leadId = parseInt(leadSource);
    } else if (leadSourceName) {
      const existsLeadSource = await prisma.lead_sources.findFirst({
        where: {
          source: {
            equals: leadSourceName,
            mode: 'insensitive',
          },
        },
      });

      if (!existsLeadSource) {
        const newLead = await prisma.lead_sources.create({
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

    const prevDataValues = await prisma.clients.findUnique({
      where: {
        id: customerId,
      },
      select: {
        seller_id: true,
        bdc_id: true,
        sales_manager_id: true,
        finance_manager_id: true,
      },
    });

    const updatedData = await prisma?.clients.update({
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
      await prisma.users_has_customers.createMany({ data: usersRelated });
    }

    let leadWhereClause: Prisma.LeadsWhereUniqueInput | null = null;

    if (currentLeadId) {
      leadWhereClause = {
        id: Number(currentLeadId),
      };
    } else {
      const activeLead = await prisma.leads.findFirst({
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
      await prisma.leads.update({
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

    //await prisma?.$disconnect();

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

    //await prisma.$disconnect();

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
    const data = await prisma?.clients.update({
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

    const noteDb = await prisma.notes.create({
      data: {
        note: 'Manual Deleted',
        created_at: new Date(),
        created_by_id: userId || 0,
        client_id: id,
        from_id: 3,
      },
      select: {
        id: true,
      },
    });

    await prisma.client_has_lead.create({
      data: {
        created_at: new Date(),
        client_id: id,
        status_id: 2,
        created_by_id: userId || 0,
        lead_id: LeadHistoryCategoriesEnum.MarkAsLost,
        note_id: noteDb.id || null,
      },
    });

    const activeLead = await prisma.leads.findFirst({
      where: {
        customer_id: id,
        is_selected: true,
      },
      select: {
        id: true,
      },
    });

    if (activeLead) {
      await prisma.leads.update({
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

    //await prisma?.$disconnect();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
