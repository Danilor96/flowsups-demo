import { z } from 'zod';
import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { storage } from '@/firebase/firebase.config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function POST(request: Request) {
  const formData = await request.formData();

  const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const vehicleSchema = z
    .object({
      entryStock: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      // general info
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
      // add new vehicle
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
      // title / license
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
      // key info
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
    })
    .refine(
      (data) => {
        return !(
          data.specialPrice &&
          data.specialPrice !== '0' &&
          (!data.specialPriceStartDate || !data.specialPriceEndDate)
        );
      },
      {
        message: 'Please enter a value',
        path: ['specialPriceStartDate', 'specialPriceEndDate'],
      },
    );

  const validatedData = vehicleSchema.safeParse({
    entryStock: formData.get('entryStock'),
    // general info
    salesType: formData.get('salesType'),
    stockNo: formData.get('stockNo'),
    dateInStock: formData.get('dateInStock'),
    readyToShell: formData.get('readyToShell'),
    location: formData.get('location'),
    condition: formData.get('condition'),
    inspectionStatus: formData.get('inspectionStatus'),
    emissionStatus: formData.get('emissionStatus'),
    purchaseDate: formData.get('purchaseDate'),
    purchaseDetail: formData.get('purchaseDetail'),
    acqMillIn: formData.get('acqMillIn'),
    acqMillType: formData.get('acqMillType'),
    buyer: formData.get('buyer'),
    source: formData.get('source'),
    purchaseFrom: formData.get('purchaseFrom'),
    howDidYouPay: formData.get('howDidYouPay'),
    inspectionDate: formData.get('inspectionDate'),
    inspectionId: formData.get('inspectionId'),
    inspectionBy: formData.get('inspectionBy'),
    emissionDate: formData.get('emissionDate'),
    // add new vehicle
    status: formData.get('status'),
    customStatus: formData.get('customStatus'),
    newUsed: formData.get('newUsed'),
    vehicleType: formData.get('vehicleType'),
    vin: formData.get('vin'),
    odometer: formData.get('odometer'),
    make1: formData.get('make1'),
    year: formData.get('year'),
    make2: formData.get('make2'),
    model: formData.get('model'),
    trim: formData.get('trim'),
    engine: formData.get('engine'),
    transmission: formData.get('transmission'),
    driveTrain: formData.get('driveTrain'),
    door: formData.get('door'),
    cylinder: formData.get('cylinder'),
    bodyType: formData.get('bodyType'),
    fuelType: formData.get('fuelType'),
    horsePower: formData.get('horsePower'),
    exterior: formData.get('exterior'),
    interior: formData.get('interior'),
    mpgCity: formData.get('mpgCity'),
    hwy: formData.get('hwy'),
    vehicleWeight: formData.get('vehicleWeight'),
    gvw: formData.get('gvw'),
    vehicleImage: formData.get('vehicleImage'),
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
    // key info
    decalNo: formData.get('decalNo'),
    ignitionCode: formData.get('ignitionCode'),
    doorKeyCode: formData.get('doorKeyCode'),
    valetKeyCode: formData.get('valetKeyCode'),
    duplicateKey: formData.get('duplicateKey'),
    lienholder: formData.get('lienholder'),
    lienAccountNo: formData.get('lienAccountNo'),
    payoffAmount: formData.get('payoffAmount'),
    dueDate: formData.get('dueDate'),
    datePaidOff: formData.get('datePaidOff'),
    paymentMethod: formData.get('paymentMethod'),
    perDiem: formData.get('perDiem'),
    memo: formData.get('memo'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const {
    entryStock,
    salesType,
    stockNo,
    dateInStock,
    readyToShell,
    location,
    condition,
    inspectionStatus,
    emissionStatus,
    purchaseDate,
    purchaseDetail,
    acqMillIn,
    acqMillType,
    buyer,
    source,
    purchaseFrom,
    howDidYouPay,
    inspectionDate,
    inspectionId,
    inspectionBy,
    emissionDate,
    status,
    customStatus,
    newUsed,
    vehicleType,
    vin,
    odometer,
    make1,
    year,
    make2,
    model,
    trim,
    engine,
    transmission,
    driveTrain,
    door,
    cylinder,
    bodyType,
    fuelType,
    horsePower,
    exterior,
    interior,
    mpgCity,
    hwy,
    vehicleWeight,
    gvw,
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
    specialPriceEndDate,
    specialPriceStartDate,
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
    vehicleImage,
    decalNo,
    ignitionCode,
    doorKeyCode,
    valetKeyCode,
    duplicateKey,
    lienholder,
    lienAccountNo,
    payoffAmount,
    dueDate,
    datePaidOff,
    paymentMethod,
    perDiem,
    memo,
    buyerFee,
    lotFee,
  } = validatedData.data;

  try {
    let inspId: any = false;

    if (inspectionStatus && inspectionDate && inspectionId && inspectionBy) {
      const inspection = await prisma.inspection_status_data.create({
        data: {
          status_id: parseInt(inspectionStatus),
          date: new Date(inspectionDate),
          id_of_status: inspectionId,
          inspected_by: inspectionBy,
        },
      });

      inspId = inspection.id;
    }

    let emissId: any = false;

    if (emissionStatus && emissionDate) {
      const emission = await prisma.emission_status_data.create({
        data: {
          status_id: parseInt(emissionStatus),
          date: new Date(emissionDate),
        },
      });

      emissId = emission.id;
    }

    const generalInfo = await prisma.general_info.create({
      data: {
        stock_no: stockNo,
        date_in_stock: new Date(dateInStock),
        ready_to_shell: new Date(readyToShell),
        location: location,
        emission_status_id: emissId ? emissId : null,
        inspection_status_id: inspId ? inspId : null,
        condition_id: parseInt(condition),
        sales_type_id: parseInt(salesType),
      },
    });

    const purchaseInfo = await prisma.vehicle_details_purchase_info.create({
      data: {
        purchase_date: new Date(purchaseDate),
        purchase_detail: purchaseDetail,
        acq_mill_in: acqMillIn,
        acq_mill_type_id: parseInt(acqMillType),
        buyer: buyer,
        source_id: parseInt(source),
        purchase_from: purchaseFrom,
        how_did_you_pay: howDidYouPay,
      },
    });

    const titleLicense = await prisma.vehicle_details_title_license.create({
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
        special_price_start_date: specialPriceEndDate ? new Date(specialPriceEndDate) : null,
        special_price_end_date: specialPriceStartDate ? new Date(specialPriceStartDate) : null,
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

    let keyInfo: any = undefined;

    if (
      decalNo ||
      ignitionCode ||
      doorKeyCode ||
      valetKeyCode ||
      duplicateKey ||
      lienholder ||
      lienAccountNo ||
      payoffAmount ||
      dueDate ||
      datePaidOff ||
      paymentMethod ||
      perDiem ||
      memo
    ) {
      keyInfo = await prisma.vehicle_details_key_info.create({
        data: {
          decal_no: decalNo,
          ignition_code: ignitionCode,
          door_key_code: doorKeyCode,
          valet_key_code: valetKeyCode,
          duplicate_key: duplicateKey === '1' ? true : false,
          lienholder: lienholder,
          lien_account_no: lienAccountNo,
          payoff_amount: payoffAmount,
          due_date: dueDate ? new Date(dueDate) : null,
          date_paid_off: datePaidOff ? new Date(datePaidOff) : null,
          payment_method_id: paymentMethod ? parseInt(paymentMethod) : undefined,
          per_diem: perDiem,
          memo: memo,
        },
      });
    }

    const make = await prisma.vehicle_make.upsert({
      where: { brand: make2.toLowerCase().trim() },
      update: {},
      create: {
        brand: make2.toLowerCase().trim(),
      },
    });

    const vehicleModel = await prisma.vehicle_models.upsert({
      where: { model: model.toLowerCase().trim() },
      update: {},
      create: {
        model: model.toLowerCase().trim(),
      },
    });

    let vehicleTrim: any = undefined;

    if (trim) {
      vehicleTrim = await prisma.vehicle_trim.upsert({
        where: { trim: trim.toLowerCase().trim() },
        update: {},
        create: {
          trim: trim.toLowerCase().trim(),
        },
      });
    }

    const vehicleYear = await prisma.vehicle_manufacture_years.upsert({
      where: { year: year.toLowerCase().trim() },
      update: {},
      create: {
        year: year.toLowerCase().trim(),
      },
    });

    const vehicleBodyType = await prisma.vehicle_body_types.upsert({
      where: { type: bodyType.toLowerCase().trim() },
      update: {},
      create: {
        type: bodyType.toLowerCase().trim(),
      },
    });

    const vehicleEngine = await prisma.vehicle_engine.upsert({
      where: { engine: engine.toLowerCase().trim() },
      update: {},
      create: {
        engine: engine.toLowerCase().trim(),
      },
    });

    let vehicleImg: any = null;

    if (vehicleImage) {
      const fileRef = ref(storage, `images/${vehicleImage.name}`);
      const doUpload = await uploadBytes(fileRef, vehicleImage);

      const path = await getDownloadURL(doUpload.ref);

      vehicleImg = await prisma.vehicle_image.create({
        data: {
          path: path,
        },
      });
    }

    const vehicleIdentification = await prisma.vehicle_identification_numbers.create({
      data: {
        vin: vin,
      },
    });

    const vehicle = await prisma.vehicles.create({
      data: {
        stock_no: stockNo,
        cylinder: cylinder,
        doors: door,
        gvw: gvw,
        hwy: hwy,
        motor: horsePower,
        mpg_city: mpgCity,
        odometer: odometer,
        odometer_make_id: parseInt(make1),
        weight: vehicleWeight,
        body_type_id: vehicleBodyType.id,
        condition_id: parseInt(newUsed),
        drive_train_id: parseInt(driveTrain),
        engine_id: vehicleEngine.id,
        customer_status: customStatus,
        exterior_color_id: parseInt(exterior),
        fuel_tank_type_id: parseInt(fuelType),
        identification_id: vehicleIdentification.id,
        image_id: vehicleImg ? (vehicleImg.id ? vehicleImg.id : null) : null,
        interior_color_id: parseInt(interior),
        make_id: make.id,
        model_id: vehicleModel.id,
        entry_stock: new Date(entryStock),
        transmission_id: parseInt(transmission),
        trim_id: vehicleTrim ? vehicleTrim.id : null,
        vehicle_status_id: parseInt(status),
        vehicle_type_id: parseInt(vehicleType),
        manufacture_year_id: vehicleYear.id,
        key_info_id: keyInfo.id,
        title_license_id: titleLicense.id,
        vehicle_general_info_id: generalInfo.id,
        vehicle_purchase_info_id: purchaseInfo.id,
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Vehicle Successfully Registered' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const excludeSold = searchParams.get('excludeSold') === 'true';

  try {
    const data = await prisma.vehicles.findMany({
      where: excludeSold
        ? {
            OR: [{ vehicle_status_id: { not: 3 } }, { vehicle_status_id: null }],
          }
        : {},
      orderBy: {
        vehicle_status_id: 'asc',
      },
      include: {
        general_info: {
          include: {
            emission: true,
            inspection: true,
            sales_category: true,
          },
        },
        purchase_info: true,
        title_license: true,
        key_info: true,
        vehicle_identification_numbers: true,
        vehicle_status: true,
        vehicle_brands: true,
        exterior_vehicle_colors: true,
        interior_vehicle_colors: true,
        vehicle_models: true,
        vehicle_manufacture_years: true,
        vehicle_trim: true,
        vehicle_engine: true,
        vehicle_image: true,
        body_type: true,
        vehicle_transmissions: true,
        vehicle_prices: true,
        vehicle_fuel_tank_types: true,
        vehicle_conditions: true,
        vehicle_mileages: true,
        vehicle_drive_train: true,
        vehicle_type: true,
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
