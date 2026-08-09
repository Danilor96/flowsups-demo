import prisma from '@/app/libs/prisma';
import { z } from 'zod';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();

  const searchParamSchema = z.object({
    param: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Pleas, enter a value'),
  });

  const validatedData = searchParamSchema.safeParse({
    param: formData.get('param'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { param } = validatedData.data;

  try {
    const searchTerms = param
      .toLowerCase()
      .replaceAll('-', '')
      .replaceAll('(', '')
      .replaceAll(')', '')
      .split(' ')
      .filter((term) => term.length > 0);

    const clients = await prisma.clients.findMany({
      where: {
        AND: searchTerms.map(term => {
          const phoneVariations = [term];

          if (/^\d+$/.test(term)) {
            if (term.length <= 3) {
              phoneVariations.push(`(${term}`);
              if (term.length === 3) phoneVariations.push(`(${term})`);
            } else {
              const p1 = term.slice(0, 3);
              const rest = term.slice(3);

              phoneVariations.push(`(${p1})${rest}`);

              if (rest.length <= 3) {
                phoneVariations.push(`(${p1}) ${rest}`);
                phoneVariations.push(`${p1}-${rest}`);
              } else {
                const p2 = rest.slice(0, 3);
                const p3 = rest.slice(3);

                phoneVariations.push(`(${p1})${p2}${p3}`); // (000)0000000
                phoneVariations.push(`(${p1}) ${p2}-${p3}`); // (000) 000-0000
                phoneVariations.push(`(${p1})${p2}-${p3}`); // (000)000-000
                phoneVariations.push(`${p1}-${p2}-${p3}`); // 000-000-0000
                phoneVariations.push(`${p1})${p2}-${p3}`); // 000)000-000
              }
            }
          }

          return {
            OR: [
              { first_name: { contains: term, mode: 'insensitive' } },
              { last_name: { contains: term, mode: 'insensitive' } },
              { email: { contains: term, mode: 'insensitive' } },
              ...phoneVariations.flatMap(variation => [
                { mobile_phone: { contains: variation, mode: 'insensitive' as const } },
                { home_phone: { contains: variation, mode: 'insensitive' as const } },
                { work_phone: { contains: variation, mode: 'insensitive' as const } },
              ]),
              {
                interested_vehicle: {
                  vehicle_brands: { brand: { contains: term, mode: 'insensitive' } },
                },
              },
              {
                interested_vehicle: {
                  vehicle_models: { model: { contains: term, mode: 'insensitive' } },
                },
              },
              {
                interested_vehicle: {
                  stock_no: { contains: term, mode: 'insensitive' },
                },
              },
              {
                lead: {
                  some: {
                    // is_active: true,
                    vehicle: {
                      stock_no: { contains: term, mode: 'insensitive' },
                    },
                  },
                },
              },
            ],
          };
        }),
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        mobile_phone: true,
        email: true,
        lead: {
          where: {
            is_active: true,
          },
          select: {
            sales_rep_id: true,
            bdc_id: true,
            customer_status: {
              select: {
                id: true,
                status: true,
              },
            },
            customer_funding_list_status_id: true,
          },
        },
      },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
