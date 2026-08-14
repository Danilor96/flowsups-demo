import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const vehicleId = parseInt(params.id);

  const formData = await request.formData();

  const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const vehicleSchema = z.object({
    /* ----------------- add vehicle ----------------- */
    status: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    customStatus: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    newUsed: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    vehicleType: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    vin: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(17, 'VIN must contain 17 characters')
      .max(17, 'VIN must contain 17 characters'),
    odometer: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    make1: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    year: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(4, 'Please enter a valid value')
      .max(4, 'Please enter a valid value'),
    make2: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    model: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    trim: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    engine: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    transmission: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    driveTrain: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    door: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    cylinder: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    bodyType: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    fuelType: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    horsePower: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    exterior: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    interior: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    mpgCity: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    hwy: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    vehicleWeight: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    gvw: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    vehicleImage: z
      .any()
      .refine((file: File) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: 'Only .jpg, .jpeg, .png and .webp formats are supported',
      })
      .nullable(),
    imageId: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    vinId: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    firebaseImage: z.nullable(z.string({ invalid_type_error: 'Please enter a valid value' })),
  });

  const validatedData = vehicleSchema.safeParse({
    // add vehicle
    status: formData.get('status'),
    customStatus: formData.get('customStatus'),
    newUsed: formData.get('newUsed'),
    vehicleType: formData.get('vehicleType'),
    vin: formData.get('vin'),
    odometer: formData.get('odometer'),
    make1: formData.get('make1'),
    year: formData.get('year'),
    make2: formData.get('make2'),
    model: formData.get('model'),
    trim: formData.get('trim'),
    engine: formData.get('engine'),
    transmission: formData.get('transmission'),
    driveTrain: formData.get('driveTrain'),
    door: formData.get('door'),
    cylinder: formData.get('cylinder'),
    bodyType: formData.get('bodyType'),
    fuelType: formData.get('fuelType'),
    horsePower: formData.get('horsePower'),
    exterior: formData.get('exterior'),
    interior: formData.get('interior'),
    mpgCity: formData.get('mpgCity'),
    hwy: formData.get('hwy'),
    vehicleWeight: formData.get('vehicleWeight'),
    gvw: formData.get('gvw'),
    vehicleImage: formData.get('vehicleImage'),
    imageId: formData.get('imageId'),
    vinId: formData.get('vinId'),
    firebaseImage: formData.get('firebaseImage'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const {
    status,
    customStatus,
    newUsed,
    vehicleType,
    vin,
    odometer,
    make1,
    year,
    make2,
    model,
    trim,
    engine,
    transmission,
    driveTrain,
    door,
    cylinder,
    bodyType,
    fuelType,
    horsePower,
    exterior,
    interior,
    mpgCity,
    hwy,
    vehicleWeight,
    gvw,
    vehicleImage,
    imageId,
    vinId,
    firebaseImage,
  } = validatedData.data;

  try {
    const make = mockDb.vehicle_make.upsert({
      where: { brand: make2 },
      update: {},
      create: {
        brand: make2,
      },
    });

    const vehicleModel = mockDb.vehicle_models.upsert({
      where: { model: model },
      update: {},
      create: {
        model: model,
      },
    });

    let vehicleTrim: any = undefined;

    if (trim) {
      vehicleTrim = mockDb.vehicle_trim.upsert({
        where: { trim: trim.toLowerCase().trim() },
        update: {},
        create: {
          trim: trim.toLowerCase().trim(),
        },
      });
    }

    const vehicleYear = mockDb.vehicle_manufacture_years.upsert({
      where: { year: year.toLowerCase().trim() },
      update: {},
      create: {
        year: year,
      },
    });

    const vehicleBodyType = mockDb.vehicle_body_types.upsert({
      where: { type: bodyType },
      update: {},
      create: {
        type: bodyType,
      },
    });

    const vehicleEngine = mockDb.vehicle_engine.upsert({
      where: { engine: engine },
      update: {},
      create: {
        engine: engine,
      },
    });

    const vehicleIdentification = mockDb.vehicle_identification_numbers.upsert({
      where: {
        id: parseInt(vinId),
      },
      update: {},
      create: {
        vin: vin,
      },
    });

    let path: any = null;
    let createdImageId: any = null;

    if (vehicleImage && firebaseImage) {
      path = 'https://firebasestorage.googleapis.com/v0/b/demo/o/images%2F' + vehicleImage.name;

      if (imageId) {
        const vehicleImg = mockDb.vehicle_image.update({
          where: {
            id: parseInt(imageId),
          },
          data: {
            path: path,
          },
        });
      } else {
        const createImage = mockDb.vehicle_image.create({
          data: {
            path: path,
          },
        });

        createdImageId = createImage.id;
      }
    } else if (vehicleImage) {
      path = 'https://firebasestorage.googleapis.com/v0/b/demo/o/images%2F' + vehicleImage.name;

      const createImage = mockDb.vehicle_image.create({
        data: {
          path: path,
        },
      });

      createdImageId = createImage.id;
    }

    const vehicle = mockDb.vehicles.update({
      where: {
        id: vehicleId,
      },
      data: {
        cylinder: cylinder,
        doors: door,
        gvw: gvw,
        hwy: hwy,
        motor: horsePower,
        mpg_city: mpgCity,
        odometer: odometer,
        odometer_make_id: parseInt(make1),
        weight: vehicleWeight,
        body_type_id: vehicleBodyType.id,
        condition_id: parseInt(newUsed),
        drive_train_id: parseInt(driveTrain),
        engine_id: vehicleEngine.id,
        exterior_color_id: parseInt(exterior),
        fuel_tank_type_id: parseInt(fuelType),
        interior_color_id: parseInt(interior),
        make_id: make.id,
        model_id: vehicleModel.id,
        transmission_id: parseInt(transmission),
        trim_id: vehicleTrim ? vehicleTrim.id : null,
        vehicle_status_id: parseInt(status),
        customer_status: customStatus,
        vehicle_type_id: parseInt(vehicleType),
        manufacture_year_id: vehicleYear.id,
        image_id: createdImageId ? parseInt(createdImageId) : null,
      },
    });

    return NextResponse.json({ successMessage: 'Data Successfully Updated' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
