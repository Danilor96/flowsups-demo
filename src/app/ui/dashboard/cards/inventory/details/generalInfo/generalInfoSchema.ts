import { z } from 'zod';

export const generalInfoSchema = z.object({
  salesType: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  stockNo: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  dateInStock: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  readyToShell: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  location: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  condition: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  inspectionStatus: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  emissionStatus: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  purchaseDate: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  purchaseDetail: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  acqMillIn: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  acqMillType: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  buyer: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  source: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  purchaseFrom: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  howDidYouPay: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  inspectionDate: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  inspectionId: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  inspectionBy: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  emissionDate: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
});
