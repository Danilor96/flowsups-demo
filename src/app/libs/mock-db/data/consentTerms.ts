export const seedConsentTerms = [
  {
    id: 1,
    consent_statement:
      'I agree that Flowsups may contact me by phone, email, and SMS regarding my vehicle inquiry and purchase. I understand consent is not a condition of purchase.',
    checks: [1, 2, 3],
  },
];

export const seedConsentChecks = [
  {
    id: 1,
    description: 'I agree to receive SMS messages about my inquiry and appointment.',
    required: true,
  },
  {
    id: 2,
    description: 'I agree to receive marketing offers and promotions by email.',
    required: false,
  },
  {
    id: 3,
    description: 'I understanding that I can opt out at any time.',
    required: false,
  },
];

export const seedConsentCodes = [
  {
    id: 1,
    customer_id: 1,
    token: 'DEMO123',
    code_expired: new Date('2027-01-01T00:00:00.000Z'),
  },
];

export const seedClientAddresses = [
  {
    id: 1,
    city: 'Miami',
    street: '1200 Coral Way',
    state_id: 11,
    zip: '33145',
    county_id: null,
    current_data_from_webhook: false,
  },
];

export const seedTermsAndConditionsProcessed = [
  {
    id: 1,
    description: 'I agree to receive SMS messages about my inquiry and appointment.',
    accepted: true,
    customer_id: 1,
    term_or_condition_id: 1,
    created_at: new Date('2026-07-20T14:30:00.000Z'),
    customerConsentLogsId: 1,
  },
];

export const seedCustomerConsentLogs = [
  {
    id: 1,
    phoneNumber: '3055552101',
    policyStatement:
      'I agree that Flowsups may contact me by phone, email, and SMS regarding my vehicle inquiry and purchase. I understand consent is not a condition of purchase.',
    customerId: 1,
    consentStatusId: 1,
    ipAddress: '127.0.0.1',
    userAgent: 'Demo Agent',
    createdAt: new Date('2026-07-20T14:30:00.000Z'),
    confirmedAt: null,
    sentSmsVerificationRecordId: null,
    receivedSmsVerificationRecordId: null,
  },
];