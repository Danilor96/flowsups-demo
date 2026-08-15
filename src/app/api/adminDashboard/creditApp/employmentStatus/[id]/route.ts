import { mockDb } from '@/app/libs/mock-db';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createEvent, trackChanges } from '@/app/libs/events/events';
import { auth } from '@/auth';
import { EmploymentStatus } from '../../types';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const customerId = parseInt(params.id);

  try {
    const data = mockDb.customer_employment.findMany({
      where: {
        client_id: customerId,
      },
      orderBy: {
        id: 'asc',
      },
    });

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const customerId = parseInt(params.id);

  const formData = await request.formData();

  const session = await auth();

  const userId = session?.user.id;

  const employmentStatusSchema = z.object({
    nextToReferences: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    employmentStatusData: z.array(
      z.object({
        id: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable().optional(),
        addressId: z
          .string({ invalid_type_error: 'Please enter a valid value' })
          .nullable()
          .optional(),
        currentEmployerName: z
          .string({ invalid_type_error: 'Please enter a valid value' })
          .nullable()
          .optional(),
        address: z
          .string({ invalid_type_error: 'Please enter a valid value' })
          .nullable()
          .optional(),
        phoneNumber: z
          .string({ invalid_type_error: 'Please enter a valid value' })
          .nullable()
          .optional(),
        employmentStatus: z
          .string({ invalid_type_error: 'Please enter a valid value' })
          .nullable()
          .optional(),
        occupation: z
          .string({ invalid_type_error: 'Please enter a valid value' })
          .nullable()
          .optional(),
        year: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable().optional(),
        months: z
          .string({ invalid_type_error: 'Please enter a valid value' })
          .nullable()
          .optional(),
        incomeType: z
          .string({ invalid_type_error: 'Please enter a valid value' })
          .nullable()
          .optional(),
        monthlyIncome: z
          .string({ invalid_type_error: 'Please enter a valid value' })
          .nullable()
          .optional(),
        hourlyWage: z
          .string({ invalid_type_error: 'Please enter a valid value' })
          .nullable()
          .optional(),
        yearToDate: z
          .string({ invalid_type_error: 'Please enter a valid value' })
          .nullable()
          .optional(),
        hasBankAccount: z
          .string({ invalid_type_error: 'Please enter a valid value' })
          .nullable()
          .optional(),
      }),
    ),
  });

  const data = formData.get('employmentStatus');

  const validatedData = employmentStatusSchema.safeParse({
    nextToReferences: formData.get('nextToReferences'),
    employmentStatusData: typeof data === 'string' && JSON.parse(data),
  });

  if (!validatedData.success) {
    const errors = validatedData.error.formErrors.fieldErrors;

    const formattedErrors = validatedData.error.errors.reduce<Record<string, string>>(
      (acc, error) => {
        const path = error.path.join('.');
        acc[path] = error.message;
        return acc;
      },
      {},
    );

    return NextResponse.json({ fieldErrors: formattedErrors }, { status: 422 });
  }

  const { employmentStatusData, nextToReferences } = validatedData.data;

  try {
    const newEmploymentIds = employmentStatusData
      .map((el) => (el.id ? parseInt(el.id) : undefined))
      .filter((id) => id !== undefined && id !== null);

    mockDb.customer_employment.deleteMany({
      where: {
        AND: [{ client_id: customerId }, { id: { notIn: newEmploymentIds } }],
      },
    });

    mockDb.credit_app_navigation.upsert({
      where: {
        customer_id: customerId,
      },
      update: {
        nextToReferences: nextToReferences === 'true',
      },
      create: {
        customer_id: customerId,
        nextToReferences: nextToReferences === 'true',
      },
    });

    type EmploymentData = Record<string, any> & {
      customer_employment_address: Record<string, any>[];
    };

    let currentEmplymentDataUpdated: EmploymentData | undefined;

    let prevEmplymentDataUpdated: EmploymentData[] = [];

    for (let i = 0; i < employmentStatusData.length; i++) {
      const el = employmentStatusData[i];

      const prevData = mockDb.customer_employment.findUnique({
        where: {
          id: Number(el.id),
        },
      });

      if (i === 0) {
        const existingEmployment = mockDb.customer_employment.findUnique({
          where: {
            id: Number(el.id),
          },
        });

        const updatedAddressData = existingEmployment?.customer_employment_address?.[0]
          ? [
              {
                ...existingEmployment.customer_employment_address[0],
                current_address: el.address ? el.address : null,
                current_phone_number: el.phoneNumber ? el.phoneNumber : null,
              },
            ]
          : [
              {
                current_address: el.address ? el.address : null,
                current_phone_number: el.phoneNumber ? el.phoneNumber : null,
              },
            ];

        const updatedData = mockDb.customer_employment.upsert({
          where: {
            id: Number(el.id),
          },
          update: {
            client_id: customerId,
            current_employer_name: el.currentEmployerName ? el.currentEmployerName : null,
            employment_status_id: el.employmentStatus ? parseInt(el.employmentStatus) : null,
            income_type_id: el.incomeType ? parseInt(el.incomeType) : null,
            month_id: el.months ? parseInt(el.months) : null,
            occupation_id: el.occupation ? parseInt(el.occupation) : null,
            montly_income: el.monthlyIncome ? el.monthlyIncome : null,
            year: el.year ? el.year : null,
            hourlyWage: el.hourlyWage ? el.hourlyWage : null,
            yearToDate: el.yearToDate ? el.yearToDate : null,
            customer_employment_address: updatedAddressData,
            has_bank_account: el.hasBankAccount ? true : false,
          },
          create: {
            client_id: customerId,
            current_employer_name: el.currentEmployerName,
            employment_status_id: el.employmentStatus ? parseInt(el.employmentStatus) : null,
            income_type_id: el.incomeType ? parseInt(el.incomeType) : null,
            month_id: el.months ? parseInt(el.months) : null,
            occupation_id: el.occupation ? parseInt(el.occupation) : null,
            montly_income: el.monthlyIncome,
            year: el.year,
            hourlyWage: el.hourlyWage ? el.hourlyWage : null,
            yearToDate: el.yearToDate ? el.yearToDate : null,
            customer_employment_address: [
              {
                current_address: el.address,
                current_phone_number: el.phoneNumber,
              },
            ],
            has_bank_account: el.hasBankAccount ? true : false,
          },
        });

        currentEmplymentDataUpdated = updatedData;

        const { customer_employment_address, ...rest } = updatedData;

        const worksWith = [
          'current_employer_name',
          'employment_status_id',
          'income_type_id',
          'month_id',
          'occupation_id',
          'montly_income',
          'year',
        ];

        const updatedFields = await trackChanges({ prevData, updatedData: rest, worksWith });

        if (updatedFields.length > 0 && userId) {
          const description = `Fields at Credit App modified: ${updatedFields.join(', ')}`;

          await createEvent(description, userId, customerId, new Date());
        }
      } else {
        const existingEmployment = mockDb.customer_employment.findUnique({
          where: {
            id: Number(el.id),
          },
        });

        const updatedAddressData = existingEmployment?.customer_employment_address?.[0]
          ? [
              {
                ...existingEmployment.customer_employment_address[0],
                previous_address: el.address ? el.address : null,
                previous_phone_number: el.phoneNumber ? el.phoneNumber : null,
              },
            ]
          : [
              {
                previous_address: el.address ? el.address : null,
                previous_phone_number: el.phoneNumber ? el.phoneNumber : null,
              },
            ];

        const updatedData = mockDb.customer_employment.upsert({
          where: {
            id: Number(el.id),
          },
          update: {
            client_id: customerId,
            previous_employer_name: el.currentEmployerName ? el.currentEmployerName : null,
            employment_status_id: el.employmentStatus ? parseInt(el.employmentStatus) : null,
            income_type_id: el.incomeType ? parseInt(el.incomeType) : null,
            month_id: el.months ? parseInt(el.months) : null,
            occupation_id: el.occupation ? parseInt(el.occupation) : null,
            montly_income: el.monthlyIncome ? el.monthlyIncome : null,
            year: el.year ? el.year : null,
            hourlyWage: el.hourlyWage ? el.hourlyWage : null,
            yearToDate: el.yearToDate ? el.yearToDate : null,
            customer_employment_address: updatedAddressData,
          },
          create: {
            client_id: customerId,
            previous_employer_name: el.currentEmployerName ? el.currentEmployerName : null,
            employment_status_id: el.employmentStatus ? parseInt(el.employmentStatus) : null,
            income_type_id: el.incomeType ? parseInt(el.incomeType) : null,
            month_id: el.months ? parseInt(el.months) : null,
            occupation_id: el.occupation ? parseInt(el.occupation) : null,
            montly_income: el.monthlyIncome ? el.monthlyIncome : null,
            year: el.year ? el.year : null,
            hourlyWage: el.hourlyWage ? el.hourlyWage : null,
            yearToDate: el.yearToDate ? el.yearToDate : null,
            customer_employment_address: [
              {
                previous_address: el.address ? el.address : null,
                previous_phone_number: el.phoneNumber ? el.phoneNumber : null,
              },
            ],
          },
        });

        prevEmplymentDataUpdated.push(updatedData);

        const { customer_employment_address, ...rest } = updatedData;

        const worksWith = [
          'previous_employer_name',
          'employment_status_id',
          'income_type_id',
          'month_id',
          'occupation_id',
          'montly_income',
          'year',
        ];

        const updatedFields = await trackChanges({ prevData, updatedData: rest, worksWith });

        if (updatedFields.length > 0 && userId) {
          const description = `Fields at Credit App modified: ${updatedFields.join(', ')}`;

          await createEvent(description, userId, customerId, new Date());
        }
      }
    }

    const dataToReturn: EmploymentStatus = {
      id: currentEmplymentDataUpdated?.id,
      currentEmploymentName: currentEmplymentDataUpdated?.current_employer_name,
      addressId: currentEmplymentDataUpdated?.customer_employment_address[0].id,
      currentAddress: currentEmplymentDataUpdated?.customer_employment_address[0].current_address,
      currentPhoneNumber:
        currentEmplymentDataUpdated?.customer_employment_address[0].current_phone_number,
      currentEmploymentStatus: currentEmplymentDataUpdated?.employment_status_id,
      currentOccupation: currentEmplymentDataUpdated?.occupation_id,
      currentYear: currentEmplymentDataUpdated?.year,
      currentMonth: currentEmplymentDataUpdated?.month_id,
      currentIncomeType: currentEmplymentDataUpdated?.income_type_id,
      currentMontlyIncome: currentEmplymentDataUpdated?.montly_income,
      currentHourlyWage: currentEmplymentDataUpdated?.hourlyWage,
      currentYearToDate: currentEmplymentDataUpdated?.yearToDate,
      hasBankAccount: currentEmplymentDataUpdated?.has_bank_account,
      prevEmploymentData: prevEmplymentDataUpdated.map((el) => ({
        id: el.id,
        addressId: el?.customer_employment_address[0].id,
        employmentName: el.previous_employer_name,
        address: el.customer_employment_address[0].previous_address,
        phoneNumber: el.customer_employment_address[0].previous_phone_number,
        employmentStatus: el.employment_status_id,
        occupation: el.occupation_id,
        year: el.year,
        month: el.month_id,
        incomeType: el.income_type_id,
        montlyIncome: el.montly_income,
        hourlyWage: el.hourlyWage,
        yearToDate: el.yearToDate,
      })),
    };

    return NextResponse.json({
      successMessage: 'Data Successfully Updated',
      data: dataToReturn,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
