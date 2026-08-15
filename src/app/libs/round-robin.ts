import { mockDb } from '@/app/libs/mock-db';

/**
 * Ensures a task is assigned to an active user.
 * If the provided userId is deleted (deleted_at is not null),
 * it selects a new user using the Round Robin system and reassigns the client.
 * 
 * @param userId The ID of the user originally intended for the task.
 * @param clientId The ID of the client related to the task. (Optional, for reassignment)
 * @returns The ID of the active user (either the original or the replacement).
 */
export async function ensureActiveUserOrGetReplacement(userId: number, clientId?: number): Promise<number> {
  // 1. Check if the original user is active
  const originalUser = mockDb.users.findUnique({
    where: { id: userId },
  });

  if (originalUser && originalUser.deleted_at === null) {
    return userId;
  }

  // 2. Original user is deleted (or doesn't exist), find replacement via Round Robin
  // Find all eligible users
  const eligibleUsers = mockDb.users.findMany({
    where: {
      round_robin: true,
      ready_for_leads: true,
      deleted_at: null,
    },
    orderBy: {
      round_robin_order: 'asc',
    },
  });

  if (eligibleUsers.length === 0) {
    console.error('No eligible users found for Round Robin assignment.');
    return userId; // Fallback to original even if deleted, if no others available
  }

  // Pick the one with the lowest order (should be the first in sorted list)
  const replacementUser = eligibleUsers[0];
  const totalUsers = eligibleUsers.length;

  // Update orders for ALL eligible users in the pool
  // Current #1 becomes #totalUsers. Others shift down.
  for (const user of eligibleUsers) {
    const newOrder = user.id === replacementUser.id ? totalUsers : (user.round_robin_order || 0) - 1;

    mockDb.users.update({
      where: { id: user.id },
      data: { round_robin_order: Math.max(1, newOrder) },
    });
  }

  // 3. Reassign the client (seller_id) if clientId is provided
  if (clientId) {
    mockDb.clients.update({
      where: { id: clientId },
      data: { seller_id: replacementUser.id },
    });

    // 4. Update the active lead if it exists
    mockDb.leads.updateMany({
      where: {
        customer_id: clientId,
        is_active: true,
      },
      data: {
        sales_rep_id: replacementUser.id,
      },
    });
  }

  return replacementUser.id;
}
