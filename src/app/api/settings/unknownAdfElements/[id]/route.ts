import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const reasonId = parseInt(params.id);

  try {
    const data = mockDb.unknown_adf_elements.delete({
      where: {
        id: reasonId,
      },
    });

    return NextResponse.json({ successMessage: 'Element Successfully Deleted' }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
