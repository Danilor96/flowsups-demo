import { NextResponse } from 'next/server';
import { z } from 'zod';
import { mockDb } from '@/app/libs/mock-db';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { checkPermissions } from '@/app/libs/auth-helpers';
import { filterNumber } from '@/app/libs/customer/customersFunctions';

export async function GET() {
  try {
    const data = await mockDb.clients.findMany({
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

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error: any) {
    console.log(error);

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
      ? await mockDb.clients.findUnique({
          where: {
            email: email,
          },
        })
      : null;

  const phoneNumbers = [phone_number, home_phone_number, work_phone_number].filter(
    number => number !== '' && number !== null && number !== undefined,
  );

  const duplicatePhoneNumber = await mockDb.clients.findFirst({
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

      address = await mockDb.client_address.create({
        data: {
          street: splitAddress1,
          city: splitAddress2,
          state_id: parseInt(splitAddress[splitAddress.length - 1]),
        },
      });
    }

    let leadId;
    let leadChange = false;

    if (lead_source) {
      leadId = parseInt(lead_source);
    } else if (leadSourceName) {
      const existsLeadSource = await mockDb.lead_sources.findFirst({
        where: {
          source: {
            equals: leadSourceName,
          },
        },
      });

      if (!existsLeadSource) {
        const newLead = await mockDb.lead_sources.create({
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

    const data = await mockDb.clients.create({
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
    });

    if (data.id) {
      const lead = await mockDb.leads.create({
        data: {
          customer_id: data.id,
          sales_rep_id: parseInt(created_by),
          customer_status_id: 1,
        },
      });

      const relatedUser = await mockDb.users_has_customers.create({
        data: {
          user_id: parseInt(created_by),
          customer_id: data.id,
        },
      });
    }

    const event = await mockDb.events.create({
      data: {
        description: `Customer created`,
        updated_at: new Date(),
        client_id: data.id,
        updated_by: parseInt(created_by),
      },
    });

    await mockDb.notifications.create({
      data: {
        message: `New customer created: ${data.first_name ?? ''} ${data.last_name ?? ''}`,
        type_id: 1,
        user_id: parseInt(created_by),
        customer_id: data.id,
        notification_for_managers: true,
      },
    });

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
