import {
  extractAndValidateAddressInfo,
  returnAddressInfoForDatabase,
} from '@/app/libs/address/addressFunctions';
import { checkPermissions } from '@/app/libs/auth-helpers';
import { filterNumber, splitIncomingName } from '@/app/libs/customer/customersFunctions';
import { checkDuplicateCustomerValues } from '@/app/libs/duplicateValues/duplicateValues';
import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

interface Result {
  address: string;
  cell: string;
  home: string | null;
  work: string | null;
  prospect: string;
  email: string;
  assignedManager: string | null;
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions([8]);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const customerId = parseInt(params.id);

  const formData = await request.formData();

  const endVisitSchema = z
    .object({
      address: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      cell: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      home: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      work: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      prospect: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      email: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      assignedManager: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    })
    .superRefine(async (data, ctx) => {
      const { address, email, cell, home, work } = data;

      const { street, city, state, zip } = await extractAndValidateAddressInfo(address);

      if (!street || !city) {
        ctx.addIssue({
          path: ['address'],
          message: 'Invalid address format',
          code: 'custom',
        });
      } else if (!state) {
        ctx.addIssue({
          path: ['address'],
          message: 'Invalid state',
          code: 'custom',
        });
      } else if (!zip) {
        ctx.addIssue({
          path: ['address'],
          message: 'Invalid zip',
          code: 'custom',
        });
      }

      // email validation

      const emailAlreadyExists = await checkDuplicateCustomerValues('', email, customerId);
      if (emailAlreadyExists.email) {
        ctx.addIssue({
          path: ['email'],
          message: 'Email already exists',
          code: 'custom',
        });
      }

      // phone numbers validation

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
    address: formData.get('address'),
    cell: formData.get('cell'),
    home: formData.get('home'),
    work: formData.get('work'),
    prospect: formData.get('prospect'),
    email: formData.get('email'),
    assignedManager: formData.get('assignedManager'),
  };

  const result = await validatedData(data);

  if (result instanceof z.ZodError) {
    return NextResponse.json({ fieldErrors: result.formErrors.fieldErrors }, { status: 422 });
  }

  const { address, cell, home, work, prospect, email, assignedManager } = result as Result;

  try {
    const addressInfoForData = await returnAddressInfoForDatabase(address);

    if (assignedManager) {
      await prisma.users.update({
        where: {
          id: parseInt(assignedManager),
          deleted_at: null,
        },
        data: {
          client_sales_manager: {
            connect: {
              id: customerId,
            },
          },
        },
      });
    }

    const data = await prisma.clients.update({
      where: {
        id: customerId,
      },
      data: {
        client_address: {
          upsert: {
            create: {
              city: addressInfoForData.city,
              street: addressInfoForData.street,
              county_id: addressInfoForData.countyId,
              state_id: addressInfoForData.stateId,
              zip: addressInfoForData.zip,
            },
            update: {
              city: addressInfoForData.city,
              street: addressInfoForData.street,
              county_id: addressInfoForData.countyId,
              state_id: addressInfoForData.stateId,
              zip: addressInfoForData.zip,
            },
          },
        },
        current_address: `${address}, ${addressInfoForData.stateId}`,
        mobile_phone: filterNumber(cell),
        home_phone: filterNumber(home || ''),
        work_phone: filterNumber(work || ''),
        first_name: splitIncomingName(prospect).firstname,
        last_name: splitIncomingName(prospect).lastname,
        name_lastname: prospect,
        email: email,
      },
    });

    return NextResponse.json({ successMessage: 'Data Updated Successfully' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
