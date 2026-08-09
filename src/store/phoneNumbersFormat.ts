import { create } from 'zustand';

export interface PhoneNumberFormat {
  formatPhoneNumber: (value: string) => string;
  extractDigits: (value: string) => string;
  ssnFormat: (value: string) => string;
}

export const phoneNumbersFormatStore = create<PhoneNumberFormat>((set) => ({
  formatPhoneNumber: (value) => {
    if (!value) return '';
    const numericValue = value.replace(/\D/g, '');
    const customerContact = numericValue && numericValue.length > 10 ? numericValue.slice(-10) : numericValue;

    if (customerContact.length <= 3) {
      return `(${customerContact}`;
    }

    if (customerContact.length <= 6) {
      return `(${customerContact.slice(0, 3)}) ${customerContact.slice(3)}`;
    }

    return `(${customerContact.slice(0, 3)}) ${customerContact.slice(3, 6)}-${customerContact.slice(6)}`;
  },
  extractDigits: (value) => {
    return value.replace(/\D/g, '').slice(-10);
  },
  ssnFormat: (value) => {
    const number = value.replace(/\D/g, '').slice(0, 9);

    if (number.length <= 3) {
      return `${number.slice(0, 3)}`;
    }

    if (number.length <= 5) {
      return `${number.slice(0, 3)}-${number.slice(3, 5)}`;
    }

    return `${number.slice(0, 3)}-${number.slice(3, 5)}-${number.slice(5, 9)}`;
  },
}));
