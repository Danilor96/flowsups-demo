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