import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/app/libs/prisma';
import { startOfMonth, endOfMonth } from 'date-fns';
import { buildDateRangeFilter } from '@/app/libs/monthAndYearDateFilter';
import { Decimal } from '@prisma/client/runtime/library';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { searchParams } = request.nextUrl;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  console.log({
    startDate,
    endDate,
  });
  try {
    const userId = parseInt(params.id);
    const formData = await request.formData();
    const salesGoal = formData.get('salesGoal');

    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const salesGoalValue = salesGoal ? parseInt(salesGoal.toString()) : 0;

    // todo: multi tenant business id
    const businessId = await prisma.business.findFirst({ select: { id: true } });
    if (!businessId) {
      return NextResponse.json({ serverError: 'Business not found' }, { status: 404 });
    }


    const prismaDateFilter = buildDateRangeFilter(startDate, endDate);
    // crear o actualizar un monthly goals para el mes actual y la fuente seleccionada
    const existingSalesGoal = await prisma.monthly_goals.findFirst({
      where: {
        user_id: userId,
        date_month: prismaDateFilter,
        business_id: businessId.id,
      },
    });
 
    if (existingSalesGoal) {
      await prisma.monthly_goals.update({
        where: {
          id: existingSalesGoal.id,
        },
        data: {
          sales_goal: salesGoalValue,
        },
      });
      console.log('updated: ')
    } else {
      console.log('created: ')
      await prisma.monthly_goals.create({
        data: {
          sales_goal: salesGoalValue,
          user_id: userId,
          business_id: businessId.id,
          date_month: prismaDateFilter.gte || new Date().toISOString(),
        }
      });
    }

    return NextResponse.json({ successMessage: 'Sales goal updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating daily target:', error);
    return NextResponse.json({ serverError: 'Error updating daily target' }, { status: 500 });
  }
}
