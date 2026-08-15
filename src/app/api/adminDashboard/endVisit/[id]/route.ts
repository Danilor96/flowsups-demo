import { checkPermissions } from '@/app/libs/auth-helpers';
import {
  CustomersStatuses,
  filterNumber,
  FundingStatuses,
} from '@/app/libs/customer/customersFunctions';
import {
  checkDuplicateCustomerValues,
  doesTheStateExist,
  handleNameAndLastnameChange,
} from '@/app/libs/duplicateValues/duplicateValues';
import { createEvent } from '@/app/libs/events/events';
import { createNotification } from '@/app/libs/notifications/notifications';
import { mockDb } from '@/app/libs/mock-db';
import {
  ActivityType,
  sellerActivityEventEmitterAsync,
} from '@/app/libs/services/salesPointsService';
import { LeadHistoryCategoriesEnum } from '@/app/ui/dashboard/clientSystem/clientDetail/leadHistory/categoriesIdMap';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

enum AvailableChangesStatuses {
  Delivery = '4',
  ShowUp = '7',
  Deposit = '9',
  Sold = '10',
}

interface Result {
  assignedManager: string;
  location: string | null;
  decision: string;
  appointmentId: string;
  prospect: string;
  address: string;
  email: string;
  home: string | null;
  work: string | null;
  cell: string;
  vehicleId: string;
  managerTurnoverYes?: string | undefined;
  managerTurnoverNo?: string | undefined;
  note: string;
  deliveryStartDate: string | null;
  sellerIds: string;
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions([8]);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const customerId = parseInt(params.id);

  const formData = await request.formData();

  const session = await auth();

  const userId = session?.user.id;

  let stateData: { exists: boolean; stateId: number | null } = {
    exists: false,
    stateId: null,
  };

  const endVisitSchema = z
    .object({
      managerTurnoverYes: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
      managerTurnoverNo: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
      note: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please write a comment'),
      assignedManager: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      location: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      decision: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      appointmentId: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      prospect: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      address: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      email: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .email()
        .min(1, 'Please enter a value'),
      home: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      work: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      cell: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      vehicleId: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      deliveryStartDate: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      sellerIds: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Seller is required'),
    })
    .superRefine(async (data, ctx) => {
      const {
        email,
        managerTurnoverNo,
        managerTurnoverYes,
        assignedManager,
        cell,
        address,
        work,
        home,
        decision,
        deliveryStartDate,
      } = data;

      // delivery date validation

      if (decision === AvailableChangesStatuses.Delivery && !deliveryStartDate) {
        ctx.addIssue({
          path: ['deliveryError'],
          message: 'Date require',
          code: 'custom',
        });
      }

      // email validation

      const existsEmail = await checkDuplicateCustomerValues('', email, customerId);
      if (existsEmail.email) {
        ctx.addIssue({
          path: ['email'],
          message: 'Email already exists',
          code: 'custom',
        });
      }

      // mobile phone validation

      const existsMobile = await checkDuplicateCustomerValues(cell, '', customerId);
      if (existsMobile.mobilePhone) {
        ctx.addIssue({
          path: ['cell'],
          message: 'Cell already exists',
          code: 'custom',
        });
      }

      if (cell && cell.length < 10) {
        ctx.addIssue({
          path: ['cell'],
          message: 'Invalid number format',
          code: 'custom',
        });
      }

      if (home && home.length < 10) {
        ctx.addIssue({
          path: ['home'],
          message: 'Invalid number format',
          code: 'custom',
        });
      }

      if (work && work.length < 10) {
        ctx.addIssue({
          path: ['work'],
          message: 'Invalid number format',
          code: 'custom',
        });
      }

      // manager turnover validation

      if (!managerTurnoverNo && !managerTurnoverYes) {
        ctx.addIssue({
          path: ['managerTurnoverYes'],
          message: 'Please enter a value',
          code: 'custom',
        });
      }

      // assigned manager validation

      if (assignedManager === '0') {
        ctx.addIssue({
          path: ['assignedManager'],
          message: 'Please enter a value',
          code: 'custom',
        });
      }

      // address validation

      const [street, city, state, zip, county] = address.split(',');

      if (!street || !city || !state) {
        ctx.addIssue({
          path: ['address'],
          message: 'Invalid address',
          code: 'custom',
        });
      }

      stateData = await doesTheStateExist(state);
      if (!stateData.exists) {
        ctx.addIssue({
          path: ['address'],
          message: 'Invalid state',
          code: 'custom',
        });
      }
    });

