import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prisma';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const dealId = parseInt(params.id);
  const body = await request.json();

  const vehicleSchema = z.object({
    receiptNumber: z.string().min(1, 'Receipt number is required'),
    amount: z.string().min(1, 'Amount is required'),
    newPaymentDate: z.string().nullish(),
  });
  console.log({ body });


  const validatedData = vehicleSchema.safeParse(body);

  if (!validatedData.success) {
    const fieldErrors = validatedData.error.flatten().fieldErrors;
    const selectedPaymentDateIdError = !body.selectedPaymentDateId ? 'Select a payment date or add a new one' : undefined;
    const newPaymentDateError = body.selectedPaymentDateId === 'new' && !body.newPaymentDate ? 'Payment date is required' : undefined;
    return NextResponse.json(
      {
        fieldErrors: {
          ...fieldErrors,
          selectedPaymentDateId: selectedPaymentDateIdError ? [selectedPaymentDateIdError] : undefined,
          newPaymentDate: newPaymentDateError ? [newPaymentDateError] : undefined,
        },
      },
      { status: 422 },
    );
  }

  const { receiptNumber, amount, newPaymentDate } = validatedData.data;
  const selectedPaymentDateId : 'new' | number | null = body.selectedPaymentDateId ;

  if(selectedPaymentDateId === 'new' && !newPaymentDate){
    return NextResponse.json({ fieldErrors: { newPaymentDate: ['Payment date is required'] } }, { status: 422 });
  }
  
  if(!selectedPaymentDateId && !newPaymentDate){
    return NextResponse.json({ fieldErrors: { selectedPaymentDateId: ['Select a payment date or add a new one'] } }, { status: 422 });
  }

  const regexDecimal = /^-?\d+(\.\d+)?$/;
  const amountValid = amount.replaceAll(',', '')
  if(!regexDecimal.test(amountValid)) {
    return NextResponse.json({ fieldErrors: { amount: ['Invalid amount'] } }, { status: 422 });
  }

  let paymentDateId: number | null = null;

  try {
    // throw new Error('Error creating receipt');
    // Handle new payment date creation
    if (selectedPaymentDateId === 'new' && newPaymentDate) {
      const newPayment = await prisma.paymentDate.create({
        data: {
          date: new Date(newPaymentDate).toISOString(),
          dealId: dealId,
          amountPerDate: {
            create: {
              amount: amountValid,
              paid: true, // Mark as paid since we are creating a receipt for it
            },
          },
        },
      });
      paymentDateId = newPayment.id;
    } else if (selectedPaymentDateId && selectedPaymentDateId !== 'new') {
      paymentDateId = selectedPaymentDateId;
      await prisma.amountPerDate.updateMany({
        where: {
          paymentDateId: paymentDateId,
        },
        data: {
          paid: true,
          amount: amountValid,
        },
      });
    }

    // Create the receipt
    const receipt = await prisma.dealReceipt.create({
      data: {
        receiptNumber,
        amount: amountValid,
        dealId: dealId,
        paymentDateId: paymentDateId,
      },
    });

    // update deferred downpayment
    await prisma.deal.update({
      where: {
        id: dealId,
      },
      data: {
        deferredDownpayment: {
          decrement: receipt.amount,
        },
        moneyDuePaid: {
          increment: receipt.amount,
        },
      },
    });

    return NextResponse.json({ receipt, successMessage: 'Receipt created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating receipt:', error);
    return NextResponse.json({ serverError: 'Failed to create receipt' }, { status: 500 });
  }
}
