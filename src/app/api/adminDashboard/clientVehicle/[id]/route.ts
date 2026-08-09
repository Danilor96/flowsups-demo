import prisma from '@/app/libs/prisma';
import { z } from 'zod';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const formData = await request.formData();

  const tradeinId = parseInt(params.id);

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
      const tradeinInfo = await prisma.client_vehicle_tradein.findFirst({
        where: {
          id: tradeinId,
        },
      });

      if (tradeinCommentInput && tradeinInfo?.comment_id) {
        const comment = await prisma?.vehicle_tradein_comments.update({
          where: {
            id: tradeinInfo.comment_id,
          },
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

      const data = await prisma?.client_vehicle_tradein.update({
        where: {
          id: tradeinId,
        },
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

      return NextResponse.json({ successMessage: 'Traede in updated' });
    } catch (error) {
      console.log(error);
      return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
    }
  }

  return NextResponse.json({ successMessage: 'No changes in Tradein' }, { status: 200 });
}
