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