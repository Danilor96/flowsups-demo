import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { filterNumber } from '@/app/libs/customer/customersFunctions';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = mockDb.clients.findUnique({
      where: {
        id: parseInt(params.id),
        consent_approved: true,
      },
    });

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const data = await request.formData();

  const clientSchema = z.object({
    name_lastname: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please, enter a name and lastname')
      .refine((string) => {
        const words = string.split(' ');
        return words.length >= 2, { message: 'Please, enter a Last Name' };
      }),
    salutation: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    nickname: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    firstname: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please, enter a name and lastname'),
    middle_initials: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    lastname: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please, enter a name and lastname'),
    suffix: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    mobile_phone: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please, enter a mobile phone'),
    home_phone: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please, enter a home phone'),
    work_phone: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please, enter a work phone'),
    email: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please, enter a email'),
    language: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    interested_vehicle: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    contact_time: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    contact_method: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    lead_type: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please, select a lead type'),
    lead_source: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please, select a lead source'),
    inquiry_type: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    seller: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    ad_id: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
  });

  const validatedData = clientSchema.safeParse({
    name_lastname: data.get('name_lastname'),
    salutation: data.get('salutation'),
    nickname: data.get('nickname'),
    firstname: data.get('firstname'),
    middle_initials: data.get('middle_initials'),
    lastname: data.get('lastname'),
    suffix: data.get('suffix'),
    mobile_phone: data.get('mobile_phone'),
    email: data.get('email'),
    language: data.get('language'),
    home_phone: data.get('home_phone'),
    work_phone: data.get('work_phone'),
    interested_vehicle: data.get('interested_vehicle'),
    contact_time: data.get('contact_time'),
    contact_method: data.get('contact_method'),
    lead_source: data.get('lead_source'),
    lead_type: data.get('lead_type'),
    inquiry_type: data.get('inquiry_type'),
    seller: data.get('seller'),
    ad_id: data.get('ad_id'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldsErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const {
    email,
    home_phone,
    lead_source,
    lead_type,
    mobile_phone,
    name_lastname,
    work_phone,
    contact_method,
    contact_time,
    inquiry_type,
    interested_vehicle,
    language,
    seller,
    ad_id,
    firstname,
    lastname,
    middle_initials,
    nickname,
    salutation,
    suffix,
  } = validatedData.data;

  try {
    const data = mockDb.clients.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        name_lastname: name_lastname,
        first_name: firstname,
        last_name: lastname,
        middle_initials: middle_initials,
        nickname: nickname,
        salutation: salutation,
        suffix: suffix,
        mobile_phone: filterNumber(mobile_phone),
        email: email,
        home_phone: filterNumber(home_phone),
        work_phone: filterNumber(work_phone),
        intereseted_vehicle_id: interested_vehicle
          ? interested_vehicle !== 'null'
            ? parseInt(interested_vehicle)
            : undefined
          : undefined,
        contact_time_id: contact_time ? parseInt(contact_time) : undefined,
        contact_method_id: contact_method
          ? contact_method !== 'null'
            ? parseInt(contact_method)
            : undefined
          : undefined,
        lead_type_id: parseInt(lead_type),
        lead_source_id: parseInt(lead_source),
        inquiry_type_id: inquiry_type
          ? inquiry_type !== 'null'
            ? parseInt(inquiry_type)
            : undefined
          : undefined,
        seller_id: seller ? (seller !== 'null' ? parseInt(seller) : undefined) : undefined,
        client_language_id: language
          ? language !== 'null'
            ? parseInt(language)
            : undefined
          : undefined,
        ad_id: ad_id ? (ad_id !== 'null' ? parseInt(ad_id) : undefined) : undefined,
      },
    });

    return NextResponse.json({ successMessage: 'Client Updated' });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json({ DataBaseErrors: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  try {
    const data = mockDb.clients.update({
      where: {
        id: id,
      },
      data: {
        deleted: true,
        client_status_id: 12,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}