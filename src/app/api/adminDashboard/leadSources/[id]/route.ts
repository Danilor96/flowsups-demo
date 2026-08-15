import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const leadSourceId = parseInt(params.id);

  try {
    const body = await request.json();
    const { source } = body;

    if (!source || typeof source !== 'string' || source.trim() === '') {
      return NextResponse.json({ fieldError: 'Source name is required' }, { status: 400 });
    }

    const updated = await mockDb.lead_sources.update({
      where: { id: leadSourceId },
      data: { source: source.trim() },
    });

    return NextResponse.json({ successMessage: 'Lead Source updated successfully', data: updated });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const leadSourceId = parseInt(params.id);

  try {
    const data = await mockDb.lead_sources.delete({
      where: {
        id: leadSourceId,
      },
    });

    return NextResponse.json({ successMessage: 'Lead SuccessFully Deleted' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
