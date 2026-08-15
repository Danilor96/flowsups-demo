export const DEMO_EMAIL = 'demo@flowsups.com';
export const DEMO_PASSWORD = 'demo1234';

import { Decimal } from '../decimal';
import { seedUserStatuses } from './settings';

export const allPermissionIds = Array.from({ length: 55 }, (_, index) => index + 1);

const adminPermissionIds = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
  31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
];

const salesManagerPermissionIds = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 17, 18, 19, 20, 23, 25, 26, 29, 31, 33, 36, 38, 44, 45, 46, 47,
  48, 49, 50,
];

const financeManagerPermissionIds = [
  1, 2, 5, 8, 9, 12, 14, 16, 17, 18, 19, 20, 25, 26, 31, 44, 45, 46, 47, 48, 49, 50,
];

const bdcPermissionIds = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 17, 18, 19, 20, 23, 29, 31, 44, 45, 46, 47, 48, 49, 50,
];

const salesRepPermissionIds = [
  1, 2, 4, 5, 7, 8, 9, 10, 12, 14, 16, 17, 18, 19, 20, 23, 25, 26, 29, 31, 44, 45, 46, 47, 48, 49, 50,
];

const demoPasswordHash = '$2a$10$N.IKX6CzI7gj2OMaoC21Tec.dC4ddzi0ot15yTWMKLTQgbCMNFUNa';

