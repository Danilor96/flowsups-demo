import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { LeadHistory, TaskLeadHistory } from '../type';
import { auth } from '@/auth';
import { Roles } from '@/app/api/adminDashboard/dailyCalls/types';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const customerId = Number(params.id);
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get('cursor');
  const getLastLead = searchParams.get('getLastLead');
  const cursorDate = cursor ? new Date(cursor) : undefined;

  const session = await auth();
  const userId = session?.user.id;
  const userRoleId = session?.user.user_has[0].role_id;

  try {
    const limit = 5;
    let relatedTaskId: number | null = null;
    let leadHistoryCombined: (LeadHistory | TaskLeadHistory)[] = [];

    const adminRoles = [Roles.Superuser, Roles.Administrator];

    const leadsRaw = mockDb.client_has_lead.findMany({
      take: !getLastLead ? limit : 1,
      orderBy: {
        created_at: 'desc',
      },
      where: {
        client_id: customerId,
        created_at: !getLastLead ? (cursorDate ? { lt: cursorDate } : undefined) : undefined,
      },
    });

    const leadData = leadsRaw.map((currentLead) => ({
      id: currentLead.id,
      created_at: currentLead.created_at,
      lead_id: currentLead.lead_id,
      client_leads: mockDb.client_detail_leads.findUnique({
        where: {
          id: currentLead.lead_id,
        },
      }),
      lead_created_by: currentLead.created_by_id
        ? mockDb.users.findUnique({
            where: {
              id: currentLead.created_by_id,
            },
          })
        : null,
      note_assigned: currentLead.note_id
        ? mockDb.notes.findUnique({
            where: {
              id: currentLead.note_id,
            },
          })
        : null,
      task_id: currentLead.task_id,
    }));

    const leadHistory: LeadHistory[] =
      leadData?.map((currentLead) => {
        const id = currentLead.id;

        const name = currentLead.lead_created_by?.name || '';
        const lastname = currentLead.lead_created_by?.last_name || '';
        const username = currentLead.lead_created_by?.username || '';
        const createdBy =
          !name && !lastname && !username
            ? 'System'
            : `${name}${lastname ? ` ${lastname}` : ''}${username ? ` - ${username}` : ''}`;

        const lead = currentLead.client_leads?.lead || '';

        const createdAt = currentLead.created_at;

        const leadId = Number(currentLead.lead_id);

        let leadNote;

        if (currentLead.note_assigned) {
          leadNote = {
            createdAt: currentLead.note_assigned.created_at,
            note: currentLead.note_assigned.note,
          };
        }

        if (currentLead.task_id) {
          relatedTaskId = currentLead.task_id;
        }

        return {
          id,
          createdBy,
          lead,
          createdAt,
          leadNote,
          leadId,
          type: 'LEAD',
        };
      }) ?? [];

    let tasksData: any[] = [];

    const projectTask = (task: any) => ({
      id: task.id,
      deadline: task.deadline,
      status: task.status,
      title: task.title,
      description: task.description,
      created_at: task.created_at,
      finished_at: task.finished_at,
      assigned: task.assigned_to
        ? mockDb.users.findUnique({
            where: {
              id: task.assigned_to,
            },
          })
        : null,
      creator: task.created_by
        ? mockDb.users.findUnique({
            where: {
              id: task.created_by,
            },
          })
        : null,
    });

    if (getLastLead && relatedTaskId) {
      const tasksRaw = mockDb.tasks.findMany({
        where: { id: relatedTaskId },
      });

      tasksData = tasksRaw.map(projectTask);
    } else if (!getLastLead) {
      const tasksRaw = mockDb.tasks.findMany({
        take: limit,
        orderBy: {
          created_at: 'desc',
        },
        where: {
          customer_id: customerId,
          created_at: cursorDate ? { lt: cursorDate } : undefined,
          assigned_to: userRoleId && adminRoles.includes(userRoleId) ? undefined : userId,
        },
      });

      tasksData = tasksRaw.map(projectTask);
    }

    const taskLeadHistory: TaskLeadHistory[] =
      tasksData.map((task) => {
        const id = task.id;
        const dueDate = task.deadline;
        const statusId = task.status;
        const subject = task.title;
        const description = task.description;
        const createdAt = task.created_at;
        const finishedAt = task.finished_at;

        const assignedName = task.assigned?.name || '';
        const assignedLastname = task.assigned?.last_name || '';
        const assignedUsername = task.assigned?.username || '';
        const assignedTo = `${assignedName}${assignedLastname ? ` ${assignedLastname}` : ''}${assignedUsername ? ` - ${assignedUsername}` : ''}`;

        const creatorName = task.creator?.name || '';
        const creatorLastname = task.creator?.last_name || '';
        const creatorUsername = task.creator?.username || '';
        const createdBy =
          !creatorName && !creatorLastname && !creatorUsername
            ? 'System'
            : `${creatorName}${creatorLastname ? ` ${creatorLastname}` : ''}${creatorUsername ? ` - ${creatorUsername}` : ''}`;

        return {
          id,
          dueDate,
          statusId,
          subject,
          description,
          assignedTo,
          createdBy,
          createdAt,
          finishedAt,
          type: 'TASK',
        };
      }) ?? [];

    leadHistoryCombined = [...taskLeadHistory, ...leadHistory];

    leadHistoryCombined = leadHistoryCombined
      .sort((a, b) => {
        const timeDiff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

        if (timeDiff === 0) {
          return a.type.localeCompare(b.type);
        }

        return timeDiff;
      })
      .slice(0, !getLastLead ? limit : leadHistoryCombined.length);

    const lastItem = leadHistoryCombined[leadHistoryCombined.length - 1];
    const nextCursor =
      !getLastLead && leadHistoryCombined.length === limit
        ? lastItem?.createdAt.toISOString()
        : null;

    return NextResponse.json({ leadHistoryCombined, nextCursor });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
