import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prisma';

export async function POST(request: Request) {
  const data: any[] = await request.json();

  try {
    const colorCache: Record<string, number> = {};
    const transmissionCache: Record<string, number> = {};

    await prisma.$transaction(async (prisma) => {
      for (let i = 0; i < data.length; i++) {
        const element = data[i];

        console.log(element);

        const vinExists = await prisma.vehicle_identification_numbers.findUnique({
          where: { vin: element.vin },
        });

        if (!vinExists) {
          const make = element.vehicle.toLowerCase().split(' ')[1];

          const modelArray = element.vehicle.toLowerCase().split(' ');

          const model = modelArray.slice(2).join(' ');

          const year = element.vehicle.split(' ')[0];

          const [
            vehicleMake,
            vehicleModel,
            vehicleTrim,
            vehicleYear,
            vehicleBodyType,
            vehicleEngine,
          ] = await Promise.all([
            prisma.vehicle_make.upsert({
              where: {
                brand: make,
              },
              update: {},
              create: {
                brand: make,
              },
            }),
            prisma.vehicle_models.upsert({
              where: {
                model: model,
              },
              update: {},
              create: {
                model: model,
              },
            }),
            prisma.vehicle_trim.upsert({
              where: {
                trim: element.stock,
              },
              update: {},
              create: {
                trim: element.stock,
              },
            }),
            prisma.vehicle_manufacture_years.upsert({
              where: {
                year: year,
              },
              update: {},
              create: {
                year: year,
              },
            }),
            prisma.vehicle_body_types.upsert({
              where: {
                type: element.body,
              },
              update: {},
              create: {
                type: element.body,
              },
            }),
            prisma.vehicle_engine.upsert({
              where: {
                engine: '12345',
              },
              update: {},
              create: {
                engine: '12345',
              },
            }),
          ]);

          const getColorId = async (color: string) => {
            if (colorCache[color]) return colorCache[color];

            const dbColor = await prisma.vehicle_colors.findFirst({
              where: { color: color },
            });

            if (dbColor) {
              colorCache[color] = dbColor.id;
              return dbColor.id;
            } else {
              const newColor = await prisma.vehicle_colors.create({ data: { color: color } });
              colorCache[color] = newColor.id;
              return newColor.id;
            }
          };

          const getTransmissionId = async (tran: string) => {
            if (transmissionCache[tran]) return transmissionCache[tran];

            const dbTran = await prisma.vehicle_transmissions.findFirst({
              where: { transmission: tran },
            });

            if (dbTran) {
              transmissionCache[tran] = dbTran.id;
              return dbTran.id;
            } else {
              const newTran = await prisma.vehicle_transmissions.create({
                data: { transmission: tran },
              });
              transmissionCache[tran] = newTran.id;
              return newTran.id;
            }
          };

          const vinNumber = await prisma.vehicle_identification_numbers.create({
            data: {
              vin: element.vin,
            },
          });

          // const vehicle = await prisma.vehicles.create({
          //   data: {
          //     cylinder: '0',
          //     doors: '0',
          //     gvw: '0',
          //     hwy: '0',
          //     motor: '0',
          //     mpg_city: '0',
          //     odometer: `${element.odometer}`,
          //     odometer_make_id: 1,
          //     weight: '0',
          //     body_type_id: vehicleBodyType.id,
          //     condition_id: 1,
          //     drive_train_id: 1,
          //     engine_id: vehicleEngine.id,
          //     exterior_color_id: await getColorId(element.color),
          //     fuel_tank_type_id: 1,
          //     identification_id: vinNumber.id,
          //     image_id: undefined,
          //     interior_color_id: await getColorId(element.color),
          //     make_id: vehicleMake.id,
          //     model_id: vehicleModel.id,
          //     transmission_id: await getTransmissionId(element.transmission),
          //     trim_id: vehicleTrim.id,
          //     vehicle_status_id: 1,
          //     vehicle_type_id: 1,
          //     manufacture_year_id: vehicleYear.id,
          //     key_info_id: undefined,
          //     title_license_id: undefined,
          //     vehicle_general_info_id: undefined,
          //     vehicle_purchase_info_id: undefined,
          //   },
          // });
        }
      }
    });

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Data Successfully Imported' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function GET() {
  let dataToExport: any[] = [];

  try {
    const data = await prisma.vehicles.findMany({
      include: {
        general_info: {
          include: {
            emission: true,
            inspection: true,
            sales_category: true,
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

    //await prisma.$disconnect();

    data.forEach((el) => {
      dataToExport.push({
        vehicle: `${el.vehicle_manufacture_years?.year} ${el.vehicle_brands.brand} ${el.vehicle_models.model} ${el.vehicle_trim?.trim}`,
        stock_no: `${el.general_info?.stock_no}`,
        vin: `${el.vehicle_identification_numbers.vin}`,
        color: `${el.exterior_vehicle_colors?.color}`,
        body: `${el.body_type?.type}`,
        transmission: `${el.vehicle_transmissions?.transmission}`,
        status: `${el.vehicle_status?.status}`,
        odometer: `${el.odometer}`,
      });
    });

    return NextResponse.json(dataToExport, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