  const validatedData = async (data: any) => {
    try {
      const result = await endVisitSchema.parseAsync(data);

      return result;
    } catch (error) {
      return error;
    }
  };

  const data = {
    managerTurnoverYes: formData.get('managerTurnoverYes'),
    managerTurnoverNo: formData.get('managerTurnoverNo'),
    note: formData.get('note'),
    assignedManager: formData.get('assignedManager'),
    location: formData.get('location'),
    decision: formData.get('decision'),
    appointmentId: formData.get('appointmentId'),
    prospect: formData.get('prospect'),
    address: formData.get('address'),
    email: formData.get('email'),
    home: formData.get('home'),
    work: formData.get('work'),
    cell: formData.get('cell'),
    vehicleId: formData.get('vehicleId'),
    deliveryStartDate: formData.get('deliveryStartDate'),
    sellerIds: formData.get('sellerIds'),
  };

  const result = await validatedData(data);

  if (result instanceof z.ZodError) {
    return NextResponse.json({ fieldErrors: result.formErrors.fieldErrors }, { status: 422 });
  }

  const {
    managerTurnoverYes,
    managerTurnoverNo,
    note,
    assignedManager,
    location,
    decision,
    appointmentId,
    prospect,
    address,
    email,
    home,
    work,
    cell,
    vehicleId,
    deliveryStartDate,
    sellerIds,
  } = result as Result;

  const sellersArray = sellerIds.split(',').map((id) => parseInt(id));

