import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { checkPermissions } from '@/app/libs/auth-helpers';
import { createEvent } from '@/app/libs/events/events';

export async function POST(request: Request) {
  // const permissionsCheck = await checkPermissions([67, 68, 69]);

  // if (permissionsCheck) {
  //   return permissionsCheck;
  // }

  try {
    const body = await request.json();
    const { customerId, oldVehicleId, newVehicleId, userId, leadId } = body;

    if (!customerId || !newVehicleId || !userId) {
      return NextResponse.json({ serverError: 'Missing required fields' }, { status: 400 });
    }

    let oldVehicle = null;
    if (oldVehicleId) {
      oldVehicle = mockDb.vehicles.findUnique({
        where: { id: parseInt(oldVehicleId) },
        select: { vehicle_status_id: true, stock_no: true },
      });
    }

    const client = mockDb.clients.findUnique({
      where: { id: parseInt(customerId) },
      include: {
        lead: {
          where: leadId ? { id: Number(leadId) } : { is_active: true },
        },
      },
    });

    const activeLead = client?.lead?.[0];

    if (!activeLead) {
      return NextResponse.json({ serverError: 'No active lead found for client' }, { status: 400 });
    }

    if (oldVehicleId) {
      mockDb.vehicles.update({
        where: { id: parseInt(oldVehicleId) },
        data: {
          vehicle_status_id: 1, // In Stock
        },
      });
    }

    mockDb.vehicles.update({
      where: { id: parseInt(newVehicleId) },
      data: {
        vehicle_status_id: 3, // Sold
      },
    });

    mockDb.clients.update({
      where: { id: parseInt(customerId) },
      data: {
        intereseted_vehicle_id: parseInt(newVehicleId),
      },
    });

    mockDb.leads.update({
      where: { id: activeLead.id },
      data: {
        vehicle_id: parseInt(newVehicleId),
      },
    });

    const eventDescription = oldVehicle
      ? `Swapped Sold Vehicle: Released Stock #${oldVehicle?.stock_no} (ID: ${oldVehicleId}) and marked ID: ${newVehicleId} as Sold.`
      : `Assigned Sold Vehicle: Marked ID: ${newVehicleId} as Sold.`;

    mockDb.events.create({
      data: {
        description: eventDescription,
        updated_by: parseInt(userId),
        client_id: parseInt(customerId),
        updated_at: new Date().toISOString(),
      },
    });

    return NextResponse.json(
      { success: true, message: 'Vehicle changed successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error changing sold vehicle', error);
    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
