import { allPermissionIds } from './users';

export const seedRoles = [
  { id: 1, role: 'Superuser', status_id: 1, created_by: 1, created_at: new Date('2025-01-01T09:00:00.000Z') },
  { id: 2, role: 'Administrator', status_id: 1, created_by: 1, created_at: new Date('2025-01-01T09:00:00.000Z') },
  { id: 3, role: 'Sales Manager', status_id: 1, created_by: 1, created_at: new Date('2025-01-01T09:00:00.000Z') },
  { id: 4, role: 'Finance Manager', status_id: 1, created_by: 1, created_at: new Date('2025-01-01T09:00:00.000Z') },
  { id: 5, role: 'BDC', status_id: 1, created_by: 1, created_at: new Date('2025-01-01T09:00:00.000Z') },
  { id: 6, role: 'Sales Rep', status_id: 1, created_by: 1, created_at: new Date('2025-01-01T09:00:00.000Z') },
];

export const seedPermissions = [
  { id: 1, permission: 'All' },
  { id: 2, permission: 'Place client in showroom' },
  { id: 3, permission: 'Cancel appointment with explanation' },
  { id: 4, permission: 'Request appointment date change' },
  { id: 5, permission: 'Send appointment confirmation message' },
  { id: 6, permission: 'Accept or decline cancellation request' },
  { id: 7, permission: 'Accept or change appointment date' },
  { id: 8, permission: 'Visit Button' },
  { id: 9, permission: 'Open Task Detail' },
  { id: 10, permission: 'Complete All Task' },
  { id: 11, permission: 'Cancel All Task' },
  { id: 12, permission: 'Task Detail: complete task' },
  ...Array.from({ length: 43 }, (_, index) => ({ id: index + 13, permission: `Permission ${index + 13}` })),
];

export const seedRolesHasPermissions = [
  { id: 1, role_id: 1, permission_id: allPermissionIds },
  {
    id: 2,
    role_id: 2,
    permission_id: [
      2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
      32, 33, 34, 35, 36, 37, 38, 39, 40,
    ],
  },
  {
    id: 3,
    role_id: 3,
    permission_id: [
      2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 17, 18, 19, 20, 23, 25, 26, 29, 31, 33, 36, 38, 44, 45, 46, 47,
      48, 49, 50,
    ],
  },
  {
    id: 4,
    role_id: 4,
    permission_id: [2, 5, 8, 9, 12, 14, 16, 17, 18, 19, 20, 25, 26, 31, 44, 45, 46, 47, 48, 49, 50],
  },
  {
    id: 5,
    role_id: 5,
    permission_id: [
      2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 17, 18, 19, 20, 23, 29, 31, 44, 45, 46, 47, 48, 49, 50,
    ],
  },
  {
    id: 6,
    role_id: 6,
    permission_id: [2, 4, 5, 7, 8, 9, 10, 12, 14, 16, 17, 18, 19, 20, 23, 25, 26, 29, 31, 44, 45, 46, 47, 48, 49, 50],
  },
];
