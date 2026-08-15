import { NextResponse } from 'next/server';
import { z } from 'zod';
import { mockDb } from '@/app/libs/mock-db';
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

    const vinExists = mockDb.vehicle_identification_numbers.findUnique({
      where: {
        vin,
      },
    });
    const existsVehicleStockNo = mockDb.vehicles.findUnique({
      where: {
        stock_no,
      },
    });

    if (existsVehicleStockNo) {
      return NextResponse.json(
        { fieldErrors: { stock_no: ['Stock number already exists'] } },
        { status: 422 },
      );
    }

    if (vinExists) {
      return NextResponse.json({ fieldErrors: { vin: ['VIN already exists'] } }, { status: 422 });
    }

    const yearData = mockDb.vehicle_manufacture_years.upsert({
      where: {
        year: year,
      },
      update: {},
      create: {
        year: year,
      },
    });

    let makeExists = mockDb.vehicle_make.findFirst({
      where: {
        brand: {
          equals: make,
        },
      },
    });

    if (!makeExists) {
      makeExists = mockDb.vehicle_make.create({
        data: {
          brand: make,
        },
      });
    }

    let modelExists = mockDb.vehicle_models.findFirst({
      where: {
        model: {
          equals: model,
        },
      },
    });

    if (!modelExists) {
      modelExists = mockDb.vehicle_models.create({
        data: {
          model: model,
        },
      });
    }

    const newVehicle = mockDb.vehicles.create({
      data: {
        stock_no,
        vehicle_identification_numbers: {
          vin,
        },
        vehicle_manufacture_years: { id: yearData.id, year: yearData.year },
        vehicle_brands: { id: makeExists.id, brand: makeExists.brand },
        vehicle_models: { id: modelExists.id, model: modelExists.model },
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

    const vehicle = mockDb.vehicles.findUnique({
      where: { id: Number(id) },
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

    const currentVehicle = mockDb.vehicles.findUnique({
      where: { id },
    });

    if (!currentVehicle) {
      return NextResponse.json({ serverError: 'Vehicle not found' }, { status: 404 });
    }

    const existsVehicleStockNo = mockDb.vehicles.findFirst({
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

    if (vin !== currentVehicle.vehicle_identification_numbers?.vin) {
      const vinExists = mockDb.vehicle_identification_numbers.findUnique({
        where: { vin },
      });
      if (vinExists) {
        return NextResponse.json({ fieldErrors: { vin: ['VIN already exists'] } }, { status: 422 });
      }
    }

    const yearData = mockDb.vehicle_manufacture_years.upsert({
      where: {
        year: year,
      },
      update: {},
      create: {
        year: year,
      },
    });

    let makeExists = mockDb.vehicle_make.findFirst({
      where: {
        brand: {
          equals: make,
        },
      },
    });

    if (!makeExists) {
      makeExists = mockDb.vehicle_make.create({
        data: {
          brand: make,
        },
      });
    }

    let modelExists = mockDb.vehicle_models.findFirst({
      where: {
        model: {
          equals: model,
        },
      },
    });

    if (!modelExists) {
      modelExists = mockDb.vehicle_models.create({
        data: {
          model: model,
        },
      });
    }

    const updatedVehicle = mockDb.vehicles.update({
      where: { id },
      data: {
        stock_no,
        vehicle_identification_numbers: {
          ...currentVehicle.vehicle_identification_numbers,
          vin,
        },
        vehicle_manufacture_years: { id: yearData.id, year: yearData.year },
        vehicle_brands: { id: makeExists.id, brand: makeExists.brand },
        vehicle_models: { id: modelExists.id, model: modelExists.model },
      },
    });

    return NextResponse.json(updatedVehicle, { status: 200 });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}