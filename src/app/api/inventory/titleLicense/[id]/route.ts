import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const vehicleId = parseInt(params.id);

  const formData = await request.formData();

  const vehicleSchema = z
    .object({
      titleOwner: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      rosTitle: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      titleState: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      titleStatus: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      titleBrand: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      licenseNo: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      licenseState: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      licenseExpiration: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      askingPrice: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      wholePrice: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      adversiting: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      floorPrice: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      specialPrice: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      specialPriceStartDate: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .nullable(),
      specialPriceEndDate: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .nullable(),
      buyNowPrice: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      msrp: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      startBid: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      minDown: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      startBid2: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      minDeposit: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
      bidIncrement: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
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

  const validatedData = vehicleSchema.safeParse({
    // title / license
    titleOwner: formData.get('titleOwner'),
    rosTitle: formData.get('rosTitle'),
    titleState: formData.get('titleState'),
    titleStatus: formData.get('titleStatus'),
    titleBrand: formData.get('titleBrand'),
    licenseNo: formData.get('licenseNo'),
    licenseState: formData.get('licenseState'),
    licenseExpiration: formData.get('licenseExpiration'),
    askingPrice: formData.get('askingPrice'),
    wholePrice: formData.get('wholePrice'),
    adversiting: formData.get('adversiting'),
    floorPrice: formData.get('floorPrice'),
    specialPrice: formData.get('specialPrice'),
    specialPriceStartDate: formData.get('specialPriceStartDate'),
    specialPriceEndDate: formData.get('specialPriceEndDate'),
    buyNowPrice: formData.get('buyNowPrice'),
    msrp: formData.get('msrp'),
    startBid: formData.get('startBid'),
    minDown: formData.get('minDown'),
    startBid2: formData.get('startBid2'),
    minDeposit: formData.get('minDeposit'),
    bidIncrement: formData.get('bidIncrement'),
    vehicleCost: formData.get('vehicleCost'),
    costAdds: formData.get('costAdds'),
    packs: formData.get('packs'),
    additional: formData.get('additional'),
    buyerFee: formData.get('buyerFee'),
    lotFee: formData.get('lotFee'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const {
    titleOwner,
    rosTitle,
    titleState,
    titleStatus,
    titleBrand,
    licenseNo,
    licenseState,
    licenseExpiration,
    askingPrice,
    wholePrice,
    adversiting,
    floorPrice,
    specialPrice,
    specialPriceStartDate,
    specialPriceEndDate,
    buyNowPrice,
    msrp,
    startBid,
    minDown,
    startBid2,
    minDeposit,
    bidIncrement,
    vehicleCost,
    costAdds,
    packs,
    additional,
  } = validatedData.data;

  try {
    const vehicle = mockDb.vehicles.findUnique({
      where: {
        id: vehicleId,
      },
    });

    if (vehicle?.title_license_id) {
      const data = mockDb.vehicle_details_title_license.update({
        where: {
          id: vehicle.title_license_id,
        },
        data: {
          title_owner: titleOwner,
          ros_title: rosTitle,
          title_state_id: titleState ? parseInt(titleState) : null,
          title_status_id: titleStatus ? parseInt(titleStatus) : null,
          title_brand_id: titleBrand ? parseInt(titleBrand) : null,
          license_no: licenseNo,
          license_state_id: licenseState ? parseInt(licenseState) : null,
          license_expiration: licenseExpiration ? new Date(licenseExpiration) : null,
          asking_price: askingPrice,
          whole_price: wholePrice,
          adversiting: adversiting,
          floor_price: floorPrice,
          special_price: specialPrice,
          special_price_start_date: specialPriceStartDate ? new Date(specialPriceStartDate) : null,
          special_price_end_date: specialPriceEndDate ? new Date(specialPriceEndDate) : null,
          buy_now_price: buyNowPrice,
          msrp: msrp,
          start_bid: startBid,
          min_down: minDown,
          start_bid_2: startBid2,
          min_deposit: minDeposit,
          bid_increment: bidIncrement,
          vehicle_cost: vehicleCost,
          cost_adds: costAdds,
          packs: packs,
          additional: additional,
        },
      });
    } else {
      const newData = mockDb.vehicle_details_title_license.create({
        data: {
          title_owner: titleOwner,
          ros_title: rosTitle,
          title_state_id: titleState ? parseInt(titleState) : null,
          title_status_id: titleStatus ? parseInt(titleStatus) : null,
          title_brand_id: titleBrand ? parseInt(titleBrand) : null,
          license_no: licenseNo,
          license_state_id: licenseState ? parseInt(licenseState) : null,
          license_expiration: licenseExpiration ? new Date(licenseExpiration) : null,
          asking_price: askingPrice,
          whole_price: wholePrice,
          adversiting: adversiting,
          floor_price: floorPrice,
          special_price: specialPrice,
          special_price_start_date: specialPriceStartDate ? new Date(specialPriceStartDate) : null,
          special_price_end_date: specialPriceEndDate ? new Date(specialPriceEndDate) : null,
          buy_now_price: buyNowPrice,
          msrp: msrp,
          start_bid: startBid,
          min_down: minDown,
          start_bid_2: startBid2,
          min_deposit: minDeposit,
          bid_increment: bidIncrement,
          vehicle_cost: vehicleCost,
          cost_adds: costAdds,
          packs: packs,
          additional: additional,
        },
      });

      const newDataReference = mockDb.vehicles.update({
        where: {
          id: vehicle?.id,
        },
        data: {
          title_license_id: newData.id,
        },
      });
    }

    return NextResponse.json({ successMessage: 'Data Successfully Updated' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
