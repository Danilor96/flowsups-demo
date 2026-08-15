export const seedEvents = [
  {
    id: 1,
    description: 'Email sent',
    updated_at: '2026-08-11T16:00:00.000Z',
    updated_by: 1,
    client_id: 1,
    event_creator: { id: 1, name: 'Demo', last_name: 'User' },
  },
  {
    id: 2,
    description: 'Appointment scheduled',
    updated_at: '2026-08-11T17:00:00.000Z',
    updated_by: 1,
    client_id: 2,
    event_creator: { id: 1, name: 'Demo', last_name: 'User' },
  },
  {
    id: 3,
    description: 'Customer marked as lost',
    updated_at: '2026-08-12T10:00:00.000Z',
    updated_by: 2,
    client_id: 3,
    event_creator: { id: 2, name: 'Sarah', last_name: 'Smith' },
  },
];

export const seedEventCategories = [
  { id: 1, category: 'Appointment' },
  { id: 2, category: 'Call' },
  { id: 3, category: 'Email' },
  { id: 4, category: 'SMS' },
  { id: 5, category: 'Visit' },
  { id: 6, category: 'Status Change' },
];

export const seedFollowupTaskVisibility = [
  { id: 1, followup: 'Everyone' },
  { id: 2, followup: 'Assigned to me' },
  { id: 3, followup: 'My team' },
];