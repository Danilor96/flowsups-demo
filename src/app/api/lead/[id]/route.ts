import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { checkPermissions } from '@/app/libs/auth-helpers';
import { auth } from '@/auth';
import { Permissions } from '@/app/libs/definitions/permissions/permissions';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const customerId = parseInt(params.id);

    const leads = await prisma.leads.findMany({
      where: {
        customer_id: customerId,
      },
      select: {
        id: true,
        is_active: true,
        has_ended: true,
        is_selected: true,
        customer_status: {
          select: { id: true, status: true },
        },
        lead_temperature: {
          select: { id: true },
        },
        customer_status_id: true,
      },
      orderBy: { id: 'asc' },
    });

    //await prisma.$disconnect();

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(leads);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions([78]);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const session = await auth();
  const userId = session?.user.id;

  const customerId = parseInt(params.id);

  try {
    const notEndedLead = await prisma.leads.findFirst({
      where: {
        customer_id: customerId,
        has_ended: false,
      },
      select: {
        id: true,
      },
    });

    if (!notEndedLead) {
      await prisma.leads.updateMany({
        where: {
          customer_id: customerId,
          OR: [
            {
              is_active: true,
            },
            {
              is_selected: true,
            },
          ],
        },
        data: {
          is_active: false,
          is_selected: false,
        },
      });

      await prisma.leads.create({
        data: {
          customer_id: customerId,
          customer_status_id: 1,
        },
      });

      const customer = await prisma.clients.update({
        where: {
          id: customerId,
        },
        data: {
          client_status_id: 1,
        },
      });

      await prisma.events.create({
        data: {
          description: 'New lead started',
          updated_at: new Date(),
          client_id: customerId,
          updated_by: userId,
        },
      });
    }

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'New Lead Started' });
  } catch (error) {
    console.log(error);

    //await prisma?.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  // const permissionsCheck = await checkPermissions([78]); Permissions

  // if (permissionsCheck) {
  //   return permissionsCheck;
  // }

  try {
    const leadId = parseInt(params.id);

    const leadToDelete = await prisma.leads.findUnique({
      where: { id: leadId },
      select: { id: true, customer_id: true },
    });

    if (!leadToDelete) {
      return NextResponse.json({ serverError: 'Lead not found' }, { status: 404 });
    }

    const allLeads = await prisma.leads.findMany({
      where: { customer_id: leadToDelete.customer_id },
      select: { id: true },
      orderBy: { id: 'asc' },
    });

    if (allLeads.length === 0 || allLeads[0].id === leadId) {
      return NextResponse.json({ serverError: 'Cannot delete the first lead' }, { status: 403 });
    }

    const lastLead = allLeads.filter((l) => l.id !== leadId).at(-1) ?? null;

    await prisma.leads.delete({ where: { id: leadId } });

    if (lastLead) {
      await prisma.leads.updateMany({
        where: { customer_id: leadToDelete.customer_id },
        data: { is_selected: false, is_active: false },
      });

      await prisma.leads.update({
        where: { id: lastLead.id },
        data: { is_selected: true, is_active: true },
      });
    }

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json({ successMessage: 'Lead deleted' });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(reuqest: Request, { params }: { params: { id: string } }) {
  try {
    const leadId = parseInt(params.id);

    const leadCustomer = await prisma.leads.findUnique({
      where: {
        id: leadId,
      },
      select: {
        customer_id: true,
      },
    });

    if (leadCustomer) {
      await prisma.leads.updateMany({
        where: {
          customer_id: leadCustomer.customer_id,
          id: {
            not: leadId,
          },
        },
        data: {
          is_selected: false,
        },
      });

      await prisma.leads.update({
        where: {
          id: leadId,
        },
        data: {
          is_selected: true,
        },
      });
    }

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Lead Changed' });
  } catch (error) {
    console.log(error);

    //await prisma?.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
