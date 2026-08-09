import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prisma';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const vehicleId = parseInt(params.id);

  try {
    const data = await prisma?.vehicles.findUnique({
      where: {
        id: vehicleId,
      },
      include: {
        general_info: {
          include: {
            emission: true,
            inspection: true,
          },
        },
        purchase_info: true,
        title_license: true,
        key_info: true,
        vehicle_identification_numbers: true,
        vehicle_status: true,
        vehicle_brands: true,
        exterior_vehicle_colors: true,
        interior_vehicle_colors: true,
        vehicle_models: true,
        vehicle_manufacture_years: true,
        vehicle_trim: true,
        vehicle_engine: true,
        vehicle_image: true,
        body_type: true,
        vehicle_transmissions: true,
        vehicle_prices: true,
        vehicle_fuel_tank_types: true,
        vehicle_conditions: true,
        vehicle_mileages: true,
        vehicle_drive_train: true,
        vehicle_type: true,
      },
    });

    //await prisma?.$disconnect();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(26);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const vehicleId = parseInt(params.id);

  try {
    const data = await prisma.vehicles.delete({
      where: {
        id: vehicleId,
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Item Successfully Deleted' }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
