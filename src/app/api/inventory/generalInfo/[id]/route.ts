import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/app/libs/prisma';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const vehicleId = parseInt(params.id);

  const formData = await request.formData();

  const vehicleSchema = z
    .object({
      /* ----------------- general info ----------------- */
      salesType: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      stockNo: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      dateInStock: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      readyToShell: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      location: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      condition: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      inspectionStatus: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      purchaseDate: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      purchaseDetail: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      acqMillIn: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      acqMillType: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      buyer: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      source: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      purchaseFrom: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      howDidYouPay: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      inspectionDate: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      inspectionId: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      inspectionBy: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      emissionDate: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      emissionStatus: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      inspectionReferenceId: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .nullable(),
      emissionId: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    })
    .refine(
      (data) => {
        return !(
          data.inspectionStatus &&
          (!data.inspectionDate || !data.inspectionId || !data.inspectionBy)
        );
      },
      {
        message: 'Please, fill all inputs',
        path: ['inspectionDate', 'inspectionId', 'inspectionBy'],
      },
    );

  const validatedData = vehicleSchema.safeParse({
    // general info
    salesType: formData.get('salesType'),
    stockNo: formData.get('stockNo'),
    dateInStock: formData.get('dateInStock'),
    readyToShell: formData.get('readyToShell'),
    location: formData.get('location'),
    condition: formData.get('condition'),
    purchaseDate: formData.get('purchaseDate'),
    purchaseDetail: formData.get('purchaseDetail'),
    acqMillIn: formData.get('acqMillIn'),
    acqMillType: formData.get('acqMillType'),
    buyer: formData.get('buyer'),
    source: formData.get('source'),
    purchaseFrom: formData.get('purchaseFrom'),
    howDidYouPay: formData.get('howDidYouPay'),
    inspectionStatus: formData.get('inspectionStatus'),
    inspectionDate: formData.get('inspectionDate'),
    inspectionId: formData.get('inspectionId'),
    inspectionBy: formData.get('inspectionBy'),
    emissionDate: formData.get('emissionDate'),
    emissionStatus: formData.get('emissionStatus'),
    inspectionReferenceId: formData.get('inspectionReferenceId'),
    emissionId: formData.get('emissionId'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const {
    salesType,
    stockNo,
    dateInStock,
    readyToShell,
    location,
    condition,
    purchaseDate,
    purchaseDetail,
    acqMillIn,
    acqMillType,
    buyer,
    source,
    purchaseFrom,
    howDidYouPay,
    inspectionStatus,
    inspectionDate,
    inspectionId,
    inspectionBy,
    inspectionReferenceId,
    emissionDate,
    emissionStatus,
    emissionId,
  } = validatedData.data;

  try {
    const vehicle = await prisma.vehicles.findUnique({
      where: {
        id: vehicleId,
      },
    });

    if (vehicle?.vehicle_general_info_id) {
      const data1 = await prisma.general_info.update({
        where: {
          id: vehicle.vehicle_general_info_id,
        },
        data: {
          sales_type_id: parseInt(salesType),
          stock_no: stockNo,
          date_in_stock: new Date(dateInStock),
          ready_to_shell: new Date(readyToShell),
          location: location,
          condition_id: parseInt(condition),
        },
      });
    } else {
      let inspId: any = false;

      if (inspectionStatus && inspectionDate && inspectionId && inspectionBy) {
        const inspection = await prisma.inspection_status_data.create({
          data: {
            status_id: parseInt(inspectionStatus),
            date: new Date(inspectionDate),
            id_of_status: inspectionId,
            inspected_by: inspectionBy,
          },
        });

        inspId = inspection.id;
      }

      let emissId: any = false;

      if (emissionStatus && emissionDate) {
        const emission = await prisma.emission_status_data.create({
          data: {
            status_id: parseInt(emissionStatus),
            date: new Date(emissionDate),
          },
        });

        emissId = emission.id;
      }

      const newData = await prisma.general_info.create({
        data: {
          stock_no: stockNo,
          date_in_stock: new Date(dateInStock),
          ready_to_shell: new Date(readyToShell),
          location: location,
          emission_status_id: emissId ? emissId : null,
          inspection_status_id: inspId ? inspId : null,
          condition_id: parseInt(condition),
          sales_type_id: parseInt(salesType),
        },
      });

      const purchaseInfo = await prisma.vehicle_details_purchase_info.create({
        data: {
          purchase_date: new Date(purchaseDate),
          purchase_detail: purchaseDetail,
          acq_mill_in: acqMillIn,
          acq_mill_type_id: parseInt(acqMillType),
          buyer: buyer,
          source_id: parseInt(source),
          purchase_from: purchaseFrom,
          how_did_you_pay: howDidYouPay,
        },
      });
      const vehicleNewDataIds = await prisma.vehicles.update({
        where: {
          id: vehicle?.id,
        },
        data: {
          vehicle_general_info_id: newData.id,
          vehicle_purchase_info_id: purchaseInfo.id,
        },
      });
    }

    if (
      inspectionReferenceId &&
      inspectionBy &&
      inspectionDate &&
      inspectionStatus &&
      inspectionId
    ) {
      const data2 = await prisma.inspection_status_data.update({
        where: {
          id: parseInt(inspectionReferenceId),
        },
        data: {
          status_id: parseInt(inspectionStatus),
          id_of_status: inspectionId,
          date: new Date(inspectionDate),
          inspected_by: inspectionBy,
        },
      });
    }

    if (
      !inspectionReferenceId &&
      inspectionBy &&
      inspectionDate &&
      inspectionStatus &&
      inspectionId &&
      vehicle?.vehicle_general_info_id &&
      vehicle?.vehicle_general_info_id
    ) {
      const insp = await prisma.inspection_status_data.create({
        data: {
          status_id: parseInt(inspectionStatus),
          id_of_status: inspectionId,
          date: new Date(inspectionDate),
          inspected_by: inspectionBy,
        },
      });

      const genInfo = await prisma.general_info.update({
        where: {
          id: vehicle.vehicle_general_info_id,
        },
        data: {
          inspection_status_id: insp.id,
        },
      });
    }

    if (emissionId && emissionDate && emissionStatus) {
      const data3 = await prisma.emission_status_data.update({
        where: {
          id: parseInt(emissionId),
        },
        data: {
          date: new Date(emissionDate),
          status_id: parseInt(emissionStatus),
        },
      });
    }

    if (!emissionId && emissionDate && emissionStatus && vehicle?.vehicle_general_info_id) {
      const emis = await prisma.emission_status_data.create({
        data: {
          date: new Date(emissionDate),
          status_id: parseInt(emissionStatus),
        },
      });

      const genInfo = await prisma.general_info.update({
        where: {
          id: vehicle.vehicle_general_info_id,
        },
        data: {
          emission_status_id: emis.id,
        },
      });
    }

    if (vehicle?.vehicle_purchase_info_id) {
      const data4 = await prisma.vehicle_details_purchase_info.update({
        where: {
          id: vehicle.vehicle_purchase_info_id,
        },
        data: {
          purchase_date: new Date(purchaseDate),
          purchase_detail: purchaseDetail,
          acq_mill_in: acqMillIn,
          acq_mill_type_id: parseInt(acqMillType),
          buyer: buyer,
          source_id: parseInt(source),
          purchase_from: purchaseFrom,
          how_did_you_pay: howDidYouPay,
        },
      });
    }

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Data Successfully Updated' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
