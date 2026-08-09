import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(request: Request) {
  const formData = await request.formData();

  const wishlist = formData.get('wishlist');
  const alreadyExist = formData.get('wishlistAlreadyExist');
  const tradein = formData.get('tradein');
  // wishlist

  // if (wishlist && !alreadyExist) {
  //   const clientVehicleSchema = z.object({
  //     vehicle_id: z
  //       .string({ invalid_type_error: 'Please enter a valid value' })
  //       .min(1, 'Please enter a value'),
  //     max_mileage: z
  //       .string({ invalid_type_error: 'Please enter a valid value' })
  //       .min(1, 'Please enter a value'),
  //     max_price: z
  //       .string({ invalid_type_error: 'Please enter a valid value' })
  //       .min(1, 'Please enter a value'),
  //     min_year: z
  //       .string({ invalid_type_error: 'Please enter a valid value' })
  //       .min(1, 'Please enter a value'),
  //     exterior_color: z
  //       .string({ invalid_type_error: 'Please enter a valid value' })
  //       .min(1, 'Please enter a value'),
  //     body_type: z
  //       .string({ invalid_type_error: 'Please enter a valid value' })
  //       .min(1, 'Please enter a value'),
  //     client_id: z
  //       .string({ invalid_type_error: 'Please enter a valid value' })
  //       .min(1, 'Please enter a value'),
  //   });

  //   const validatedData = clientVehicleSchema.safeParse({
  //     vehicle_id: formData.get('vehicle_id'),
  //     max_mileage: formData.get('max_mileage'),
  //     max_price: formData.get('max_price'),
  //     min_year: formData.get('min_year'),
  //     exterior_color: formData.get('exterior_color'),
  //     body_type: formData.get('body_type'),
  //     client_id: formData.get('client_id'),
  //   });

  //   if (!validatedData.success) {
  //     return NextResponse.json(
  //       { fieldErrors: validatedData.error.flatten().fieldErrors },
  //       { status: 422 },
  //     );
  //   }

  //   const { body_type, client_id, exterior_color, max_mileage, max_price, min_year, vehicle_id } =
  //     validatedData.data;

  //   let colorId, mileageId, priceId;

  //   try {
  //     const mileage_id = await prisma?.vehicle_mileages.findUnique({
  //       where: {
  //         id: parseInt(max_mileage),
  //       },
  //     });

  //     //await prisma?.$disconnect();

  //     if (!mileage_id?.id) {
  //       // const mil = await prisma?.vehicle_mileages.create({
  //       //   data: {
  //       //     mileage: max_mileage,
  //       //   },
  //       // });
  //       // //await prisma?.$disconnect();
  //       // mileageId = mil.id;
  //     } else {
  //       mileageId = mileage_id.id;
  //     }

  //     const price_id = await prisma?.vehicle_prices.findUnique({
  //       where: {
  //         id: parseInt(max_price),
  //       },
  //     });

  //     //await prisma?.$disconnect();

  //     if (!price_id) {
  //       const pri = await prisma?.vehicle_prices.create({
  //         data: {
  //           price: max_price,
  //         },
  //       });

  //       //await prisma?.$disconnect();

  //       priceId = pri.id;
  //     } else {
  //       priceId = price_id.id;
  //     }

  //     const color_id = await prisma?.vehicle_colors.findUnique({
  //       where: {
  //         id: parseInt(exterior_color),
  //       },
  //     });

  //     //await prisma?.$disconnect();

  //     if (!color_id) {
  //       const col = await prisma?.vehicle_colors.create({
  //         data: {
  //           color: exterior_color,
  //         },
  //       });
  //       //await prisma?.$disconnect();

  //       colorId = col.id;
  //     } else {
  //       colorId = color_id.id;
  //     }

  //     const body_type_id = await prisma?.vehicle_body_types.create({
  //       data: {
  //         type: body_type,
  //       },
  //     });

  //     //await prisma?.$disconnect();

  //     const year_id = await prisma?.vehicle_manufacture_years.create({
  //       data: {
  //         year: min_year,
  //       },
  //     });

  //     //await prisma?.$disconnect();

  //     // const data = await prisma?.client_vehicle_wishlist.create({
  //     //   data: {
  //     //     body_type_id: body_type_id.id,
  //     //     client_id_id: parseInt(client_id),
  //     //     min_year_id: year_id.id,
  //     //     vehicle_id: parseInt(vehicle_id),
  //     //     exterior_color_id: colorId,
  //     //     max_mileage_id: mileageId,
  //     //     max_price_id: priceId,
  //     //   },
  //     // });

  //     return NextResponse.json(
  //       { successMessage: 'Vehicle Wishlist Created Sucsseffuly' },
  //       { status: 200 },
  //     );
  //   } catch (error) {
  //     console.log(error);
  //     return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  //   }
  // }

  // tradein

  if (tradein) {
    const tradeinSchema = z.object({
      vinInput: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      tradeinVehicleYearInput: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      tradeinVehicleMakeInput: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      tradeinVehicleModelInput: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      tradeinVehicleTrimInput: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      vehicleTradeinMileageInput: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      vehicleTradeinInteriorColorInput: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      vehicleTradeinExteriorColorInput: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      tradeinCommentInput: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .optional(),
      tradeinBookInput: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
      tradeinAllowanceInput: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .optional(),
      tradeinVehicleTypeInput: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      tradeinPayoffInput: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
      client_id: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
    });

    const validaData = tradeinSchema.safeParse({
      vinInput: formData.get('vinInput'),
      tradeinVehicleYearInput: formData.get('tradeinVehicleYearInput'),
      tradeinVehicleMakeInput: formData.get('tradeinVehicleMakeInput'),
      tradeinVehicleModelInput: formData.get('tradeinVehicleModelInput'),
      tradeinVehicleTrimInput: formData.get('tradeinVehicleTrimInput'),
      vehicleTradeinMileageInput: formData.get('vehicleTradeinMileageInput'),
      vehicleTradeinInteriorColorInput: formData.get('vehicleTradeinInteriorColorInput'),
      vehicleTradeinExteriorColorInput: formData.get('vehicleTradeinExteriorColorInput'),
      tradeinCommentInput: formData.get('tradeinCommentInput'),
      tradeinBookInput: formData.get('tradeinBookInput'),
      tradeinAllowanceInput: formData.get('tradeinAllowanceInput'),
      tradeinVehicleTypeInput: formData.get('tradeinVehicleTypeInput'),
      tradeinPayoffInput: formData.get('tradeinPayoffInput'),
      client_id: formData.get('client_id'),
    });

    if (!validaData.success) {
      return NextResponse.json(
        { fieldErrors: validaData.error.flatten().fieldErrors },
        { status: 422 },
      );
    }

    const {
      vinInput,
      tradeinVehicleYearInput,
      tradeinVehicleMakeInput,
      tradeinVehicleModelInput,
      tradeinVehicleTrimInput,
      vehicleTradeinMileageInput,
      vehicleTradeinInteriorColorInput,
      vehicleTradeinExteriorColorInput,
      tradeinCommentInput,
      tradeinBookInput,
      tradeinAllowanceInput,
      tradeinVehicleTypeInput,
      tradeinPayoffInput,
      client_id,
    } = validaData.data;

    let commentId;

    try {
      if (tradeinCommentInput) {
        const comment = await prisma?.vehicle_tradein_comments.create({
          data: {
            comment: tradeinCommentInput,
          },
        });

        commentId = comment.id;
      }

      const make = await prisma?.vehicle_make.upsert({
        where: {
          brand: tradeinVehicleMakeInput.toLowerCase(),
        },
        update: {},
        create: {
          brand: tradeinVehicleMakeInput.toLowerCase(),
        },
      });

      const mileage = await prisma?.vehicle_mileages.create({
        data: {
          mileage: vehicleTradeinMileageInput,
          milleage_type_id: 1,
        },
      });

      const model = await prisma?.vehicle_models.upsert({
        where: {
          model: tradeinVehicleModelInput.toLowerCase(),
        },
        update: {},
        create: {
          model: tradeinVehicleModelInput.toLowerCase(),
        },
      });

      const trim = await prisma?.vehicle_trims.create({
        data: {
          trim: tradeinVehicleTrimInput,
        },
      });

      const vin = await prisma?.vehicle_identification_numbers.upsert({
        where: {
          vin: vinInput,
        },
        update: {},
        create: {
          vin: vinInput,
        },
      });

      const year = await prisma?.vehicle_manufacture_years.upsert({
        where: {
          year: tradeinVehicleYearInput,
        },
        update: {},
        create: {
          year: tradeinVehicleYearInput,
        },
      });

      const data = await prisma?.client_vehicle_tradein.create({
        data: {
          comment_id: commentId,
          int_color_id: parseInt(vehicleTradeinInteriorColorInput),
          ext_color_id: parseInt(vehicleTradeinExteriorColorInput),
          make_id: make.id,
          mileage_id: mileage.id,
          model_id: model.id,
          trim_id: trim.id,
          vin_id: vin.id,
          year_id: year.id,
          client_id: parseInt(client_id),
          book_value: tradeinBookInput,
          trade_allowance: tradeinAllowanceInput,
          trade_payoff: tradeinPayoffInput,
          vehicle_type_id: parseInt(tradeinVehicleTypeInput),
        },
      });

      //await prisma?.$disconnect();

      return NextResponse.json({ successMessage: 'Traede in created' });
    } catch (error) {
      console.log(error);
      return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
    }
  }

  return NextResponse.json(
    { successMessage: 'No changes in Wishlist and Tradein' },
    { status: 200 },
  );
}
