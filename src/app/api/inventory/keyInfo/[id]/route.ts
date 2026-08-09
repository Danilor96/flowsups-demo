import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/app/libs/prisma';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const vehicleId = parseInt(params.id);

  const formData = await request.formData();

  const vehicleSchema = z.object({
    /* ----------------- key info ----------------- */
    decalNo: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    ignitionCode: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    doorKeyCode: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    valetKeyCode: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    duplicateKey: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    lienholder: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    lienAccountNo: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    payoffAmount: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    dueDate: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    datePaidOff: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    paymentMethod: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    perDiem: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    memo: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  });

  const validatedData = vehicleSchema.safeParse({
    // key info
    decalNo: formData.get('decalNo'),
    ignitionCode: formData.get('ignitionCode'),
    doorKeyCode: formData.get('doorKeyCode'),
    valetKeyCode: formData.get('valetKeyCode'),
    duplicateKey: formData.get('duplicateKey'),
    lienholder: formData.get('lienholder'),
    lienAccountNo: formData.get('lienAccountNo'),
    payoffAmount: formData.get('payoffAmount'),
    dueDate: formData.get('dueDate'),
    datePaidOff: formData.get('datePaidOff'),
    paymentMethod: formData.get('paymentMethod'),
    perDiem: formData.get('perDiem'),
    memo: formData.get('memo'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const {
    decalNo,
    ignitionCode,
    doorKeyCode,
    valetKeyCode,
    duplicateKey,
    lienholder,
    lienAccountNo,
    payoffAmount,
    dueDate,
    datePaidOff,
    paymentMethod,
    perDiem,
    memo,
  } = validatedData.data;

  try {
    const vehicle = await prisma.vehicles.findUnique({
      where: {
        id: vehicleId,
      },
    });

    if (vehicle?.key_info_id) {
      const data = await prisma.vehicle_details_key_info.update({
        where: {
          id: vehicle.key_info_id,
        },
        data: {
          decal_no: decalNo,
          ignition_code: ignitionCode,
          door_key_code: doorKeyCode,
          valet_key_code: valetKeyCode,
          duplicate_key: duplicateKey === '1' ? true : false,
          lienholder: lienholder,
          lien_account_no: lienAccountNo,
          payoff_amount: payoffAmount,
          due_date: dueDate ? new Date(dueDate) : null,
          date_paid_off: datePaidOff ? new Date(datePaidOff) : null,
          payment_method_id: paymentMethod ? parseInt(paymentMethod) : null,
          per_diem: perDiem,
          memo: memo,
        },
      });
    } else {
      const newData = await prisma.vehicle_details_key_info.create({
        data: {
          decal_no: decalNo,
          ignition_code: ignitionCode,
          door_key_code: doorKeyCode,
          valet_key_code: valetKeyCode,
          duplicate_key: duplicateKey === '1' ? true : false,
          lienholder: lienholder,
          lien_account_no: lienAccountNo,
          payoff_amount: payoffAmount,
          due_date: dueDate ? new Date(dueDate) : null,
          date_paid_off: datePaidOff ? new Date(datePaidOff) : null,
          payment_method_id: paymentMethod ? parseInt(paymentMethod) : null,
          per_diem: perDiem,
          memo: memo,
        },
      });

      const vehicleDataReference = await prisma.vehicles.update({
        where: {
          id: vehicle?.id,
        },
        data: {
          key_info_id: newData.id,
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
