import { z } from 'zod';

export const titleLicenseSchema = z
  .object({
    titleOwner: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    rosTitle: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    titleState: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    titleStatus: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    titleBrand: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    licenseNo: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    licenseState: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    licenseExpiration: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    askingPrice: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    wholePrice: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    adversiting: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    floorPrice: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    specialPrice: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    specialPriceStartDate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    specialPriceEndDate: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    buyNowPrice: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    msrp: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    startBid: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    minDown: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    startBid2: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    minDeposit: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    bidIncrement: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    vehicleCost: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    costAdds: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    packs: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    additional: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    buyerFee: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    lotFee: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
  })
  .refine(
    (data) => {
      return !(data.specialPrice && (!data.specialPriceStartDate || !data.specialPriceEndDate));
    },
    {
      message: 'Please enter a value',
      path: ['specialPriceStartDate', 'specialPriceEndDate'],
    },
  );
