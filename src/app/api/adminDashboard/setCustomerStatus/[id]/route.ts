import prisma from '@/app/libs/prisma';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { createNotification } from '@/app/libs/notifications/notifications';
import { auth } from '@/auth';
import { createEvent } from '@/app/libs/events/events';
import { LeadHistoryCategoriesEnum as LeadCategoriesEnum } from '&/dashboard/clientSystem/clientDetail/leadHistory/categoriesIdMap';
import { checkPermissions } from '@/app/libs/auth-helpers';
import { CustomersStatuses, FundingStatuses } from '@/app/libs/customer/customersFunctions';
import { Permissions } from '@/app/libs/definitions/permissions/permissions';
import { Prisma } from '@prisma/client';
import { fromZonedTime, formatInTimeZone } from 'date-fns-tz';

interface Result {
  statusSelected: string;
  note: string | null;
  lostReasonDescription: string | null;
  lostReason: number | null;
  deliveryDate: string | null;
  managerId: string | null;
  sellerIds: string | null;
  vehicleId: string | null;
  soldDate: string | null;
  soldNote: string | null;
  timeZone: string | null;
  cobuyer: number | null;
  cobuyerRelationhip: number | null;
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions([79, Permissions.CustomerMarkAsSold]);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const urlRequest = new URL(request.url);

  const searchParams = urlRequest.searchParams;

  const currentLeadId = searchParams.get('leadId');

  const customerId = parseInt(params.id);

  const session = await auth();

  const user = session?.user;

  const formData = await request.formData();

  const customerStatusSchema = z
    .object({
      statusSelected: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      note: z.string({ invalid_type_error: 'Please enter a valid value' }).nullish(),
      lostReasonDescription: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .nullish(),
      lostReason: z.coerce.number().nullish(),
      deliveryDate: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      managerId: z.string({ invalid_type_error: 'Please enter a valid value' }).nullish(),
      sellerIds: z.string({ invalid_type_error: 'Please enter a valid value' }).nullish(),
      vehicleId: z.string({ invalid_type_error: 'Please enter a valid value' }).nullish(),
      soldDate: z.string({ invalid_type_error: 'Please enter a valid value' }).nullish(),
      soldNote: z.string({ invalid_type_error: 'Please enter a valid value' }).nullish(),
      timeZone: z.string({ invalid_type_error: 'Please enter a valid value' }).nullish(),
      cobuyer: z.coerce.number().nullish(),
      cobuyerRelationhip: z.coerce.number().nullish(),
    })
    .superRefine(async (data, ctx) => {
      const { statusSelected, deliveryDate } = data;

      if (parseInt(statusSelected) === CustomersStatuses.Delivery) {
        const activeLead = await prisma.leads.findFirst({
          where: {
            AND: {
              customer_id: customerId,
              is_selected: true,
            },
          },
          select: {
            vehicle_id: true,
            sales_rep_id: true,
          },
        });

        if (!deliveryDate) {
          ctx.addIssue({
            path: ['delivery'],
            message: 'Date require',
            code: 'custom',
          });
        }

        if (!activeLead?.sales_rep_id && !data.sellerIds) {
          ctx.addIssue({
            path: ['delivery'],
            message: 'User assigned require',
            code: 'custom',
          });
        }

        if (!activeLead?.vehicle_id && !data.vehicleId) {
          ctx.addIssue({
            path: ['delivery'],
            message: 'Vehicle require',
            code: 'custom',
          });
        }
      }

      if (parseInt(statusSelected) === CustomersStatuses.Sold) {
        // const activeLead = await prisma.leads.findFirst({
        //   where: {
        //     AND: {
        //       customer_id: customerId,
        //       is_active: true,
        //     },
        //   },
        //   select: {
        //     vehicle_id: true,
        //     sales_rep_id: true,
        //   },
        // });

        if (!data.vehicleId || !data.sellerIds || !data.soldDate) {
          ctx.addIssue({
            path: ['customerStatus'],
            message: 'Required fields: Vehicle, Sales Rep and Sold Date',
            code: 'custom',
          });
        }

        if (data.cobuyer && !data.cobuyerRelationhip) {
          ctx.addIssue({
            path: ['customerStatus'],
            message: 'Cobuyer relationship required',
            code: 'custom',
          });
        }
      }

      if (parseInt(statusSelected) === CustomersStatuses.Lost) {
        if (!data.lostReason) {
          ctx.addIssue({
            path: ['lostReason'],
            message: 'Lost reason require',
            code: 'custom',
          });
        }
      }
    });

