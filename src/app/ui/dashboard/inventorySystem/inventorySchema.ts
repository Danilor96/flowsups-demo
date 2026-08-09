import { z } from 'zod';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const vehicleSchema = z.object({
  status: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  customStatus: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  newUsed: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  vehicleType: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  vin: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(17, 'VIN must contain 17 characters')
    .max(17, 'VIN must contain 17 characters'),
  odometer: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  make1: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  year: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(4, 'Please enter a valid value')
    .max(4, 'Please enter a valid value'),
  make2: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  model: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  trim: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  engine: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  transmission: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  driveTrain: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  door: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  cylinder: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  bodyType: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  fuelType: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  horsePower: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  exterior: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  interior: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  mpgCity: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  hwy: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  vehicleWeight: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  gvw: z
    .string({ invalid_type_error: 'Please enter a valid value' })
    .min(1, 'Please enter a value'),
  vehicleImage: z
    .any()
    .refine((file: File) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Only .jpg, .jpeg, .png and .webp formats are supported',
    })
    .nullable(),
});
