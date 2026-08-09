import { Round_robin, Time_span } from '@prisma/client';

export const getRaundRobinSettings = async () => {
  const roundRobinSettings: Round_robin = await (
    await fetch('/api/adminDashboard/roundRobin', { cache: 'no-store' })
  ).json();
  return roundRobinSettings;
};

export const getTimeSpan = async () => {
  const timeSpan: Time_span[] = await (await fetch('/api/adminDashboard/timeSpan', { cache: 'no-store' })).json();
  return timeSpan;
};

export const saveRaundRobinSettings = async (id: string, data: FormData) => {
  const response = await fetch(`/api/adminDashboard/roundRobin/${id}`, {
    method: 'PUT',
    body: data
  });
  return await response.json();
};

export const updateUserInRoundRobinList = async (
  userId: string,
  { isEnabled, readyForLeads }: { isEnabled?: boolean; readyForLeads?: boolean }
) => {
  const formData = new FormData();
  formData.append('roundRobin', isEnabled ? '1' : '0');
  formData.append('readyForLeads', readyForLeads ? '1' : '0');
  const response = await fetch(`/api/adminDashboard/roundRobin/user/${userId}`, {
    method: 'PUT',
    body: formData
  });
  return await response.json();
};
