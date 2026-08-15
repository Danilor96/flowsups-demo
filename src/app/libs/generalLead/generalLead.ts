import { mockDb } from '../mock-db';

export async function createGeneralLead(
  createdBy: string,
  createdAt: string,
  customerId: number,
  statusId: number,
  assignedTo?: string,
  reminderTime?: string,
  leadId?: number,
  followUpDate?: string,
  incoming?: boolean,
  outcoming?: boolean,
  noteId?: number,
  dealDate?: string,
  lostReasonId?: number,
  appointmentId?: number,
) {
  try {
    const generalLead = await mockDb.client_has_lead.create({
      data: {
        client_id: customerId,
        created_by_id: parseInt(createdBy),
        created_at: new Date(createdAt),
        status_id: statusId,
        follow_up_date: followUpDate ? new Date(followUpDate) : null,
        lead_id: leadId,
        reminder_time: reminderTime ? parseInt(reminderTime) : null,
        note_id: noteId,
        assigned_to_id: assignedTo ? parseInt(assignedTo) : null,
        incoming: incoming,
        outcoming: outcoming,
        dealdate: dealDate ? new Date(dealDate) : null,
        lost_reason_id: lostReasonId,
        appointment_id: appointmentId,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
