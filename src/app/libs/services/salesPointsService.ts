import { mockDb } from '@/app/libs/mock-db';

export const enum ActivityType {
  SMS_SENT = 'SMS_SENT',
  EMAIL_SENT = 'EMAIL_SENT',
  CALL_MADE = 'CALL_MADE',
  APPOINTMENT_COMPLETED = 'APPOINTMENT_COMPLETED',
  APPOINTMENT_MADE = 'APPOINTMENT_MADE',
  CUSTOMER_SOLD = 'CUSTOMER_SOLD',
}

export type SellerActivityCounter = {
  id: number;
  sellerId: number;
  smsSentCurrentCount: number;
  smsSentTotalCount: number;
  callsMadeCurrentCount: number;
  callsMadeTotalCount: number;
  emailsSentCurrentCount: number;
  emailsSentTotalCount: number;
  appointmentsCompletedCurrentCount: number;
  appointmentsCompletedTotalCount: number;
  appointmentsMadeCurrentCount: number;
  appointmentsMadeTotalCount: number;
  soldCustomersCurrentCount: number;
  soldCustomersTotalCount: number;
};

type SalesGoalsConfig = {
  smssSentNumber: number;
  emailsSentNumber: number;
  callsMadeNumber: number;
  appointmentsCompletedNumber: number;
  appointmentsMadeNumber: number;
  soldCustomersNumber: number;
};

export async function salesPointsAssignService({
  userId,
  activityType,
}: {
  userId: number;
  activityType: ActivityType;
}) {
  const user = mockDb.users.findUnique({
    where: { id: userId, deleted_at: null },
  });
  if (!user) return;

  mockDb.sales_activity_log.create({
    data: {
      user_id: userId,
      activity_type: activityType,
    },
  });

  let userActivityCounter = mockDb.sellerActivityCounter.findUnique({
    where: { sellerId: userId },
  });
  if (!userActivityCounter) {
    userActivityCounter = mockDb.sellerActivityCounter.create({
      data: {
        sellerId: userId,
      },
    });
  }

  const counters = getCountersByActivityType(activityType, userActivityCounter);
  if (counters.keysToUpdate === null) return;

  const salesGoalsConfig = mockDb.salesGoalsConfig.findFirst();
  const target = salesGoalsConfig ? getTarget(activityType, salesGoalsConfig) : null;
  const hasTarget = target !== null && target > 0;

  let newCurrentCounterValue = counters.currentCount;
  if (hasTarget && counters.currentCount > target) {
    newCurrentCounterValue = 0;
  }

  // Increment current counter
  newCurrentCounterValue = counters.currentCount + 1;

  if (hasTarget && newCurrentCounterValue >= target) {
    newCurrentCounterValue = newCurrentCounterValue - target;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastUpdateDate = user.sales_points_today_date
      ? new Date(user.sales_points_today_date)
      : new Date(0);
    lastUpdateDate.setHours(0, 0, 0, 0);

    // Increment sales points
    if (lastUpdateDate.getTime() < today.getTime()) {
      //reset today's points
      mockDb.users.update({
        where: { id: userId, deleted_at: null },
        data: {
          sales_points_total: { increment: 1 },
          sales_points_today: 1,
          sales_points_today_date: today,
        },
      });
    } else {
      mockDb.users.update({
        where: { id: userId, deleted_at: null },
        data: { sales_points_total: { increment: 1 }, sales_points_today: { increment: 1 } },
      });
    }
  }

  const result = mockDb.sellerActivityCounter.update({
    where: { sellerId: userId },
    data: {
      [counters.keysToUpdate?.currentCountKey]: newCurrentCounterValue,
      [counters.keysToUpdate?.totalCountKey]: { increment: 1 },
    },
  });
}

export async function sellerActivityEventEmitterAsync(sellerActivityPayload: {
  userId: number;
  activityType: ActivityType;
}) {
  const apiUrl = process.env.SOCKET_URL;
  fetch(`${apiUrl}/events/seller-activity`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'x-api-key': process.env.INTERNAL_API_KEY, // key token for internal API
    },
    body: JSON.stringify(sellerActivityPayload),
  }).catch((error) => {
    console.error('Failed to dispatch job to worker server: sellerActivityEvent', error.message);
  });
}

