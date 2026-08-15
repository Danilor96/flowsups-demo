import { seedUsers } from './users';

export const seedTaskNotes = [
  {
    id: 1,
    note: 'Initial task note',
    created_by_id: 1,
    created_at: new Date('2026-08-11T14:00:00.000Z'),
    task_id: 1,
    user: {
      id: 1,
      name: seedUsers[0].name,
      last_name: seedUsers[0].last_name,
    },
  },
];