  const validatedData = async (data: any) => {
    try {
      const result = await customerStatusSchema.parseAsync(data);

      return result;
    } catch (error) {
      return error;
    }
  };

  const data = {
    statusSelected: formData.get('statusSelected'),
    note: formData.get('note'),
    deliveryDate: formData.get('deliveryDate'),
    managerId: formData.get('managerId'),
    sellerIds: formData.get('sellerIds'),
    vehicleId: formData.get('vehicleId'),
    lostReason: formData.get('lostReason'),
    lostReasonDescription: formData.get('lostReasonDescription'),
    soldDate: formData.get('soldDate'),
    soldNote: formData.get('soldNote'),
    timeZone: formData.get('timeZone'),
    cobuyer: formData.get('cobuyer'),
    cobuyerRelationhip: formData.get('cobuyerRelationhip'),
  };

  const result = await validatedData(data);

  if (result instanceof z.ZodError) {
    return NextResponse.json({ fieldErrors: result.formErrors.fieldErrors }, { status: 422 });
  }

  const {
    statusSelected,
    note,
    deliveryDate,
    managerId,
    sellerIds,
    vehicleId,
    lostReason,
    lostReasonDescription,
    soldDate,
    soldNote,
    timeZone,
    cobuyer,
    cobuyerRelationhip,
  } = result as Result;

  // if (statusSelected === '12' && !note) {
  //   return NextResponse.json({ fieldErrors: { note: ['Note is required'] } }, { status: 422 });
  // }
  let creditAppAt: string | null | undefined =
    statusSelected === CustomersStatuses.CreditApp.toString()
      ? new Date().toISOString()
      : undefined;
  const statusForRemoveCreditApp = [
    CustomersStatuses.New,
    CustomersStatuses.Contacted,
    CustomersStatuses.Lost,
  ];
  if (statusForRemoveCreditApp.includes(parseInt(statusSelected))) {
    creditAppAt = null;
  }

