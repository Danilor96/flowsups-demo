import { z } from "zod";
import { NextResponse } from "next/server";
import { checkPermissions } from "@/app/libs/auth-helpers";
import { mockDb } from "@/app/libs/mock-db";

export async function POST(request: Request) {
  const permissionsCheck = await checkPermissions([73, 57]);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const urlRequest = new URL(request.url);

  const searchParams = urlRequest.searchParams;

  const currentLeadId = searchParams.get("leadId");

  const formData = await request.formData();

  const dealSchema = z
    .object({
      downpayment: z
        .string({ invalid_type_error: "Please enter a valid value" })
        .min(1, "Please enter a value"),
      paid: z
        .string({ invalid_type_error: "Please enter a valid value" })
        .min(1, "Please enter a value"),
      bonus: z
        .string({ invalid_type_error: "Please enter a valid value" })
        .min(1, "Please enter a value"),
      moneyDuePaid: z
        .string({ invalid_type_error: "Please enter a valid value" })
        .min(1, "Please enter a value"),
      frontend: z
        .string({ invalid_type_error: "Please enter a valid value" })
        .min(1, "Please enter a value"),
      backend: z
        .string({ invalid_type_error: "Please enter a valid value" })
        .min(1, "Please enter a value"),
      totalProfit: z
        .string({ invalid_type_error: "Please enter a valid value" })
        .min(1, "Please enter a value"),
      deferredDownpayment: z
        .string({ invalid_type_error: "Please enter a valid value" })
        .min(1, "Please enter a value"),
      bankId: z
        .string({ invalid_type_error: "Please enter a valid value" })
        .nullable(),
      bankName: z
        .string({ invalid_type_error: "Please enter a valid value" })
        .nullable(),
      sellerCommission: z
        .string({ invalid_type_error: "Please enter a valid value" })
        .min(1, "Please enter a value"),
      bdcCommission: z
        .string({ invalid_type_error: "Please enter a valid value" })
        .min(1, "Please enter a value"),
      customerId: z
        .string({ invalid_type_error: "Please enter a valid value" })
        .min(1, "Please enter a value"),
      soldDateInput: z.string({
        invalid_type_error: "Please enter a valid value",
      }),
      paymentDates: z
        .array(
          z.object({
            date: z
              .string({ invalid_type_error: "Please enter a valid value" })
              .min(
                1,
                "Please enter a value in amount and date fields for all payment date forms",
              ),
            amount: z
              .string({ invalid_type_error: "Please enter a valid value" })
              .min(
                1,
                "Please enter a value in amount and date fields for all payment date forms",
              ),
            paid: z
              .string({ invalid_type_error: "Please enter a valid value" })
              .nullable(),
          }),
        )
        .nullable(),
    })
    .superRefine((data, ctx) => {
      const { deferredDownpayment, paymentDates, downpayment } = data;

      // payment validation

      const totalToPay = Number(deferredDownpayment);

      if (totalToPay < 0) {
        ctx.addIssue({
          path: ["deferredDownpayment"],
          message: "Deferred Downpayment must be positive or $0",
          code: "custom",
        });
      }

      if (totalToPay > 0) {
        if (!paymentDates) {
          ctx.addIssue({
            path: ["paymentDates"],
            message: "Deferred > $0: Set payment date",
            code: "custom",
          });

          return;
        }

        let totalPaymentDatesAmount = 0;

        paymentDates.forEach((el) => {
          const amountInNumber = Number(el.amount);

          if (el.paid) return;

          totalPaymentDatesAmount += amountInNumber;
        });

        const amountIsEqualToDefferedDownpayment =
          totalPaymentDatesAmount === totalToPay;

        if (!amountIsEqualToDefferedDownpayment) {
          ctx.addIssue({
            path: ["paymentDates"],
            message: `The total amount between all dates forms must be equal to $${deferredDownpayment.replace(
              /\B(?=(\d{3})+(?!\d))/g,
              ",",
            )}`,
            code: "custom",
          });
        }
      }

      // downpayment validation

      // if (downpayment === '0') {
      //   ctx.addIssue({
      //     path: ['downpayment'],
      //     message: 'Please enter a value',
      //     code: 'custom',
      //   });
      // }
    });

  const array = formData.get("paymentDates");

  const validatedData = dealSchema.safeParse({
    downpayment: formData.get("downpayment"),
    paid: formData.get("paid"),
    bonus: formData.get("bonus"),
    moneyDuePaid: formData.get("moneyDuePaid"),
    frontend: formData.get("frontend"),
    backend: formData.get("backend"),
    totalProfit: formData.get("totalProfit"),
    deferredDownpayment: formData.get("deferredDownpayment"),
    bankId: formData.get("bankId"),
    bankName: formData.get("bankName"),
    sellerCommission: formData.get("sellerCommission"),
    bdcCommission: formData.get("bdcCommission"),
    customerId: formData.get("customerId"),
    soldDateInput: formData.get("soldDateInput"),
    paymentDates: array && typeof array === "string" && JSON.parse(array),
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
    soldDateInput,
  } = validatedData.data;

  try {
    const customer = mockDb.clients.findUnique({
      where: {
        id: parseInt(customerId),
      },
    });

    if (!customer) {
      throw new Error("Customer not found");
    }

    let bankDataId: number | null = null;

    if (bankId) {
      bankDataId = parseInt(bankId);
    }

    if (!bankId && bankName) {
      const bankData = mockDb.banks.create({
        data: {
          bank: bankName,
        },
      });

      bankDataId = bankData.id;
    }

    const deal = mockDb.deal.create({
      data: {
        downpayment,
        paid,
        bonus,
        moneyDuePaid,
        frontend,
        backend,
        totalProfit,
        deferredDownpayment,
        bank_id: bankDataId,
        sellerCommission,
        bdcCommission,
        customer_id: parseInt(customerId),
        seller_id: customer.seller_id,
        lead_id: null,
        paymentDate: [],
      },
    });

    if (paymentDates && paymentDates.length > 0) {
      for (const form of paymentDates) {
        const paymentDate = mockDb.paymentDate.create({
          data: {
            dealId: deal.id,
            date: new Date(form.date).toISOString(),
            amountPerDate: [],
          },
        });

        const amountPerDate = mockDb.amountPerDate.create({
          data: {
            amount: form.amount,
            paid: form.paid ? form.paid === "1" : false,
            paymentDateId: paymentDate.id,
          },
        });

        paymentDate.amountPerDate = [amountPerDate];
        deal.paymentDate = [...(deal.paymentDate ?? []), paymentDate];
      }
    }

    let leadId: number | undefined;

    if (currentLeadId) {
      leadId = Number(currentLeadId);
    } else {
      const activeLead = mockDb.leads.findFirst({
        where: {
          customer_id: customer.id,
          is_selected: true,
          is_active: true,
        },
      });

      leadId = activeLead?.id;
    }

    if (leadId) {
      mockDb.leads.update({
        where: { id: leadId },
        data: {
          sold_created_at: new Date(soldDateInput),
        },
      });

      mockDb.deal.update({
        where: { id: deal.id },
        data: { lead_id: leadId },
      });
    }

    const data = mockDb.deal.findUnique({ where: { id: deal.id } });

    return NextResponse.json({
      successMessage: "Deal Successfully Registered",
      data,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: "Server Error" }, { status: 500 });
  }
}