export const seedUsers = [
  {
    id: 1,
    email: DEMO_EMAIL,
    name: 'Demo',
    last_name: 'User',
    username: 'demo',
    password: demoPasswordHash,
    created_at: new Date('2025-01-01T09:00:00.000Z'),
    updated_at: new Date('2026-08-01T09:00:00.000Z'),
    emailVerified: null,
    sessions_expires: null,
    mobile_phone: '3055550101',
    img: '',
    status_id: 1,
    round_robin: true,
    ready_for_leads: true,
    round_robin_order: 1,
    monthly_vehicle_sales_goal: 12,
    sales_points_total: 320,
    sales_points_today: 5,
    sales_points_today_date: new Date(),
    daily_points_target: 10,
    deleted_at: null,
    deleted_by_id: null,
    session_version: 1,
    user_has: [
      {
        role_id: 1,
        role: {
          role: 'Superuser',
          roles_has: [{ permission_id: allPermissionIds }],
        },
      },
    ],
  },
  {
    id: 2,
    email: 'sarah.mitchell@flowsups.com',
    name: 'Sarah',
    last_name: 'Mitchell',
    username: 'sarah.mitchell',
    password: demoPasswordHash,
    created_at: new Date('2025-02-15T09:00:00.000Z'),
    updated_at: new Date('2026-07-20T09:00:00.000Z'),
    emailVerified: null,
    sessions_expires: null,
    mobile_phone: '3055550102',
    img: '',
    status_id: 1,
    round_robin: true,
    ready_for_leads: true,
    round_robin_order: 2,
    monthly_vehicle_sales_goal: 10,
    sales_points_total: 250,
    sales_points_today: 3,
    sales_points_today_date: new Date(),
    daily_points_target: 8,
    deleted_at: null,
    deleted_by_id: null,
    session_version: 1,
    user_has: [
      {
        role_id: 6,
        role: {
          role: 'Sales Rep',
          roles_has: [{ permission_id: salesRepPermissionIds }],
        },
      },
    ],
  },
  {
    id: 3,
    email: 'james.carter@flowsups.com',
    name: 'James',
    last_name: 'Carter',
    username: 'james.carter',
    password: demoPasswordHash,
    created_at: new Date('2025-03-10T09:00:00.000Z'),
    updated_at: new Date('2026-06-15T09:00:00.000Z'),
    emailVerified: null,
    sessions_expires: null,
    mobile_phone: '3055550103',
    img: '',
    status_id: 1,
    round_robin: true,
    ready_for_leads: true,
    round_robin_order: 3,
    monthly_vehicle_sales_goal: 8,
    sales_points_total: 180,
    sales_points_today: 2,
    sales_points_today_date: new Date(),
    daily_points_target: 6,
    deleted_at: null,
    deleted_by_id: null,
    session_version: 1,
    user_has: [
      {
        role_id: 6,
        role: {
          role: 'Sales Rep',
          roles_has: [{ permission_id: salesRepPermissionIds }],
        },
      },
    ],
  },
  {
    id: 4,
    email: 'linda.reyes@flowsups.com',
    name: 'Linda',
    last_name: 'Reyes',
    username: 'linda.reyes',
    password: demoPasswordHash,
    created_at: new Date('2025-01-20T09:00:00.000Z'),
    updated_at: new Date('2026-07-01T09:00:00.000Z'),
    emailVerified: null,
    sessions_expires: null,
    mobile_phone: '3055550104',
    img: '',
    status_id: 1,
    round_robin: false,
    ready_for_leads: true,
    round_robin_order: null,
    monthly_vehicle_sales_goal: 15,
    sales_points_total: 400,
    sales_points_today: 8,
    sales_points_today_date: new Date(),
    daily_points_target: 12,
    deleted_at: null,
    deleted_by_id: null,
    session_version: 1,
    user_has: [
      {
        role_id: 3,
        role: {
          role: 'Sales Manager',
          roles_has: [{ permission_id: salesManagerPermissionIds }],
        },
      },
    ],
  },
  {
    id: 5,
    email: 'robert.foster@flowsups.com',
    name: 'Robert',
    last_name: 'Foster',
    username: 'robert.foster',
    password: demoPasswordHash,
    created_at: new Date('2025-04-05T09:00:00.000Z'),
    updated_at: new Date('2026-05-30T09:00:00.000Z'),
    emailVerified: null,
    sessions_expires: null,
    mobile_phone: '3055550105',
    img: '',
    status_id: 1,
    round_robin: false,
    ready_for_leads: true,
    round_robin_order: null,
    monthly_vehicle_sales_goal: null,
    sales_points_total: 150,
    sales_points_today: 1,
    sales_points_today_date: new Date(),
    daily_points_target: 5,
    deleted_at: null,
    deleted_by_id: null,
    session_version: 1,
    user_has: [
      {
        role_id: 4,
        role: {
          role: 'Finance Manager',
          roles_has: [{ permission_id: financeManagerPermissionIds }],
        },
      },
    ],
  },
  {
    id: 6,
    email: 'maria.santos@flowsups.com',
    name: 'Maria',
    last_name: 'Santos',
    username: 'maria.santos',
    password: demoPasswordHash,
    created_at: new Date('2025-02-01T09:00:00.000Z'),
    updated_at: new Date('2026-07-25T09:00:00.000Z'),
    emailVerified: null,
    sessions_expires: null,
    mobile_phone: '3055550106',
    img: '',
    status_id: 1,
    round_robin: true,
    ready_for_leads: true,
    round_robin_order: 4,
    monthly_vehicle_sales_goal: 10,
    sales_points_total: 220,
    sales_points_today: 4,
    sales_points_today_date: new Date(),
    daily_points_target: 7,
    deleted_at: null,
    deleted_by_id: null,
    session_version: 1,
    user_has: [
      {
        role_id: 5,
        role: {
          role: 'BDC',
          roles_has: [{ permission_id: bdcPermissionIds }],
        },
      },
    ],
  },
  {
    id: 7,
    email: 'david.hill@flowsups.com',
    name: 'David',
    last_name: 'Hill',
    username: 'david.hill',
    password: demoPasswordHash,
    created_at: new Date('2025-05-12T09:00:00.000Z'),
    updated_at: new Date('2026-06-20T09:00:00.000Z'),
    emailVerified: null,
    sessions_expires: null,
    mobile_phone: '3055550107',
    img: '',
    status_id: 1,
    round_robin: true,
    ready_for_leads: true,
    round_robin_order: 5,
    monthly_vehicle_sales_goal: 6,
    sales_points_total: 90,
    sales_points_today: 1,
    sales_points_today_date: new Date(),
    daily_points_target: 4,
    deleted_at: null,
    deleted_by_id: null,
    session_version: 1,
    user_has: [
      {
        role_id: 6,
        role: {
          role: 'Sales Rep',
          roles_has: [{ permission_id: salesRepPermissionIds }],
        },
      },
    ],
  },
  {
    id: 8,
    email: 'angela.diaz@flowsups.com',
    name: 'Angela',
    last_name: 'Diaz',
    username: 'angela.diaz',
    password: demoPasswordHash,
    created_at: new Date('2025-06-01T09:00:00.000Z'),
    updated_at: new Date('2026-07-10T09:00:00.000Z'),
    emailVerified: null,
    sessions_expires: null,
    mobile_phone: '3055550108',
    img: '',
    status_id: 1,
    round_robin: false,
    ready_for_leads: true,
    round_robin_order: null,
    monthly_vehicle_sales_goal: null,
    sales_points_total: 60,
    sales_points_today: 0,
    sales_points_today_date: new Date(),
    daily_points_target: 3,
    deleted_at: null,
    deleted_by_id: null,
    session_version: 1,
    user_has: [
      {
        role_id: 2,
        role: {
          role: 'Administrator',
          roles_has: [{ permission_id: adminPermissionIds }],
        },
      },
    ],
  },
];

