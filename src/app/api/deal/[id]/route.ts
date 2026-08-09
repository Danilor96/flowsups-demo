import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/libs/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const customerId = parseInt(params.id);

  const searchParams = request.nextUrl.searchParams;

  const leadId = searchParams.get('leadId');

  try {
    const dealWithLeadWhereClause = leadId
      ? {
          id: Number(leadId),
        }
      : {
          is_active: true,
        };

    const data = await prisma.deal.findFirst({
      where: {
        customer_id: customerId,
        lead: dealWithLeadWhereClause,
      },
      include: {
        paymentDate: {
          include: {
            amountPerDate: true,
          },
        },
        bank: true,
      },
    });

    const leadWhereClause = leadId
      ? {
          id: Number(leadId),
        }
      : {
          customer_id: customerId,
          is_active: true,
        };

    const leadActive = await prisma.leads.findFirst({
      where: leadWhereClause,
      select: {
        id: true,
        sold_created_at: true,
      },
    });

    //await prisma.$disconnect();

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json({ deal: data, dealLeadActive: leadActive });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions([73, 57]);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const formData = await request.formData();

  const dealId = parseInt(params.id);

  const dealSchema = z
    .object({
      downpayment: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      paid: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      bonus: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      moneyDuePaid: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      frontend: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      backend: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      totalProfit: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      deferredDownpayment: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      bankId: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      bankName: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      sellerCommission: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      bdcCommission: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      customerId: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      paymentDates: z
        .array(
          z.object({
            dateId: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
            amountId: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
            date: z
              .string({ invalid_type_error: 'Please enter a valid value' })
              .min(1, 'Please enter a value in amount and date fields for all payment date forms'),
            amount: z
              .string({ invalid_type_error: 'Please enter a valid value' })
              .min(1, 'Please enter a value in amount and date fields for all payment date forms'),
            paid: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
          }),
        )
        .nullable(),
      soldDateInput: z.string({ invalid_type_error: 'Please enter a valid value' }),
      deletedPaymentDatesIds: z
        .array(z.string({ invalid_type_error: 'Please enter a valid value' }))
        .nullable(),
    })
    .superRefine((data, ctx) => {
      const { deferredDownpayment, paymentDates } = data;

      // payment validation

      const totalToPay = parseFloat(deferredDownpayment);

      if (totalToPay < 0) {
        ctx.addIssue({
          path: ['deferredDownpayment'],
          message: 'Deferred Downpayment must be positive or $0',
          code: 'custom',
        });
      }

      if (totalToPay > 0) {
        if (!paymentDates) {
          ctx.addIssue({
            path: ['paymentDates'],
            message: 'Deferred > $0: Set payment date',
            code: 'custom',
          });

          return;
        }

        let totalPaymentDatesAmount = 0;

        paymentDates.forEach((el) => {
          const amountInNumber = Number(el.amount);

          if (el.paid) return;

          totalPaymentDatesAmount += amountInNumber;
        });

        const amountIsEqualToDefferedDownpayment = totalPaymentDatesAmount === totalToPay;

        if (!amountIsEqualToDefferedDownpayment) {
          ctx.addIssue({
            path: ['paymentDates'],
            message: `The total amount between all dates forms must be equal to $${deferredDownpayment.replace(
              /\B(?=(\d{3})+(?!\d))/g,
              ',',
            )}`,
            code: 'custom',
          });
        }
      }
    });

  const array = formData.get('paymentDates');
  const deletedPaymentDateIdsArray = formData.get('deletedPaymentDatesIds');

  const validatedData = dealSchema.safeParse({
    downpayment: formData.get('downpayment'),
    paid: formData.get('paid'),
    bonus: formData.get('bonus'),
    moneyDuePaid: formData.get('moneyDuePaid'),
    frontend: formData.get('frontend'),
    backend: formData.get('backend'),
    totalProfit: formData.get('totalProfit'),
    deferredDownpayment: formData.get('deferredDownpayment'),
    bankId: formData.get('bankId'),
    bankName: formData.get('bankName'),
    sellerCommission: formData.get('sellerCommission'),
    bdcCommission: formData.get('bdcCommission'),
    customerId: formData.get('customerId'),
    paymentDates: array && typeof array === 'string' && JSON.parse(array),
    soldDateInput: formData.get('soldDateInput'),
    deletedPaymentDatesIds:
      deletedPaymentDateIdsArray &&
      typeof deletedPaymentDateIdsArray === 'string' &&
      JSON.parse(deletedPaymentDateIdsArray),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const {
    downpayment,
    paid,
    bonus,
    moneyDuePaid,
    frontend,
    backend,
    totalProfit,
    deferredDownpayment,
    paymentDates,
    bankId,
    bankName,
    sellerCommission,
    bdcCommission,
    customerId,
    deletedPaymentDatesIds,
    soldDateInput,
  } = validatedData.data;

  try {
    let bankDataId: number | null = null;

    if (bankId) {
      bankDataId = parseInt(bankId);
    }

    if (!bankId && bankName) {
      const bankData = await prisma.banks.create({
        data: {
          bank: bankName,
        },
      });

      bankDataId = bankData.id;
    }

    const data = await prisma.deal.update({
      where: {
        id: dealId,
      },
      data: {
        downpayment: downpayment,
        paid: paid,
        bonus: bonus,
        moneyDuePaid: moneyDuePaid,
        frontend: frontend,
        backend: backend,
        totalProfit: totalProfit,
        deferredDownpayment: deferredDownpayment,
        bank_id: bankDataId,
        sellerCommission: sellerCommission,
        bdcCommission: bdcCommission,
        customer_id: parseInt(customerId),
      },
    });

    if (data.lead_id) {
      await prisma.leads.update({
        where: {
          id: data.lead_id,
        },
        data: {
          sold_created_at: new Date(soldDateInput).toISOString(),
        },
      });
    }

    if (deletedPaymentDatesIds && deletedPaymentDatesIds.length > 0) {
      const idsToNumber = deletedPaymentDatesIds.map((el) => Number(el));

      await prisma.paymentDate.deleteMany({
        where: {
          id: {
            in: idsToNumber,
          },
        },
      });
    }

    if (paymentDates) {
      for (const form of paymentDates) {
        if (form.dateId) {
          const paymentDate = await prisma.paymentDate.update({
            where: {
              id: parseInt(form.dateId),
            },
            data: {
              date: new Date(form.date).toISOString(),
            },
          });
        } else {
          const paymentDate = await prisma.paymentDate.create({
            data: {
              date: new Date(form.date).toISOString(),
              dealId: data.id,
            },
          });

          const amountPerDate = await prisma.amountPerDate.create({
            data: {
              amount: form.amount,
              paid: form.paid ? (form.paid === '1' ? true : false) : false,
              paymentDateId: paymentDate.id,
            },
          });
        }

        if (form.amountId) {
          const amountPerDate = await prisma.amountPerDate.update({
            where: {
              id: parseInt(form.amountId),
            },
            data: {
              amount: form.amount,
              paid: form.paid ? (form.paid === '1' ? true : false) : false,
            },
          });
        }
      }
    } else {
      await prisma.paymentDate.deleteMany({
        where: {
          dealId: dealId,
        },
      });
    }

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Data Successfully Updated', data: customerId });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
