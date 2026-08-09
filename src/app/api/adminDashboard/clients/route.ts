import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/app/libs/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { checkPermissions } from '@/app/libs/auth-helpers';
import { filterNumber } from '@/app/libs/customer/customersFunctions';

export async function GET() {
  try {
    const data = await prisma?.clients.findMany({
      select: {
        id: true,
        name_lastname: true,
        email: true,
        mobile_phone: true,
        home_phone: true,
        work_phone: true,
        credit_app_list_status_id: true,
        born_date: true,
        created_at: true,
        consent_approved: true,
        last_activity: true,
        client_status_changed_at: true,
        deposit_client: {
          select: {
            amount: true,
            id: true,
            deposit_date: true,
          },
        },
        gender: {
          select: {
            gender: true,
          },
        },
        language: {
          select: {
            language: true,
          },
        },
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
        current_address: true,
        current_job: true,
        previous_address: true,
        previous_job: true,
        social_security: true,
        duplicate: true,
        contact_method: {
          select: {
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
            type: true,
          },
        },
        lead_source: {
          select: {
            source: true,
            id: true,
          },
        },
        lead_type: {
          select: {
            type: true,
            id: true,
          },
        },
        mailing_address: true,
        other_income: true,
        reference: true,
        referrer_client: {
          select: {
            buyer: {
              select: {
                name_lastname: true,
                email: true,
                mobile_phone: true,
                current_address: true,
                id: true,
              },
            },
            referrer: {
              select: {
                name_lastname: true,
                email: true,
                mobile_phone: true,
                current_address: true,
                id: true,
              },
            },
          },
        },
        buyer_referrer: {
          select: {
            buyer: {
              select: {
                name_lastname: true,
                email: true,
                mobile_phone: true,
                current_address: true,
                id: true,
              },
            },
            referrer: {
              select: {
                name_lastname: true,
                email: true,
                mobile_phone: true,
                current_address: true,
                id: true,
              },
            },
          },
        },
        seller: {
          select: {
            name: true,
            last_name: true,
            id: true,
            email: true,
          },
        },
        bdc: {
          select: {
            name: true,
            last_name: true,
            id: true,
            email: true,
          },
        },
        sales_manager: {
          select: {
            name: true,
            last_name: true,
            id: true,
            email: true,
          },
        },
        finance_manager: {
          select: {
            name: true,
            last_name: true,
            id: true,
            email: true,
          },
        },
        deal: true,
        // created_by: {
        //   select: {
        //     name: true,
        //     last_name: true,
        //     id: true,
        //     email: true
        //   }
        // },
        interested_vehicle: {
          include: {
            vehicle_brands: true,
            vehicle_models: true,
            vehicle_manufacture_years: true,
            vehicle_identification_numbers: true,
            vehicle_prices: true,
            title_license: {
              select: {
                id: true,
                asking_price: true,
              },
            },
            general_info: {
              select: {
                id: true,
                stock_no: true,
              },
            },
            vehicle_image: { select: { id: true, path: true } },
            vehicle_mileages: true,
          },
        },
        client_status: {
          select: {
            status: true,
            id: true,
          },
        },
        message: {
          select: {
            date_sent: true,
          },
          orderBy: {
            date_sent: 'asc',
          },
        },
        appointment: true,
        first_name: true,
        last_name: true,
        suffix: true,
        salutation: true,
        middle_initials: true,
        nickname: true,
        client_lead_temperature: {
          select: {
            temperature: true,
            id: true,
          },
        },
        note: {
          select: {
            note: true,
            id: true,
            created_at: true,
            created_by: {
              select: {
                name: true,
                last_name: true,
                id: true,
              },
            },
            from: {
              select: {
                from: true,
                id: true,
              },
            },
            client_note: {
              select: {
                name_lastname: true,
                email: true,
                id: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      where: {
        deleted: {
          not: {
            equals: true,
          },
        },
      },
    });

    //await prisma?.$disconnect();

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error: any) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const permissionsCheck = await checkPermissions([31]);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const formData = await request.formData();

  const session = await auth();

  const creatorId = session?.user.id;

  const clientSchema = z
    .object({
      name_lastname: z.string({ invalid_type_error: 'Please enter a valid value' }).min(1, 'Please enter a value'),
      born_date: z.string({ invalid_type_error: 'Please enter a valid value' }).optional().nullable().or(z.literal('')),
      phone_number: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(10, 'Enter a valid phone number format')
        .max(10, 'Enter a valid phone number format'),
      home_phone_number: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(10, 'Enter a valid phone number format')
        .max(10, 'Enter a valid phone number format')
        .nullish(),
      work_phone_number: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(10, 'Enter a valid phone number format')
        .max(10, 'Enter a valid phone number format')
        .nullish(),
      email: z
        .string({ invalid_type_error: 'Please enter a valid email' })
        .email('Please enter a valid email address')
        .optional()
        .nullable()
        .or(z.literal('')),
      current_address: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value')
        .optional()
        .nullable()
        .or(z.literal('')),
      lead_type: z.string({ invalid_type_error: 'Please enter a valid value' }).min(1, 'Please enter a value'),
      lead_source: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      leadSourceName: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      social_security: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value')
        .nullish(),
      type_of_client: z.string({ invalid_type_error: 'Please enter a valid value' }).min(1, 'Please enter a value'),
      created_by: z.string({ invalid_type_error: 'Please enter a valid value' }).min(1, 'Please enter a value'),
      first_name: z.string({ invalid_type_error: 'Please enter a valid value' }).min(1, 'Please enter a value'),
      last_name: z.string({ invalid_type_error: 'Please enter a valid value' }).min(1, 'Please, enter a Last Name'),
      salutation: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
      middle_initials: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
      nickname: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
      suffix: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    })
    .refine(data => data.lead_source || data.leadSourceName, {
      message: 'Please enter a value',
      path: ['leadSourceName'],
    });

  const validatedData = clientSchema.safeParse({
    name_lastname: formData.get('name_lastname'),
    born_date: formData.get('born_date'),
    phone_number: formData.get('phone_number'),
    home_phone_number: formData.get('home_phone_number'),
    work_phone_number: formData.get('work_phone_number'),
    email: formData.get('email'),
    current_address: formData.get('current_address'),
    lead_type: formData.get('lead_type'),
    lead_source: formData.get('lead_source'),
    leadSourceName: formData.get('leadSourceName'),
    social_security: formData.get('social_security'),
    type_of_client: formData.get('type_of_client'),
    created_by: formData.get('created_by'),
    salutation: formData.get('salutation'),
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    middle_initials: formData.get('middle_initials'),
    nickname: formData.get('nickname'),
    suffix: formData.get('suffix'),
  });

  if (!validatedData.success) {
    return NextResponse.json({ fieldErrors: validatedData.error.flatten().fieldErrors }, { status: 422 });
  }

  const {
    born_date,
    created_by,
    current_address,
    email,
    first_name,
    home_phone_number,
    last_name,
    lead_source,
    lead_type,
    middle_initials,
    name_lastname,
    nickname,
    phone_number,
    salutation,
    social_security,
    suffix,
    type_of_client,
    work_phone_number,
    leadSourceName,
  } = validatedData.data;

  // no permitir born date future
  if (born_date) {
    const bornDateToValidate = new Date(born_date);
    const isValidDateFormated = bornDateToValidate.toString() !== 'Invalid Date';
    if (bornDateToValidate.getTime() > new Date().getTime() || !isValidDateFormated) {
      return NextResponse.json({ fieldErrors: { born_date: 'Invalid date' } }, { status: 422 });
    }
  }

  const duplicateEmail =
    email && email.length > 0
      ? await prisma?.clients.findUnique({
          where: {
            email: email,
          },
        })
      : null;

  const phoneNumbers = [phone_number, home_phone_number, work_phone_number].filter(
    number => number !== '' && number !== null && number !== undefined,
  );

  const duplicatePhoneNumber = await prisma?.clients.findFirst({
    where: {
      OR: [
        { mobile_phone: { in: phoneNumbers as string[] } },
        { home_phone: { in: phoneNumbers as string[] } },
        { work_phone: { in: phoneNumbers as string[] } },
      ],
    },
  });

  let mssgE, mssgA, mssMp, mssHp, mssWp;

  const splitAddress = current_address ? current_address.split(',') : [];

  if (duplicateEmail || duplicatePhoneNumber || (current_address && splitAddress.length < 3)) {
    if (duplicatePhoneNumber) {
      const existingPhoneNumbers = [
        duplicatePhoneNumber.mobile_phone,
        duplicatePhoneNumber.home_phone,
        duplicatePhoneNumber.work_phone,
      ].filter(number => number !== null && number !== '');

      if (phone_number && existingPhoneNumbers.includes(phone_number)) {
        mssMp = 'Mobile phone already registered';
      }
      if (home_phone_number && existingPhoneNumbers.includes(home_phone_number)) {
        mssHp = 'Home phone already registered';
      }
      if (work_phone_number && existingPhoneNumbers.includes(work_phone_number)) {
        mssWp = 'Work phone already registered';
      }
    }

    if (duplicateEmail) {
      mssgE = 'Email already registered';
    }
    if (current_address && current_address.length > 1 && splitAddress.length < 3) {
      mssgA = 'Please, enter at least a Street name, a City name and a State separated by comma.';
    }

    return NextResponse.json(
      {
        fieldErrors: {
          email: [mssgE],
          current_address: [mssgA],
          phone_number: [mssMp],
          home_phone_number: [mssHp],
          work_phone_number: [mssWp],
        },
      },
      { status: 422 },
    );
  }

  if (current_address && splitAddress[splitAddress.length - 1] == 'undefined') {
    return NextResponse.json(
      {
        fieldErrors: {
          current_address: ['Please, enter a valid current State. You can use (...) button to open guide'],
        },
      },
      { status: 422 },
    );
  }

  try {
    let address;

    if (current_address && splitAddress.length >= 3) {
      const splitAddress1 = splitAddress[0];
      const splitAddress2 = splitAddress[1];

      address = await prisma?.client_address.create({
        data: {
          street: splitAddress1,
          city: splitAddress2,
          state: {
            connect: {
              id: parseInt(splitAddress[splitAddress.length - 1]),
            },
          },
        },
      });
    }

    let leadId;
    let leadChange = false;

    if (lead_source) {
      leadId = parseInt(lead_source);
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

    const data = await prisma?.clients.create({
      data: {
        born_date: born_date ? new Date(born_date).toISOString() : null,
        current_address: current_address ? current_address : '',
        email: email ? email : null,
        first_name: first_name,
        last_name: last_name,
        social_security: social_security ? social_security : '',
        mobile_phone: filterNumber(phone_number),
        home_phone: home_phone_number ? filterNumber(home_phone_number) : null,
        work_phone: work_phone_number ? filterNumber(work_phone_number) : null,
        suffix: suffix ? suffix : '',
        salutation: salutation ? salutation : '',
        nickname: nickname ? nickname : '',
        middle_initials: middle_initials ? middle_initials : '',
        name_lastname: name_lastname,
        lead_source_id: leadId || 1,
        client_type_id: parseInt(type_of_client),
        lead_type_id: parseInt(lead_type),
        client_address_id: address ? address.id : null,
        client_status_id: 1,
        seller_id: parseInt(created_by),
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        current_address: true,
        mobile_phone: true,
        home_phone: true,
        work_phone: true,
        email: true,
      },
    });

    if (data.id) {
      const lead = await prisma.leads.create({
        data: {
          customer_id: data.id,
          sales_rep_id: parseInt(created_by),
          customer_status_id: 1,
        },
      });

      const relatedUser = await prisma.users_has_customers.create({
        data: {
          user_id: parseInt(created_by),
          customer_id: data.id,
        },
      });
    }

    const event = await prisma?.events.create({
      data: {
        description: `Customer created`,
        updated_at: new Date(),
        client_id: data.id,
        updated_by: parseInt(created_by),
      },
    });

    await prisma?.notifications.create({
      data: {
        message: `New customer created: ${data.first_name ?? ''} ${data.last_name ?? ''}`,
        type_id: 1,
        user_id: parseInt(created_by),
        customer_id: data.id,
        notification_for_managers: true,
      },
    });

    //await prisma?.$disconnect();

    return NextResponse.json({
      successMessage: 'Client Successfully Created',
      data: {
        customer: data,
        change: leadChange,
      },
    });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
