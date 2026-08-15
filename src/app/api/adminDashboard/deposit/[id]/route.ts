import { z } from 'zod';
import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createNotification } from '@/app/libs/notifications/notifications';
import { uploadDepositScanned } from '@/app/libs/uploadImages.services';
import { createEvent } from '@/app/libs/events/events';
import { checkPermissions } from '@/app/libs/auth-helpers';
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
      const newNote = mockDb.notes.create({
        data: {
          note: note,
          created_at: new Date(),
          client_id: clientId,
          created_by_id: userId,
          from_id: 5,
        },
      });

      noteId = newNote.id;

      mockDb.client_has_lead.create({
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

    const data = mockDb.deposits.create({
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
    });

    const clientRecord = mockDb.clients.findUnique({
      where: {
        id: clientId,
      },
    });

    const dataWithClient = {
      ...data,
      client: clientRecord
        ? {
            id: clientRecord.id,
            first_name: clientRecord.first_name,
            last_name: clientRecord.last_name,
            seller_id: clientRecord.seller_id,
          }
        : null,
    };

    let leadToUpdate;
    if (currentLeadId) {
      leadToUpdate = mockDb.leads.findUnique({
        where: {
          id: Number(currentLeadId),
        },
      });
    } else {
      leadToUpdate = mockDb.leads.findFirst({
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
            mockDb.vehicles.update({
              where: { id: oldVehicleId },
              data: { vehicle_status_id: 1 },
            });
          }

          mockDb.vehicles.update({
            where: { id: newVehicleIdParsed },
            data: { vehicle_status_id: 3 },
          });
        }
      }

      mockDb.clients.update({
        where: {
          id: clientId,
        },
        data: {
          client_status_id: 9,
          client_status_changed_at: new Date().toISOString(),
          intereseted_vehicle_id: interestedVehicle ? parseInt(interestedVehicle) : undefined,
        },
      });

      mockDb.leads.update({
        where: { id: leadToUpdate.id },
        data: {
          deposit_id: [
            ...(Array.isArray(leadToUpdate.deposit_id) ? leadToUpdate.deposit_id : []),
            data.id,
          ],
          vehicle_id: interestedVehicle ? parseInt(interestedVehicle) : undefined,
          customer_status_id: CustomersStatuses.Deposit,
        },
      });
    }

    const message = `Customer ${dataWithClient.client?.first_name} ${dataWithClient.client?.last_name} has made a deposit`;

    await createNotification({
      message: message,
      notificationType: {
        general: true,
      },
      assignedToId: dataWithClient.client?.seller_id,
      customerId: dataWithClient.client?.id,
      eventTypeId: 10,
    });

    const description = 'Deposit made';

    await createEvent(description, userId, clientId);

    return NextResponse.json({ successMessage: 'Desposit Added Successfully' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = mockDb.deposits.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });

    const client = data?.client_id
      ? mockDb.clients.findUnique({ where: { id: data.client_id } })
      : null;

    const method = data?.method_id
      ? mockDb.deposit_methods.findUnique({ where: { id: data.method_id } })
      : null;

    const note = data?.note_id ? mockDb.notes.findUnique({ where: { id: data.note_id } }) : null;

    const lead = client?.id
      ? mockDb.leads.findFirst({
          where: {
            customer_id: client.id,
            is_active: true,
          },
        })
      : null;

    const vehicle = lead?.vehicle_id
      ? mockDb.vehicles.findUnique({ where: { id: lead.vehicle_id } })
      : null;

    const result = {
      ...(data as any),
      client: client
        ? {
            id: client.id,
            first_name: client.first_name,
            last_name: client.last_name,
            name_lastname: client.name_lastname,
            lead: lead
              ? [
                  {
                    ...lead,
                    vehicle: vehicle
                      ? {
                          ...vehicle,
                          vehicle_brands: vehicle.vehicle_brands || null,
                          vehicle_models: vehicle.vehicle_models || null,
                          vehicle_identification_numbers:
                            vehicle.vehicle_identification_numbers || null,
                        }
                      : null,
                  },
                ]
              : [],
          }
        : null,
      method: method
        ? {
            id: method.id,
            method: method.method,
          }
        : null,
      note: note || null,
    };

    return NextResponse.json({ data: result });
  } catch (error) {
    console.log(error);

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

    const updatedDeposit = mockDb.deposits.update({
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

    const activeLead = mockDb.leads.findFirst({
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
          mockDb.vehicles.update({
            where: { id: oldVehicleId },
            data: { vehicle_status_id: 1 },
          });
        }

        mockDb.vehicles.update({
          where: { id: newVehicleIdParsed },
          data: { vehicle_status_id: 3 },
        });
      }
      mockDb.clients.update({
        where: {
          id: updatedDeposit.client_id,
        },
        data: {
          intereseted_vehicle_id: newVehicleIdParsed,
        },
      });
      mockDb.leads.update({
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
      mockDb.notes.update({
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
      const newNote = mockDb.notes.create({
        data: {
          note: note,
          created_at: new Date(),
          client_id: updatedDeposit.client_id,
          created_by_id: userId,
        },
      });

      mockDb.client_has_lead.create({
        data: {
          created_at: new Date(),
          client_id: updatedDeposit.client_id,
          status_id: 2,
          created_by_id: userId,
          lead_id: 20, // Deposit
          note_id: newNote.id,
        },
      });

      mockDb.deposits.update({
        where: {
          id: updatedDeposit.id,
        },
        data: {
          note_id: newNote.id,
        },
      });
    }

    return NextResponse.json({
      successMessage: 'Desposit Updated Successfully',
      data: { scanned_deposit_url: updatedDeposit.scanned_deposit_url },
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
