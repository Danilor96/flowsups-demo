export const seedBusinessPhoneNumbers = [
  {
    id: 1,
    twilio_sid: 'PN11111111111111111111111111111111',
    phone_number: '+13055550101',
    friendly_name: 'Flowsups Main Line',
    business_id: 1,
    is_publishing_number: true,
  },
  {
    id: 2,
    twilio_sid: 'PN22222222222222222222222222222222',
    phone_number: '+13055550102',
    friendly_name: 'Flowsups BDC Line',
    business_id: 1,
    is_publishing_number: false,
  },
];

export const seedClientCalls = [
  {
    id: 1,
    client_id: 1,
    unknow_call_number: null,
    phone_number: '3055559001',
    user_id: [2],
    call_sid: 'CAmockcallsid0001',
    call_date: new Date('2026-08-01T14:00:00.000Z'),
    call_duration: '0',
    call_status_id: 6,
    call_direction_id: 1,
    answered_by_web: false,
    answered_by_mobile: true,
    usersAssignedCallSid: null,
    inboundCall: true,
    note_id: null,
    followUpDate: null,
    isBlockedForAnswering: false,
  },
  {
    id: 2,
    client_id: 2,
    unknow_call_number: null,
    phone_number: '3055559002',
    user_id: [3],
    call_sid: 'CAmockcallsid0002',
    call_date: new Date('2026-08-02T15:30:00.000Z'),
    call_duration: '120',
    call_status_id: 4,
    call_direction_id: 2,
    answered_by_web: true,
    answered_by_mobile: false,
    usersAssignedCallSid: null,
    inboundCall: false,
    note_id: null,
    followUpDate: null,
    isBlockedForAnswering: false,
  },
];

export const seedConferencesNames = [
  {
    id: 1,
    conference_name: 'conference.mock',
    answered: false,
  },
  {
    id: 2,
    conference_name: 'conference.mock.2',
    answered: false,
  },
];

import { seedClients } from './clients';
import { seedUsers } from './users';

seedClientCalls.forEach((call: any, index: number) => {
  const client = seedClients[call.client_id - 1];
  const caller = index === 0 ? seedUsers[1] : seedUsers[2];
  call.client_call = {
    id: client.id,
    first_name: client.first_name,
    last_name: client.last_name,
    client_status: client.client_status,
  };
  call.note = index === 0
    ? {
        created_at: new Date('2026-08-01T14:05:00.000Z'),
        created_by: { name: caller.name, last_name: caller.last_name },
        note: 'Inbound call handled, customer asked about financing options.',
      }
    : null;
  call.followUpDate = index === 1 ? new Date('2026-08-05T10:00:00.000Z') : null;
});