function getTarget(activityType: ActivityType, salesGoalsConfig: SalesGoalsConfig): number {
  let target: number | null = null;
  switch (activityType) {
    case 'SMS_SENT':
      target = salesGoalsConfig.smssSentNumber;
      break;
    case 'EMAIL_SENT':
      target = salesGoalsConfig.emailsSentNumber;
      break;
    case 'CALL_MADE':
      target = salesGoalsConfig.callsMadeNumber;
      break;
    case 'APPOINTMENT_COMPLETED':
      target = salesGoalsConfig.appointmentsCompletedNumber;
      break;
    case 'APPOINTMENT_MADE':
      target = salesGoalsConfig.appointmentsMadeNumber;
      break;
    case 'CUSTOMER_SOLD':
      target = salesGoalsConfig.soldCustomersNumber;
      break;
    default:
      target = 0;
  }

  if (target === null || target <= 0) {
    return 0;
  }
  return target;
}

function getCountersByActivityType(
  activityType: ActivityType,
  sellerActivityCounter: SellerActivityCounter,
) {
  let counters: {
    currentCount: number;
    totalCount: number;
    keysToUpdate: {
      currentCountKey: keyof SellerActivityCounter;
      totalCountKey: keyof SellerActivityCounter;
    } | null;
  } = { currentCount: 0, totalCount: 0, keysToUpdate: null };

  switch (activityType) {
    case ActivityType.SMS_SENT:
      counters.currentCount = sellerActivityCounter.smsSentCurrentCount;
      counters.totalCount = sellerActivityCounter.smsSentTotalCount;
      counters.keysToUpdate = {
        currentCountKey: 'smsSentCurrentCount',
        totalCountKey: 'smsSentTotalCount',
      };
      break;
    case ActivityType.EMAIL_SENT:
      counters.currentCount = sellerActivityCounter.emailsSentCurrentCount;
      counters.totalCount = sellerActivityCounter.emailsSentTotalCount;
      counters.keysToUpdate = {
        currentCountKey: 'emailsSentCurrentCount',
        totalCountKey: 'emailsSentTotalCount',
      };
      break;
    case ActivityType.CALL_MADE:
      counters.currentCount = sellerActivityCounter.callsMadeCurrentCount;
      counters.totalCount = sellerActivityCounter.callsMadeTotalCount;
      counters.keysToUpdate = {
        currentCountKey: 'callsMadeCurrentCount',
        totalCountKey: 'callsMadeTotalCount',
      };
      break;
    case ActivityType.APPOINTMENT_COMPLETED:
      counters.currentCount = sellerActivityCounter.appointmentsCompletedCurrentCount;
      counters.totalCount = sellerActivityCounter.appointmentsCompletedTotalCount;
      counters.keysToUpdate = {
        currentCountKey: 'appointmentsCompletedCurrentCount',
        totalCountKey: 'appointmentsCompletedTotalCount',
      };
      break;
    case ActivityType.APPOINTMENT_MADE:
      counters.currentCount = sellerActivityCounter.appointmentsMadeCurrentCount;
      counters.totalCount = sellerActivityCounter.appointmentsMadeTotalCount;
      counters.keysToUpdate = {
        currentCountKey: 'appointmentsMadeCurrentCount',
        totalCountKey: 'appointmentsMadeTotalCount',
      };
      break;
    case ActivityType.CUSTOMER_SOLD:
      counters.currentCount = sellerActivityCounter.soldCustomersCurrentCount;
      counters.totalCount = sellerActivityCounter.soldCustomersTotalCount;
      counters.keysToUpdate = {
        currentCountKey: 'soldCustomersCurrentCount',
        totalCountKey: 'soldCustomersTotalCount',
      };
      break;
    default:
      counters = { currentCount: 0, totalCount: 0, keysToUpdate: null };
      break;
  }

  return counters;
}
