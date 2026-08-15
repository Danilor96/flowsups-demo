import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';

export async function GET() {
  let allData = [];

  try {
    const bodyType = mockDb.vehicle_body_types.findMany();

    const colors = mockDb.vehicle_colors.findMany();

    const brands = mockDb.vehicle_make.findMany();

    const models = mockDb.vehicle_models.findMany();

    const manufacYear = mockDb.vehicle_manufacture_years.findMany();

    const vin = mockDb.vehicle_identification_numbers.findMany();

    const standardFeatures = mockDb.vehicle_types.findMany();

    const transmission = mockDb.vehicle_transmissions.findMany();

    const price = mockDb.vehicle_prices.findMany();

    const fuelTankType = mockDb.vehicle_fuel_tank_types.findMany();

    const condition = mockDb.vehicle_conditions.findMany();

    const mileage = mockDb.vehicle_mileages.findMany();

    const vehicleType = mockDb.vehicle_types.findMany();

    const status = mockDb.vehicle_status.findMany();

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

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}