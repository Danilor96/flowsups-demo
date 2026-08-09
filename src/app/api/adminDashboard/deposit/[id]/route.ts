import { z } from 'zod';
import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createNotification } from '@/app/libs/notifications/notifications';
import { uploadDepositScanned } from '@/app/libs/uploadImages.services';
import { createEvent } from '@/app/libs/events/events';
import { checkPermissions } from '@/app/libs/auth-helpers';
import { Prisma } from '@prisma/client';
import { CustomersStatuses } from '@/app/libs/customer/customersFunctions';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(70);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const urlRequest = new URL(request.url);

  const searchParams = urlRequest.searchParams;

  const currentLeadId = searchParams.get('leadId');

  const formData = await request.formData();

  const clientId = parseInt(params.id);

  const session = await auth();
  const userId = session?.user.id;

  const depositSchema = z.object({
    interestedVehicle: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    amount: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    proFee: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    total: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    method: z
      .string({ invalid_type_error: 'Please select a valid value' })
      .min(1, 'Please enter a value'),
    reference: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value')
      .nullish(),
    depositDate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    goodThroughDate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value')
      .nullish(),
    nonRefundable: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    note: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    receiptFile: z.instanceof(File, { message: 'Please enter a valid file' }).nullish(),
  });

  const validatedData = depositSchema.safeParse({
    interestedVehicle: formData.get('interestedVehicle'),
    amount: formData.get('amount'),
    proFee: formData.get('proFee'),
    total: formData.get('total'),
    method: formData.get('method'),
    reference: formData.get('reference'),
    depositDate: formData.get('depositDate'),
    goodThroughDate: formData.get('goodThroughDate'),
    nonRefundable: formData.get('nonRefundable'),
    note: formData.get('note'),
    receiptFile: formData.get('receiptFile'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const {
    interestedVehicle,
    amount,
    proFee,
    total,
    method,
    reference,
    depositDate,
    goodThroughDate,
    nonRefundable,
    note,
    receiptFile,
  } = validatedData.data;

  let noteId;

  try {
    const scannedDepositUrl = receiptFile ? await uploadDepositScanned(receiptFile) : null;

    if (note && userId) {
      const newNote = await prisma.notes.create({
        data: {
          note: note,
          created_at: new Date(),
          client_id: clientId,
          created_by_id: userId,
          from_id: 5,
        },
      });

      noteId = newNote.id;

      await prisma.client_has_lead.create({
        data: {
          created_at: new Date(),
          client_id: clientId,
          status_id: 2,
          created_by_id: userId,
          lead_id: 20, // Deposit
          note_id: noteId,
        },
      });
    } else {
      noteId = undefined;
    }

    const data = await prisma.deposits.create({
      data: {
        amount: amount,
        deposit_date: new Date(depositDate),
        good_through_date: goodThroughDate ? new Date(goodThroughDate) : null,
        processing_fee: proFee,
        reference: reference ? reference : null,
        total: total,
        client_id: clientId,
        vehicle_id: interestedVehicle ? parseInt(interestedVehicle) : null,
        method_id: parseInt(method),
        non_refundable: nonRefundable ? true : false,
        note_id: noteId,
        scanned_deposit_url: scannedDepositUrl,
      },
      select: {
        id: true,
        client: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            seller_id: true,
          },
        },
      },
    });

    let leadToUpdate;
    if (currentLeadId) {
      leadToUpdate = await prisma.leads.findUnique({
        where: {
          id: Number(currentLeadId),
        },
      });
    } else {
      leadToUpdate = await prisma.leads.findFirst({
        where: {
          customer_id: clientId,
          is_active: true,
        },
      });
    }

    if (leadToUpdate && data) {
      if (interestedVehicle) {
        const newVehicleIdParsed = parseInt(interestedVehicle);
        const oldVehicleId = leadToUpdate.vehicle_id;

        if (leadToUpdate.customer_status_id === 10) {
          if (oldVehicleId && oldVehicleId !== newVehicleIdParsed) {
            await prisma.vehicles.update({
              where: { id: oldVehicleId },
              data: { vehicle_status_id: 1 },
            });
          }

          await prisma.vehicles.update({
            where: { id: newVehicleIdParsed },
            data: { vehicle_status_id: 3 },
          });
        }
      }

      await prisma.clients.update({
        where: {
          id: clientId,
        },
        data: {
          client_status_id: 9,
          client_status_changed_at: new Date().toISOString(),
          intereseted_vehicle_id: interestedVehicle ? parseInt(interestedVehicle) : undefined,
        },
      });

      await prisma.leads.update({
        where: { id: leadToUpdate.id },
        data: {
          deposit_id: {
            push: data.id,
          },
          vehicle_id: interestedVehicle ? parseInt(interestedVehicle) : undefined,
          customer_status_id: CustomersStatuses.Deposit,
        },
      });
    }

    const message = `Customer ${data.client.first_name} ${data.client.last_name} has made a deposit`;

    await createNotification({
      message: message,
      notificationType: {
        general: true,
      },
      assignedToId: data.client.seller_id,
      customerId: data.client.id,
      eventTypeId: 10,
    });

    const description = 'Deposit made';

    await createEvent(description, userId, clientId);

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Desposit Added Successfully' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await prisma.deposits.findUnique({
      where: {
        id: parseInt(params.id),
      },
      include: {
        client: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            name_lastname: true,
            lead: {
              where: {
                is_active: true,
              },
              include: {
                vehicle: {
                  include: {
                    vehicle_brands: true,
                    vehicle_models: true,
                    vehicle_identification_numbers: true,
                  },
                },
              },
            },
          },
        },
        method: {
          select: {
            id: true,
            method: true,
          },
        },
        note: true,
      },
    });

    const result = {
      ...(data as any),
      // vehicle: (data as any)?.client?.lead?.[0]?.vehicle || null,
      // vehicle_id: (data as any)?.client?.lead?.[0]?.vehicle?.id || null,
    };

    return NextResponse.json({ data: result });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const formData = await request.formData();

  const depositId = parseInt(params.id);

  const session = await auth();
  const userId = session?.user.id;

  const depositSchema = z.object({
    interestedVehicle: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    amount: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    proFee: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    total: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    method: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please select a valid value'),
    reference: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value')
      .nullish(),
    depositDate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    goodThroughDate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value')
      .nullish(),
    nonRefundable: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    note: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    receiptFile: z.instanceof(File, { message: 'Please enter a valid file' }).nullish(),
    isFileRemoved: z.string().nullish(),
  });

  const validatedData = depositSchema.safeParse({
    interestedVehicle: formData.get('interestedVehicle'),
    amount: formData.get('amount'),
    proFee: formData.get('proFee'),
    total: formData.get('total'),
    method: formData.get('method'),
    reference: formData.get('reference'),
    depositDate: formData.get('depositDate'),
    goodThroughDate: formData.get('goodThroughDate'),
    nonRefundable: formData.get('nonRefundable'),
    note: formData.get('note'),
    receiptFile: formData.get('receiptFile'),
    isFileRemoved: formData.get('isFileRemoved'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const {
    interestedVehicle,
    amount,
    proFee,
    total,
    method,
    reference,
    depositDate,
    goodThroughDate,
    nonRefundable,
    note,
    receiptFile,
    isFileRemoved,
  } = validatedData.data;

  let noteId;
  try {
    const scannedDepositUrl = receiptFile ? await uploadDepositScanned(receiptFile) : undefined;

    const updatedDeposit = await prisma.deposits.update({
      where: {
        id: depositId,
      },
      data: {
        amount: amount,
        deposit_date: new Date(depositDate),
        good_through_date: goodThroughDate ? new Date(goodThroughDate) : undefined,
        processing_fee: proFee,
        reference: reference ? reference : undefined,
        total: total,
        vehicle_id: interestedVehicle ? parseInt(interestedVehicle) : null,
        method_id: parseInt(method),
        non_refundable: nonRefundable ? true : false,
        scanned_deposit_url: isFileRemoved ? null : scannedDepositUrl,
      },
    });

    const activeLead = await prisma.leads.findFirst({
      where: {
        customer_id: updatedDeposit.client_id,
        is_active: true,
      },
    }); 

    if (activeLead && interestedVehicle) {
      const newVehicleIdParsed = parseInt(interestedVehicle);
      const oldVehicleId = activeLead.vehicle_id;

      if (activeLead.customer_status_id === CustomersStatuses.Sold) {
        if (oldVehicleId && oldVehicleId !== newVehicleIdParsed) {
          await prisma.vehicles.update({
            where: { id: oldVehicleId },
            data: { vehicle_status_id: 1 },
          });
        }

        await prisma.vehicles.update({
          where: { id: newVehicleIdParsed },
          data: { vehicle_status_id: 3 },
        });
      }
      await prisma.clients.update({
        where: {
          id: updatedDeposit.client_id,
        },
        data: {
          intereseted_vehicle_id: newVehicleIdParsed,
        },
      });
      await prisma.leads.update({
        where: {
          id: activeLead.id,
        },
        data: {
          vehicle_id: newVehicleIdParsed,
        },
      });
    }

    // Update the note if it exists
    if (note && updatedDeposit.note_id) {
      await prisma.notes.update({
        where: {
          id: updatedDeposit.note_id,
        },
        data: {
          note: note,
        },
      });
    }
    //create a new note if it doesn't exist
    if (!updatedDeposit.note_id && note && userId) {
      const newNote = await prisma.notes.create({
        data: {
          note: note,
          created_at: new Date(),
          client_id: updatedDeposit.client_id,
          created_by_id: userId,
          deposit: {
            connect: {
              id: updatedDeposit.id,
            },
          },
        },
      });

      await prisma.client_has_lead.create({
        data: {
          created_at: new Date(),
          client_id: updatedDeposit.client_id,
          status_id: 2,
          created_by_id: userId,
          lead_id: 20, // Deposit
          note_id: newNote.id,
        },
      });
    }

    //await prisma.$disconnect();

    return NextResponse.json({
      successMessage: 'Desposit Updated Successfully',
      data: { scanned_deposit_url: updatedDeposit.scanned_deposit_url },
    });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
