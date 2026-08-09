import { z } from 'zod';

export const keyInfoSchema = z.object({
  decalNo: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  ignitionCode: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  doorKeyCode: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  valetKeyCode: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  duplicateKey: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  lienholder: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  lienAccountNo: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  payoffAmount: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  dueDate: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  datePaidOff: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  paymentMethod: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  perDiem: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  memo: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
});
