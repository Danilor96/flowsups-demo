import { mockDb } from '@/app/libs/mock-db';
import { z } from 'zod';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const dealId = parseInt(params.id);

  const formData = await request.formData();

  const dealSchema = z.object({
    // bonus: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    // paid: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    // downPayment: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    // lender: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    loanId: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    status: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    customerId: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    leadId: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });
  // .superRefine((data, ctx) => {
  //   const { bonus, downPayment, paid } = data;

  //   if (!bonus || !paid || !downPayment) {
  //     ctx.addIssue({
  //       message: 'Please enter Paid, Bonus and Downpayment',
  //       path: ['deal'],
  //       code: 'custom',
  //     });
  //   }

  //   const bonusNumber = Number(bonus);
  //   const paidNumber = Number(paid);
  //   const downPaymentNumber = Number(downPayment);

  //   if (bonusNumber + paidNumber !== downPaymentNumber) {
  //     ctx.addIssue({
  //       message: 'The sum of Paid + Bonus must be equal to Downpayment',
  //       path: ['deal'],
  //       code: 'custom',
  //     });
  //   }
  // });

  const validatedData = dealSchema.safeParse({
    // bonus: formData.get('bonus'),
    // paid: formData.get('paid'),
    // downPayment: formData.get('downPayment'),
    // lender: formData.get('lender'),
    loanId: formData.get('loanId'),
    status: formData.get('status'),
    customerId: formData.get('customerId'),
    leadId: formData.get('leadId'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { status, customerId, leadId, loanId } = validatedData.data;

  try {
    // let modifiedField = {};

    // const ignoreThisKeys = ['status', 'customerId'];

    // for (const [key, value] of Object.entries(validatedData.data)) {
    //   if (!ignoreThisKeys.includes(key) && value) {
    //     switch (key) {
    //       case 'loanId':
    //         modifiedField = { ...modifiedField, loan_id: value };
    //         break;

    //       case 'lender':
    //         modifiedField = { ...modifiedField, bank: value };
    //         break;

    //       case 'bonus':
    //         modifiedField = { ...modifiedField, bonus: value };
    //         break;

    //       case 'paid':
    //         modifiedField = { ...modifiedField, paid: value };
    //         break;

    //       case 'downPayment':
    //         modifiedField = { ...modifiedField, downpayment: value };
    //         break;
    //     }
    //   }
    // }

    const deal = mockDb.deal.update({
      where: {
        id: dealId,
      },
      data: {
        loan_id: loanId,
      },
      // data: modifiedField,
    });

    if (customerId && status) {
      const customer = mockDb.clients.update({
        where: {
          id: parseInt(customerId),
        },
        data: {
          funding_list_status_id: parseInt(status),
        },
      });

      mockDb.leads.update({
        where: {
          id: parseInt(leadId),
        },
        data: {
          customer_funding_list_status_id: parseInt(status),
        },
      });
    }

    return NextResponse.json({ successMessage: 'Data Successfully Updated' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
