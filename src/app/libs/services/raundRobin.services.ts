type RoundRobinSettings = {
  id: number;
  ready_for_leads: boolean;
  automatic_reassign_leads: boolean;
  span_time_id: number | null;
  avoid_automatic_reassign_olders_leads: boolean;
  days_until_avoid: number | null;
  assign_leads_during_store_hours: boolean;
  assign_leads_during_shift_hours: boolean;
  users_must_activate_ready_for_leads: boolean;
  create_task_after_assign_new_lead: boolean;
};

type TimeSpan = {
  id: number;
  time_span: string;
};

export const getRaundRobinSettings = async () => {
  const roundRobinSettings: RoundRobinSettings = await (
    await fetch('/api/adminDashboard/roundRobin', { cache: 'no-store' })
  ).json();
  return roundRobinSettings;
};

export const getTimeSpan = async () => {
  const timeSpan: TimeSpan[] = await (await fetch('/api/adminDashboard/timeSpan', { cache: 'no-store' })).json();
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
