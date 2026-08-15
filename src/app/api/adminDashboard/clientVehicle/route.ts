import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(request: Request) {
  const formData = await request.formData();

  const wishlist = formData.get('wishlist');
  const alreadyExist = formData.get('wishlistAlreadyExist');
  const tradein = formData.get('tradein');

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
        const comment = mockDb.vehicle_tradein_comments.create({
          data: {
            comment: tradeinCommentInput,
          },
        });

        commentId = comment.id;
      }

      const make = mockDb.vehicle_make.upsert({
        where: {
          brand: tradeinVehicleMakeInput.toLowerCase(),
        },
        update: {},
        create: {
          brand: tradeinVehicleMakeInput.toLowerCase(),
        },
      });

      const mileage = mockDb.vehicle_mileages.create({
        data: {
          mileage: vehicleTradeinMileageInput,
          milleage_type_id: 1,
        },
      });

      const model = mockDb.vehicle_models.upsert({
        where: {
          model: tradeinVehicleModelInput.toLowerCase(),
        },
        update: {},
        create: {
          model: tradeinVehicleModelInput.toLowerCase(),
        },
      });

      const trim = mockDb.vehicle_trims.create({
        data: {
          trim: tradeinVehicleTrimInput,
        },
      });

      const vin = mockDb.vehicle_identification_numbers.upsert({
        where: {
          vin: vinInput,
        },
        update: {},
        create: {
          vin: vinInput,
        },
      });

      const year = mockDb.vehicle_manufacture_years.upsert({
        where: {
          year: tradeinVehicleYearInput,
        },
        update: {},
        create: {
          year: tradeinVehicleYearInput,
        },
      });

      const data = mockDb.client_vehicle_tradein.create({
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
