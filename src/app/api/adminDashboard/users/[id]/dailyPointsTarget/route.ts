import { NextResponse, NextRequest } from 'next/server';
import { mockDb } from '@/app/libs/mock-db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = parseInt(params.id, 10);
    const formData = await request.formData();
    const dailyTargetValue = formData.get('daily_target');

    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const dailyTarget = dailyTargetValue ? parseInt(dailyTargetValue.toString()) : null;

    if (dailyTargetValue && isNaN(dailyTarget as number)) {
      return NextResponse.json({ error: 'Invalid daily target value' }, { status: 400 });
    }

    const updatedUser = mockDb.users.update({
      where: { id: userId, deleted_at: null },
      data: {
        daily_points_target: dailyTarget,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating daily target:', error);
    return NextResponse.json({ serverError: 'Error updating daily target' }, { status: 500 });
  }
}