seedUsers.forEach((user: any) => {
  user._count = { sms_sender: 3 };
  user.pay_plan = { of_cash_down: '0.5' };
  user.monthly_goals = [];
  user.client_seller = [];
  user.client_sales_manager = [];
  user.users_status = seedUserStatuses.find((s) => s.id === user.status_id) || null;
  if ([1, 2, 3, 6, 7].includes(user.id)) {
    user.comissionInfo = {
      bonus: [
        {
          id: user.id,
          amount: Decimal(500),
          description: 'Monthly bonus',
          comission_info_id: user.id,
        },
      ],
      salary: [
        {
          id: user.id,
          amount: Decimal(1500),
          description: 'Base salary',
          comission_info_id: user.id,
        },
      ],
      spiff: [
        {
          id: user.id,
          amount: Decimal(200),
          description: 'Spiff',
          comission_info_id: user.id,
        },
      ],
    };
  }
});

(seedUsers[1] as any).client_seller = [
  { id: 6, client_status_id: 10, first_name: 'Luis', last_name: 'Alvarez' },
  { id: 7, client_status_id: 1, first_name: 'Maria', last_name: 'Gonzalez' },
];
(seedUsers[2] as any).client_seller = [
  { id: 10, client_status_id: 11, first_name: 'David', last_name: 'Wilson' },
];
(seedUsers[1] as any).monthly_goals = [
  {
    id: 1,
    sales_goal: Decimal(10),
    date_month: new Date('2026-08-01T00:00:00.000Z'),
    created_at: new Date('2026-08-01T00:00:00.000Z'),
    business_id: 1,
    user_id: 2,
  },
];

export const seedUserSchedules = [
  {
    id: 1,
    dayweek_id: 1,
    from_day_times_id: 1,
    to_day_times_id: 8,
    user_id: 2,
    active: true,
  },
  {
    id: 2,
    dayweek_id: 2,
    from_day_times_id: 1,
    to_day_times_id: 8,
    user_id: 2,
    active: true,
  },
  {
    id: 3,
    dayweek_id: 3,
    from_day_times_id: 1,
    to_day_times_id: 8,
    user_id: 2,
    active: true,
  },
  {
    id: 4,
    dayweek_id: 4,
    from_day_times_id: 1,
    to_day_times_id: 8,
    user_id: 2,
    active: true,
  },
  {
    id: 5,
    dayweek_id: 5,
    from_day_times_id: 1,
    to_day_times_id: 8,
    user_id: 2,
    active: true,
  },
];
