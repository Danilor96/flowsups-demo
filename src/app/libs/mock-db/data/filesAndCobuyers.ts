import { seedUsers } from './users';
import { seedClients } from './clients';

const demo = seedUsers[0];

export const seedFiles = [
  {
    id: 1,
    file: 'credit_app_docs.pdf',
    stipulation: 'Credit application documents',
    uploaded_on: new Date('2026-08-01T10:00:00.000Z'),
    uploaded_by: demo.id,
    path: '/mock/uploads/credit_app_docs.pdf',
    content_type: 'application/pdf',
    client_file: [
      {
        id: 1,
        file_id: 1,
        client_id: 1,
        uploader_user_id: demo.id,
        uploader_user: {
          id: demo.id,
          name: demo.name,
          last_name: demo.last_name,
        },
      },
    ],
  },
  {
    id: 2,
    file: 'drivers_license.jpg',
    stipulation: 'Copy of drivers license',
    uploaded_on: new Date('2026-08-03T14:30:00.000Z'),
    uploaded_by: demo.id,
    path: '/mock/uploads/drivers_license.jpg',
    content_type: 'image/jpeg',
    client_file: [
      {
        id: 2,
        file_id: 2,
        client_id: 2,
        uploader_user_id: demo.id,
        uploader_user: {
          id: demo.id,
          name: demo.name,
          last_name: demo.last_name,
        },
      },
    ],
  },
];

export const seedCobuyerClientRelationship = [
  { id: 1, relationship: 'Spouse' },
  { id: 2, relationship: 'Parent' },
  { id: 3, relationship: 'Sibling' },
  { id: 4, relationship: 'Business Partner' },
  { id: 5, relationship: 'Friend' },
];

export const seedClientHasCobuyer = [
  {
    id: 1,
    buyer_client_id: seedClients[0].id,
    cobuyer_client_id: seedClients[1].id,
    relationship_id: 1,
    cobuyer: {
      id: seedClients[1].id,
      name_lastname: seedClients[1].name_lastname,
      current_address: seedClients[1].current_address,
      home_phone: seedClients[1].home_phone,
      mobile_phone: seedClients[1].mobile_phone,
      work_phone: seedClients[1].work_phone,
      email: seedClients[1].email,
    },
    relationship: { id: 1, relationship: 'Spouse' },
  },
];