  try {
    const prevCurrentClientData = await prisma.clients.findUnique({
      where: { id: customerId },
      select: {
        id: true,
        client_status_id: true,
        intereseted_vehicle_id: true,
        interested_vehicle: {
          select: {
            id: true,
            vehicle_status_id: true,
          },
        },
        client_status: true,
      },
    });

    // const prevStatus = await prisma.client_status.findFirst({
    //   where: {
    //     client_status: {
    //       some: {
    //         id: customerId,
    //       },
    //     },
    //   },
    //   select: {
    //     status: true,
    //   },
    // });

    const prevStatus = prevCurrentClientData?.client_status;
    const isSoldStatus = parseInt(statusSelected) === CustomersStatuses.Sold;
    const isFundedStatus = parseInt(statusSelected) === CustomersStatuses.Funded;

    const sellersIdsInSplit = sellerIds?.split(',').map((id) => parseInt(id)) || null;

    const data = await prisma.clients.update({
      where: {
        id: customerId,
      },
      data: {
        client_status_id:
          parseInt(statusSelected) === CustomersStatuses.Funded
            ? CustomersStatuses.Sold
            : parseInt(statusSelected),
        credit_app_list_status_id: statusSelected === '3' ? 1 : null,
        client_status_changed_at: new Date().toISOString(),
        funding_list_status_id: isSoldStatus
          ? FundingStatuses.InProcess
          : isFundedStatus
            ? FundingStatuses.Funded
            : null,
        sales_manager_id: isSoldStatus && managerId ? parseInt(managerId) : undefined,
        seller_id:
          (isSoldStatus || parseInt(statusSelected) === CustomersStatuses.Delivery) &&
          sellersIdsInSplit
            ? sellersIdsInSplit[0]
            : undefined,
        intereseted_vehicle_id:
          (isSoldStatus || parseInt(statusSelected) === CustomersStatuses.Delivery) && vehicleId
            ? parseInt(vehicleId)
            : undefined,
        lost_reason_id: parseInt(statusSelected) === CustomersStatuses.Lost ? lostReason : null,
        // cobuyer_client: {
        //   connect: {

        //   }
        // }
      },
      include: {
        client_status: true,
      },
    });

    let leadWhereClause: Prisma.LeadsWhereUniqueInput | null = null;
    let cobuyerRelationId: number | null = null;

    if (currentLeadId) {
      const currentLead = await prisma.leads.findUnique({
        where: {
          id: Number(currentLeadId),
        },
      });

      leadWhereClause = {
        id: Number(currentLeadId),
      };

      if (currentLead?.customer_cobuyer_id) {
        cobuyerRelationId = currentLead.customer_cobuyer_id;
      }
    } else {
      const activeLead = await prisma.leads.findFirst({
        where: {
          customer_id: customerId,
          is_selected: true,
          is_active: true,
        },
      });

      leadWhereClause = {
        id: activeLead?.id,
      };

      if (activeLead?.customer_cobuyer_id) {
        cobuyerRelationId = activeLead.customer_cobuyer_id;
      }
    }

    const prevActiveLeadData = await prisma.leads.findFirst({
      where: leadWhereClause,
      select: {
        id: true,
        customer_status: true,
        vehicle: {
          select: {
            id: true,
            vehicle_status_id: true,
          },
        },
      },
    });

    if (prevActiveLeadData && prevActiveLeadData.id) {
      await prisma.leads.update({
        where: {
          id: prevActiveLeadData.id,
        },
        data: {
          customer_status_id:
            parseInt(statusSelected) === CustomersStatuses.Funded
              ? CustomersStatuses.Sold
              : parseInt(statusSelected),
          has_ended: statusSelected === '10',
          sold_created_at:
            isSoldStatus && soldDate
              ? (() => {
                  const [month, day, year] = soldDate.split('/');
                  const datePart = `${year}-${month}-${day}`;
                  const timePart = formatInTimeZone(
                    new Date(),
                    timeZone || 'America/Chicago',
                    'HH:mm:ss.SSS',
                  );
                  return fromZonedTime(`${datePart} ${timePart}`, timeZone || 'America/Chicago');
                })()
              : isSoldStatus
                ? new Date().toISOString()
                : undefined,
          credit_app_created_at: creditAppAt,
          customer_credit_app_list_status_id:
            statusSelected === CustomersStatuses.CreditApp.toString() ? 1 : null,
          customer_funding_list_status_id: isSoldStatus
            ? FundingStatuses.InProcess
            : isFundedStatus
              ? FundingStatuses.Funded
              : null,
          funding_created_at: isFundedStatus ? new Date().toISOString() : null,
          sales_manager_id: isSoldStatus && managerId ? parseInt(managerId) : undefined,
          sales_rep_id:
            (isSoldStatus || parseInt(statusSelected) === CustomersStatuses.Delivery) &&
            sellersIdsInSplit
              ? sellersIdsInSplit[0]
              : undefined,
          vehicle_id:
            (isSoldStatus || parseInt(statusSelected) === CustomersStatuses.Delivery) && vehicleId
              ? parseInt(vehicleId)
              : undefined,
          isSplitSold:
            isSoldStatus && sellersIdsInSplit && sellersIdsInSplit.length > 1 ? true : false,
          sellersInSplitDeal:
            isSoldStatus && sellersIdsInSplit && sellersIdsInSplit.length > 1
              ? {
                  connect: sellersIdsInSplit.map((id) => ({ id: id })),
                }
              : undefined,
        },
      });
    }

    if (
      Number(statusSelected) === CustomersStatuses.Sold &&
      leadWhereClause &&
      leadWhereClause.id
    ) {
      await prisma.leads.update({
        where: leadWhereClause,
        data: {
          customer_cobuyer: {
            ...(cobuyerRelationId && cobuyer && cobuyerRelationhip
              ? {
                  update: {
                    where: {
                      id: cobuyerRelationId,
                    },
                    data: {
                      buyer_client_id: customerId,
                      cobuyer_client_id: cobuyer,
                      relationship_id: cobuyerRelationhip,
                    },
                  },
                }
              : cobuyer && cobuyerRelationhip
                ? {
                    create: {
                      buyer_client_id: customerId,
                      cobuyer_client_id: cobuyer,
                      relationship_id: cobuyerRelationhip,
                    },
                  }
                : undefined),
          },
        },
      });
    }

    if (isSoldStatus && vehicleId) {
      await prisma.vehicles.update({
        where: {
          id: parseInt(vehicleId),
        },
        data: {
          vehicle_status_id: 3,
        },
      });
    }

    const deliveryassignedTo = data.sales_manager_id || data.seller_id;

    if (
      parseInt(statusSelected) === CustomersStatuses.Delivery &&
      deliveryDate &&
      deliveryassignedTo &&
      data.intereseted_vehicle_id &&
      user?.id
    ) {
      const delivery = await prisma.vehicle_delivery.create({
        data: {
          reminder_time: 0,
          start_date: new Date(deliveryDate).toISOString(),
          assigned_to: deliveryassignedTo,
          customer_id: data.id,
          vehicle_id: data.intereseted_vehicle_id,
          created_by: user.id,
        },
      });
    }

    if (statusSelected === '10' && data.seller_id && data.intereseted_vehicle_id) {
      const dailyVisitData = await prisma.daily_visit_history.create({
        data: {
          assigned_manager_id: data.sales_manager_id,
          customer_id: customerId,
          decision_id: 10,
          lead_type_id: data.lead_type_id,
          sales_rep_id: data.seller_id,
          location: null,
          vehicle_id: data.intereseted_vehicle_id,
          managerTurnover: false,
        },
      });
    }

    // Create sold note + lead history
    if (isSoldStatus && user?.id) {
      await prisma.notes.create({
        data: {
          created_at: new Date().toISOString(),
          note: soldNote || 'Status changed to Sold',
          client_id: customerId,
          created_by_id: user.id,
          client_lead_note: {
            create: {
              created_at: new Date().toISOString(),
              client_id: customerId,
              status_id: 2,
              created_by_id: user.id,
              lead_id: LeadCategoriesEnum.Sold,
            },
          },
        },
      });
    }

    if (data.deleted) {
      if (statusSelected !== '12') {
        await prisma.clients.update({
          where: {
            id: customerId,
          },
          data: {
            deleted: false,
          },
        });
      }
    }

    const todaysDate = new Date();
    let noteId: number | null = null;
    if (statusSelected === '12' && lostReasonDescription) {
      // lost status
      const noteDb = await prisma.notes.create({
        data: {
          note: lostReasonDescription,
          created_at: todaysDate,
          created_by_id: user?.id || 0,
          client_id: customerId,
          from_id: 3,
        },
        select: {
          id: true,
        },
      });

      noteId = noteDb.id;
    }
    if (statusSelected === '12' && note) {
      // lost status
      const noteDb = await prisma.notes.create({
        data: {
          note: note,
          created_at: todaysDate,
          created_by_id: user?.id || 0,
          client_id: customerId,
          from_id: 3,
        },
        select: {
          id: true,
        },
      });

      noteId = noteDb.id;
    }

    // Release vehicle if customer was Sold and now is NOT Sold/Funded
    const prevCustomerLeadStatusAssigned =
      prevActiveLeadData?.customer_status?.id || prevCurrentClientData?.client_status_id;

    const prevVehicleId =
      prevActiveLeadData?.vehicle?.id || prevCurrentClientData?.interested_vehicle?.id;
    const prevCustomerLeadVehicleStatusAssigned =
      prevActiveLeadData?.vehicle?.vehicle_status_id ||
      prevCurrentClientData?.interested_vehicle?.vehicle_status_id;

    if (
      prevCustomerLeadStatusAssigned === CustomersStatuses.Sold &&
      !isSoldStatus &&
      !isFundedStatus
    ) {
      if (prevVehicleId && prevCustomerLeadVehicleStatusAssigned === 3) {
        // 3 = vehicle sold
        await prisma.vehicles.update({
          where: { id: prevVehicleId },
          data: { vehicle_status_id: 1 }, // In Stock
        });
      }
    }

    await prisma.client_has_lead.create({
      data: {
        created_at: todaysDate,
        client_id: customerId,
        status_id: 2,
        created_by_id: user?.id || 0,
        lead_id:
          statusSelected === '12' ? LeadCategoriesEnum.MarkAsLost : LeadCategoriesEnum.SetStatus,
        note_id: noteId || null,
      },
    });

    const statusName = data.client_status?.status || '';

    const byUserName = `${user?.name || ''} ${user?.last_name || ''}`;

    const description = `${byUserName} changed status from '${prevStatus?.status.toLocaleUpperCase()}' to '${statusName.toLocaleUpperCase()}' for customer ${
      data.first_name
    } ${data.last_name}`;
    //
    await createNotification({
      message: description,
      notificationType: {
        general: true,
      },
      customerId: customerId,
      notificationsForManagers: true,
      eventTypeId: 7,
    });

    if (user?.id) await createEvent(description, user.id, customerId, new Date());

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Status Successfully Changed' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
