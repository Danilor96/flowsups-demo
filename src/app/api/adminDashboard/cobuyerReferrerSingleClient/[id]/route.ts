import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { startOfDay, endOfDay } from 'date-fns';
import { revalidatePath } from 'next/cache';
import { filterNumber } from '@/app/libs/customer/customersFunctions';

// get a single clients logic

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await prisma?.clients.findUnique({
      where: {
        id: parseInt(params.id),
        consent_approved: true,
      },
      select: {
        id: true,
        name_lastname: true,
        first_name: true,
        last_name: true,
        suffix: true,
        nickname: true,
        salutation: true,
        last_activity: true,
        middle_initials: true,
        consent_approved: true,
        email: true,
        mobile_phone: true,
        home_phone: true,
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
          select: {
            name: true,
            last_name: true,
            id: true,
            email: true,
          },
        },
        interested_vehicle: {
          select: {
            id: true,
            vehicle_brands: true,
            vehicle_models: true,
          },
        },
        client_status: {
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
        client_lead: {
          select: {
            appointment_assigned: {
              select: {
                start_date: true,
                end_date: true,
                appointments_status: {
                  select: {
                    status: true,
                  },
                },
                customers: {
                  select: {
                    name_lastname: true,
                    id: true,
                  },
                },
              },
            },
            assigned_seller: {
              select: {
                name: true,
                last_name: true,
                id: true,
              },
            },
            client_lead: {
              select: {
                name_lastname: true,
                id: true,
              },
            },
            dealdate: true,
            follow_up_date: true,
            id: true,
            incoming: true,
            client_leads: {
              select: {
                lead: true,
                id: true,
              },
            },
            lost_reason: {
              select: {
                reason: true,
                id: true,
              },
            },
            note_assigned: {
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
              },
            },
            outcoming: true,
            reminder_time: true,
            lead_created_by: {
              select: {
                name: true,
                last_name: true,
                id: true,
              },
            },
            created_at: true,
          },
        },
        client_language_id: true,
        client_lead_temperature: {
          select: {
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
          },
          where: {
            start_date: {
              gte: startOfDay(new Date()),
              lte: endOfDay(new Date()),
            },
          },
        },
      },
    });

    //await prisma?.$disconnect();

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

// update a client

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
    const data = await prisma?.clients.update({
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

    //await prisma?.$disconnect();

    return NextResponse.json({ successMessage: 'Client Updated' });
  } catch (error: any) {
    console.log(error);

    //await prisma.$disconnect();

    if (error.code == 'P2002') {
      return NextResponse.json(
        { fieldsErrors: { email: ['Email already registered'] } },
        { status: 422 },
      );
    }

    return NextResponse.json({ DataBaseErrors: 'Server Error' }, { status: 500 });
  }
}

// // delete a client

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  try {
    const data = await prisma?.clients.update({
      where: {
        id: id,
      },
      data: {
        deleted: true,
        client_status_id: 12,
      },
    });

    //await prisma?.$disconnect();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
