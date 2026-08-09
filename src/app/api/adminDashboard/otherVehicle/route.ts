import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/app/libs/prisma';
import { auth } from '@/auth';

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const body = await request.json();

    const vehicleSchema = z.object({
      year: z.string().min(1, 'Year is required'),
      make: z.string().min(1, 'Make is required'),
      model: z.string().min(1, 'Model is required'),
      stock_no: z.string().min(1, 'Stock number is required'),
      vin: z
        .string()
        .min(17, 'VIN is required (17 characters)')
        .max(17, 'VIN is required (17 characters)'),
    });

    const validatedData = vehicleSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { fieldErrors: validatedData.error.flatten().fieldErrors },
        { status: 422 },
      );
    }

    const { year, make, model, stock_no, vin } = validatedData.data;

    const promiseExistsVin = prisma?.vehicle_identification_numbers.findUnique({
      where: {
        vin,
      },
    });
    const existsVehicleStockNoPromise = prisma?.vehicles.findUnique({
      where: {
        stock_no,
      },
      select: {
        id: true,
        stock_no: true,
      },
    });

    const [existsVehicleStockNo, vinExists] = await Promise.all([
      existsVehicleStockNoPromise,
      promiseExistsVin,
    ]);

    if (existsVehicleStockNo) {
      return NextResponse.json(
        { fieldErrors: { stock_no: ['Stock number already exists'] } },
        { status: 422 },
      );
    }

    if (vinExists) {
      return NextResponse.json({ fieldErrors: { vin: ['VIN already exists'] } }, { status: 422 });
    }

    const yearData = await prisma?.vehicle_manufacture_years.upsert({
      where: {
        year: year,
      },
      update: {},
      create: {
        year: year,
      },
    });

    let makeExists = await prisma.vehicle_make.findFirst({
      where: {
        brand: {
          equals: make,
          mode: 'insensitive',
        },
      },
    });

    if (!makeExists) {
      makeExists = await prisma?.vehicle_make.create({
        data: {
          brand: make,
        },
      });
    }

    let modelExists = await prisma.vehicle_models.findFirst({
      where: {
        model: {
          equals: model,
          mode: 'insensitive',
        },
      },
    });

    if (!modelExists) {
      modelExists = await prisma.vehicle_models.create({
        data: {
          model: model,
        },
      });
    }

    const newVehicle = await prisma.vehicles.create({
      data: {
        stock_no,
        vehicle_identification_numbers: {
          create: {
            vin,
          },
        },
        vehicle_manufacture_years: {
          connect: {
            id: yearData.id,
          },
        },
        vehicle_brands: {
          connect: {
            id: makeExists.id,
          },
        },
        vehicle_models: {
          connect: {
            id: modelExists.id,
          },
        },
      },
    });

    return NextResponse.json(newVehicle, { status: 201 });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Vehicle ID is required' }, { status: 400 });
    }

    const vehicle = await prisma.vehicles.findUnique({
      where: { id: Number(id) },
      include: {
        vehicle_identification_numbers: true,
        vehicle_manufacture_years: true,
        vehicle_brands: true,
        vehicle_models: true,
      },
    });

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    const formattedVehicle = {
      id: vehicle.id,
      year: vehicle.vehicle_manufacture_years?.year || '',
      brand: vehicle.vehicle_brands?.brand || '',
      model: vehicle.vehicle_models?.model || '',
      stock_no: vehicle.stock_no,
      vin: vehicle.vehicle_identification_numbers?.vin || '',
    };

    return NextResponse.json(formattedVehicle);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const body = await request.json();

    const vehicleSchema = z.object({
      id: z.number(),
      year: z.string().min(1, 'Year is required'),
      make: z.string().min(1, 'Make is required'),
      model: z.string().min(1, 'Model is required'),
      stock_no: z.string().min(1, 'Stock number is required'),
      vin: z
        .string()
        .min(17, 'VIN is required (17 characters)')
        .max(17, 'VIN is required (17 characters)'),
    });

    const validatedData = vehicleSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { fieldErrors: validatedData.error.flatten().fieldErrors },
        { status: 422 },
      );
    }

    const { id, year, make, model, stock_no, vin } = validatedData.data;

    const currentVehicle = await prisma.vehicles.findUnique({
      where: { id },
      include: { vehicle_identification_numbers: true },
    });

    if (!currentVehicle) {
      return NextResponse.json({ serverError: 'Vehicle not found' }, { status: 404 });
    }

    const existsVehicleStockNo = await prisma.vehicles.findFirst({
      where: {
        stock_no,
        id: { not: id },
      },
    });

    if (existsVehicleStockNo) {
      return NextResponse.json(
        { fieldErrors: { stock_no: ['Stock number already exists'] } },
        { status: 422 },
      );
    }

    if (vin !== currentVehicle.vehicle_identification_numbers.vin) {
      const vinExists = await prisma.vehicle_identification_numbers.findUnique({
        where: { vin },
      });
      if (vinExists) {
        return NextResponse.json({ fieldErrors: { vin: ['VIN already exists'] } }, { status: 422 });
      }
    }

    const yearData = await prisma?.vehicle_manufacture_years.upsert({
      where: {
        year: year,
      },
      update: {},
      create: {
        year: year,
      },
    });

    let makeExists = await prisma.vehicle_make.findFirst({
      where: {
        brand: {
          equals: make,
          mode: 'insensitive',
        },
      },
    });

    if (!makeExists) {
      makeExists = await prisma?.vehicle_make.create({
        data: {
          brand: make,
        },
      });
    }

    let modelExists = await prisma.vehicle_models.findFirst({
      where: {
        model: {
          equals: model,
          mode: 'insensitive',
        },
      },
    });

    if (!modelExists) {
      modelExists = await prisma.vehicle_models.create({
        data: {
          model: model,
        },
      });
    }

    const updatedVehicle = await prisma.vehicles.update({
      where: { id },
      data: {
        stock_no,
        vehicle_identification_numbers: {
          update: {
            vin,
          },
        },
        vehicle_manufacture_years: {
          connect: {
            id: yearData.id,
          },
        },
        vehicle_brands: {
          connect: {
            id: makeExists.id,
          },
        },
        vehicle_models: {
          connect: {
            id: modelExists.id,
          },
        },
      },
    });

    return NextResponse.json(updatedVehicle, { status: 200 });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
