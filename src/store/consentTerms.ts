import { ConsentTermChecks, ConsentTermStatement } from '@/app/libs/definitions';
import { create } from 'zustand';

interface ConsentTerms {
  statement: ConsentTermStatement;
  checks: ConsentTermChecks;
  getStatement: () => Promise<void>;
  getChecks: () => Promise<void>;
}

export const useConsentTermsStore = create<ConsentTerms>((set) => ({
  checks: [],
  statement: null,
  async getChecks() {
    const res = await fetch('/api/consentTerms/checks');

    const json = await res.json();

    set({ checks: json });
  },
  async getStatement() {
    const res = await fetch('/api/consentTerms/statement');

    const json = await res.json();

    set({ statement: json });
  },
}));
