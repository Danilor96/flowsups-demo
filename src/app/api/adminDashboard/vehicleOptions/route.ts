import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  let allData = [];

  try {
    const bodyType = await prisma?.vehicle_body_types.findMany();

    const colors = await prisma?.vehicle_colors.findMany();

    const brands = await prisma?.vehicle_make.findMany();

    const models = await prisma?.vehicle_models.findMany();

    const manufacYear = await prisma?.vehicle_manufacture_years.findMany();

    const vin = await prisma?.vehicle_identification_numbers.findMany();

    const standardFeatures = await prisma?.vehicle_types.findMany();

    const transmission = await prisma?.vehicle_transmissions.findMany();

    const price = await prisma?.vehicle_prices.findMany();

    const fuelTankType = await prisma?.vehicle_fuel_tank_types.findMany();

    const condition = await prisma?.vehicle_conditions.findMany();

    const mileage = await prisma?.vehicle_mileages.findMany();

    const vehicleType = await prisma?.vehicle_types.findMany();

    const status = await prisma?.vehicle_status.findMany();

    //await prisma.$disconnect();

    allData.push({
      vehicle_colors: colors,
      vehicle_brands: brands,
      vehicle_models: models,
      vehicle_manufacture_years: manufacYear,
      vehicle_identification_numbers: vin,
      vehicle_body_types: bodyType,
      vehicle_standard_features: standardFeatures,
      vehicle_transmissions: transmission,
      vehicle_prices: price,
      vehicle_fuel_tank_types: fuelTankType,
      vehicle_conditions: condition,
      vehicle_mileages: mileage,
      vehicle_status: status,
      vehicle_types: vehicleType,
    });

    return NextResponse.json(allData);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