  try {
    if (!userId) throw new Error('No user finded');

    const managerTrnOver = managerTurnoverYes ? true : managerTurnoverNo ? false : false;
    const isSoldStatus = decision === AvailableChangesStatuses.Sold;

    const clientData = mockDb.clients.update({
      where: {
        id: customerId,
      },
      data: {
        first_name: handleNameAndLastnameChange(prospect).firstname,
        last_name: handleNameAndLastnameChange(prospect).lastname,
        email: email,
        home_phone: filterNumber(home || '') || '',
        work_phone: filterNumber(work || '') || '',
        mobile_phone: filterNumber(cell),
        current_address: `${address},${stateData.stateId}`,
        client_status_id: parseInt(decision),
        client_status_changed_at: new Date(),
        funding_list_status_id: isSoldStatus ? FundingStatuses.InProcess : null,
        seller_id: sellersArray[0],
      },
    });

    if (stateData.stateId) {
      const [street, city, state, zip, county] = address.split(',');
      const clientAddress = clientData.client_address;
      if (clientAddress) {
        mockDb.client_address.update({
          where: {
            id: clientAddress.id,
          },
          data: {
            city: city,
            street: street,
            zip: zip,
            state_id: stateData.stateId,
            county_id: null,
          },
        });
      }
      if (!clientAddress) {
        const newClientAddress = mockDb.client_address.create({
          data: {
            city: city,
            street: street,
            zip: zip,
            state_id: stateData.stateId,
            county_id: null,
          },
        });
        mockDb.clients.update({
          where: {
            id: clientData.id,
          },
          data: {
            client_address_id: newClientAddress.id,
          },
        });
      }
    }

    if (isSoldStatus) {
      const lead = mockDb.leads.updateMany({
        where: {
          customer_id: customerId,
          is_active: true,
          has_ended: false,
        },
        data: {
          has_ended: true,
          end_at: new Date().toISOString(),
          customer_status_id: parseInt(decision),
          sold_created_at: new Date().toISOString(),
          customer_funding_list_status_id: isSoldStatus ? FundingStatuses.InProcess : null,
        },
      });

      const soldCustomer = mockDb.clients.update({
        where: {
          id: customerId,
        },
        data: {
          lead_temperature_id: null,
        },
      });

      const vehicle = mockDb.vehicles.update({
        where: {
          id: parseInt(vehicleId),
        },
        data: {
          vehicle_status_id: 3,
        },
      });

      const message = `The status of customer ${clientData.first_name} ${clientData.last_name} has change to Sold`;

      await createNotification({
        message: message,
        notificationType: {
          general: true,
        },
        assignedToId: clientData.seller_id,
        notificationsForManagers: true,
        eventTypeId: 7,
      });

      const description = 'Status changed to sold in the showroom';

      await createEvent(description, userId, customerId);

      if (userId) {
        await createLeadHistory({
          description,
          customerId,
          userId,
          categoryId: LeadHistoryCategoriesEnum.Sold,
        });
      }

      // logic for assigning points to sellers
      if (clientData && clientData.seller_id) {
        // event is sent to the socket server to run the seller activity counter in the background without adding latency to the current response.
        sellerActivityEventEmitterAsync({
          userId: clientData.seller_id,
          activityType: ActivityType.CUSTOMER_SOLD,
        });
      }
    }

    if (decision === AvailableChangesStatuses.Delivery && deliveryStartDate && userId) {
      const message = `There is a new delivery in charge of ${clientData.seller?.name} ${clientData.seller?.last_name} for customer ${clientData.first_name} ${clientData.last_name}`;

      await mockDb.vehicle_delivery.create({
        data: {
          customer_id: customerId,
          created_by: userId,
          assigned_to: parseInt(assignedManager),
          vehicle_id: parseInt(vehicleId),
          reminder_time: 0,
          start_date: new Date(deliveryStartDate).toISOString(),
        },
      });

      await createNotification({
        message: message,
        notificationType: {
          general: true,
        },
        assignedToId: clientData.seller_id,
        notificationsForManagers: true,
        eventTypeId: 24,
      });

      const description = 'Status changed to delivery in the showroom';

      await createEvent(description, userId, customerId);
      if (userId) {
        await createLeadHistory({
          description,
          customerId,
          userId,
          categoryId: LeadHistoryCategoriesEnum.AddNote,
        });
      }
    }

    const appointment = mockDb.appointments.update({
      where: {
        id: parseInt(appointmentId),
      },
      data: {
        status_id: 2,
      },
    });

    const noteData = mockDb.notes.create({
      data: {
        created_at: new Date(),
        note: note,
        client_id: customerId,
        created_by_id: userId,
      },
    });

    mockDb.client_has_lead.create({
      data: {
        created_at: new Date(),
        client_id: customerId,
        status_id: 1,
        created_by_id: userId,
        lead_id: 1,
        note_id: noteData.id,
      },
    });

    const dailyVisitData = mockDb.daily_visit_history.create({
      data: {
        assigned_manager_id: parseInt(assignedManager),
        customer_id: customerId,
        decision_id: parseInt(decision),
        lead_type_id: clientData.lead_type_id,
        sales_rep_id: parseInt(assignedManager),
        location: location,
        vehicle_id: parseInt(vehicleId),
        managerTurnover: managerTrnOver,
        note_id: noteData.id,
      },
    });

    const activeLead = mockDb.leads.findFirst({
      where: {
        customer_id: customerId,
        is_active: true,
      },
    });

    const isSoldDecision = Number(decision) === CustomersStatuses.Sold;

    if (activeLead && activeLead.id && data) {
      mockDb.leads.update({
        where: {
          id: activeLead.id,
          customer_id: customerId,
          is_active: true,
        },
        data: {
          customer_status_id: parseInt(decision),
          daily_visit_history: [
            ...(Array.isArray(activeLead.daily_visit_history) ? activeLead.daily_visit_history : []),
            dailyVisitData,
          ],
          sales_rep_id: sellersArray[0],
          isSplitSold: isSoldDecision && sellersArray.length > 1,
          sellersInSplitDeal:
            isSoldDecision && sellersArray.length > 1
              ? sellersArray.map((id) => ({ id: id }))
              : undefined,
        },
      });
    }

    if (decision !== '10' && decision !== '4' && userId) {
      const status: { [key: string]: string } = { '7': 'Show Up', '9': 'Deposit' };
      const description = `Status changed to ${status[decision]} in the showroom`;
      await createLeadHistory({
        description,
        customerId,
        userId,
        categoryId: LeadHistoryCategoriesEnum.AddNote,
      });
    }

    // logic for assigning points to sellers
    if (appointment && appointment.user_id) {
      // event is sent to the socket server to run the seller activity counter in the background without adding latency to the current response.
      sellerActivityEventEmitterAsync({
        userId: appointment.created_by,
        activityType: ActivityType.APPOINTMENT_COMPLETED,
      });
    }

    return NextResponse.json({ successMessage: 'Visit Successfully Ended' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

async function createLeadHistory({
  description,
  customerId,
  userId,
  categoryId,
}: {
  description: string;
  customerId: number;
  userId: number;
  categoryId: LeadHistoryCategoriesEnum;
}) {
  mockDb.notes.create({
    data: {
      created_at: new Date(),
      note: description,
      client_id: customerId,
      created_by_id: userId,
      client_lead_note: [
        {
          created_at: new Date(),
          client_id: customerId,
          status_id: 2,
          created_by_id: userId,
          lead_id: categoryId,
        },
      ],
    },
  });
}
