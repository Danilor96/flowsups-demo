const defaultHeaderUrl =
  'https://firebasestorage.googleapis.com/v0/b/flowsups-iles.appspot.com/o/images%2Fflowsups-header.png?alt=media';

const defaultFooterUrl =
  'https://firebasestorage.googleapis.com/v0/b/flowsups-iles.appspot.com/o/images%2Fflowsups-footer.png?alt=media';

const demoUser = {
  id: 1,
  email: 'demo@flowsups.com',
  name: 'Demo',
  last_name: 'User',
  username: 'demo',
  created_at: new Date('2025-01-01T09:00:00.000Z'),
};

export const seedEmailTemplates = [
  {
    id: 1,
    name: 'Appointment Reminder',
    category_id: 1,
    created_by: 1,
    created_at: new Date('2026-07-01T09:00:00.000Z'),
    published: true,
    header_id: 1,
    subject: 'Your upcoming appointment',
    body: 'Greetings {customer.first_name}, we look forward to seeing you at your appointment.',
    footer_id: 1,
    favorite: true,
    category: { id: 1, category: 'General' },
    user: demoUser,
    header: {
      id: 1,
      header: defaultHeaderUrl,
      name: 'Default Header',
      letterhead: { id: 1, header_id: 1, footer_id: 1 },
    },
    footer: { id: 1, footer: defaultFooterUrl, name: 'Default Footer' },
  },
  {
    id: 2,
    name: 'Thank You',
    category_id: 1,
    created_by: 1,
    created_at: new Date('2026-07-02T09:00:00.000Z'),
    published: true,
    header_id: 1,
    subject: 'Thank you for your visit',
    body: 'Thanks for visiting us, {customer.first_name}.',
    footer_id: 1,
    favorite: false,
    category: { id: 1, category: 'General' },
    user: demoUser,
    header: {
      id: 1,
      header: defaultHeaderUrl,
      name: 'Default Header',
      letterhead: { id: 1, header_id: 1, footer_id: 1 },
    },
    footer: { id: 1, footer: defaultFooterUrl, name: 'Default Footer' },
  },
  {
    id: 3,
    name: 'Generic',
    category_id: 2,
    created_by: 1,
    created_at: new Date('2026-07-03T09:00:00.000Z'),
    published: true,
    header_id: null,
    subject: 'Flowsups',
    body: 'Hello {customer.first_name},',
    footer_id: null,
    favorite: false,
    category: { id: 2, category: 'Sales' },
    user: demoUser,
    header: null,
    footer: null,
  },
];