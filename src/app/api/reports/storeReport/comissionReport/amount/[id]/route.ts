import { mockDb } from '@/app/libs/mock-db';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { AmountForm, ComissionType } from '../../types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = Number(params.id);

  const { searchParams } = request.nextUrl;

  const type = searchParams.get('type');

  try {
    let data: AmountForm[] = [];

    const comissionInfo = mockDb.comission_info.findUnique({
      where: {
        user_id: userId,
      },
      select: {
        id: true,
      },
    });

    if (comissionInfo) {
      switch (type) {
        case ComissionType.Spiff:
          const spiffData = mockDb.comission_spiff.findMany({
            where: {
              comission_info_id: comissionInfo.id,
            },
            select: {
              id: true,
              amount: true,
              description: true,
            },
            orderBy: {
              id: 'asc',
            },
          });

          data = spiffData.map((el) => ({
            id: el.id,
            amount: el.amount.toString(),
            description: el.description || '',
          }));

          break;

        case ComissionType.Bonus:
          const bonusData = mockDb.comission_bonus.findMany({
            where: {
              comission_info_id: comissionInfo.id,
            },
            select: {
              id: true,
              amount: true,
              description: true,
            },
            orderBy: {
              id: 'asc',
            },
          });

          data = bonusData.map((el) => ({
            id: el.id,
            amount: el.amount.toString(),
            description: el.description || '',
          }));
          break;

        case ComissionType.Salary:
          const salaryData = mockDb.comission_salary.findMany({
            where: {
              comission_info_id: comissionInfo.id,
            },
            select: {
              id: true,
              amount: true,
              description: true,
            },
            orderBy: {
              id: 'asc',
            },
          });

          data = salaryData.map((el) => ({
            id: el.id,
            amount: el.amount.toString(),
            description: el.description || '',
          }));
          break;
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const userId = Number(params.id);

  const amountSchema = z.object({
    type: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    deletedFormsIds: z.array(z.string()).nullable(),
    forms: z.array(
      z.object({
        id: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
        amount: z
          .string({ invalid_type_error: 'Please enter a valid value' })
          .nullable()
          .pipe(z.coerce.number({ invalid_type_error: 'Please enter a valid value' })),
        description: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      }),
    ),
  });

  const formArray = await request.json();

  const validatedData = amountSchema.safeParse(formArray);

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const forms = validatedData.data;

  try {
    const comissionData = mockDb.comission_info.upsert({
      where: {
        user_id: userId,
      },
      update: {},
      create: {
        user_id: userId,
      },
    });

    let formsToCreate: { amount: number; description: string }[] = [];
    let formsToUpdate: { id: number; amount: number; description: string }[] = [];

    forms.forms.forEach((form) => {
      if (!form.id && form.amount) {
        formsToCreate.push({
          amount: form.amount,
          description: form.description || '',
        });
      }

      if (form.id) {
        formsToUpdate.push({
          id: Number(form.id),
          amount: form.amount,
          description: form.description || '',
        });
      }
    });

    const dataToCreate = formsToCreate.map((form) => ({
      amount: form.amount,
      description: form.description,
      comission_info_id: comissionData.id,
    }));

    let dataToReturn: AmountForm[] = [];

    switch (forms.type) {
      case ComissionType.Spiff:
        mockDb.comission_spiff.deleteMany({
          where: {
            id: {
              in: forms.deletedFormsIds?.map((id) => Number(id)),
            },
          },
        });

        if (dataToCreate.length > 0) {
          mockDb.comission_spiff.createMany({
            data: dataToCreate,
          });
        }

        const updateSpiffPromises = formsToUpdate.map((form) => {
          const idToUpdate = Number(form.id);

          return mockDb.comission_spiff.update({
            where: { id: idToUpdate },
            data: {
              amount: form.amount,
              description: form.description || '',
            },
          });
        });

        const currentSpiffs = mockDb.comission_spiff.findMany({
          where: {
            comission_info_id: comissionData.id,
          },
          select: {
            id: true,
            amount: true,
            description: true,
          },
          orderBy: {
            id: 'asc',
          },
        });

        dataToReturn = currentSpiffs.map((el) => ({
          amount: el.amount.toString(),
          description: el.description,
          id: el.id,
        }));

        break;

      case ComissionType.Bonus:
        mockDb.comission_bonus.deleteMany({
          where: {
            id: {
              in: forms.deletedFormsIds?.map((id) => Number(id)),
            },
          },
        });

        if (dataToCreate.length > 0) {
          mockDb.comission_bonus.createMany({
            data: dataToCreate,
          });
        }

        const updateBonusPromises = formsToUpdate.map((form) => {
          const idToUpdate = Number(form.id);

          return mockDb.comission_bonus.update({
            where: { id: idToUpdate },
            data: {
              amount: form.amount,
              description: form.description || '',
            },
          });
        });

        const currentBonus = mockDb.comission_bonus.findMany({
          where: {
            comission_info_id: comissionData.id,
          },
          select: {
            id: true,
            amount: true,
            description: true,
          },
          orderBy: {
            id: 'asc',
          },
        });

        dataToReturn = currentBonus.map((el) => ({
          amount: el.amount.toString(),
          description: el.description,
          id: el.id,
        }));

        break;

      case ComissionType.Salary:
        mockDb.comission_salary.deleteMany({
          where: {
            id: {
              in: forms.deletedFormsIds?.map((id) => Number(id)),
            },
          },
        });

        if (dataToCreate.length > 0) {
          mockDb.comission_salary.createMany({
            data: dataToCreate,
          });
        }

        const updateSalaryPromises = formsToUpdate.map((form) => {
          const idToUpdate = Number(form.id);

          return mockDb.comission_salary.update({
            where: { id: idToUpdate },
            data: {
              amount: form.amount,
              description: form.description || '',
            },
          });
        });

        const currentSalary = mockDb.comission_salary.findMany({
          where: {
            comission_info_id: comissionData.id,
          },
          select: {
            id: true,
            amount: true,
            description: true,
          },
          orderBy: {
            id: 'asc',
          },
        });

        dataToReturn = currentSalary.map((el) => ({
          amount: el.amount.toString(),
          description: el.description,
          id: el.id,
        }));

        break;
    }

    return NextResponse.json({ successMessage: 'Data Successfully Updated', data: dataToReturn });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
