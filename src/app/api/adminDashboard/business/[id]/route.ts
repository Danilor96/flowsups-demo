import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { storage } from '@/firebase/firebase.config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(46);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const businessId = parseInt(params.id);

  const formData = await request.formData();

  const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const businessSchema = z.object({
    county: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value')
      .nullish(),
    countyCode: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value')
      .nullish(),
    einNumber: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    email: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    faxNumber: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    maillingAddress: z.string({ invalid_type_error: 'Please enter a valid value' }).nullish(),
    salesTax: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    storeAlias: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    storeId: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    storeLicense: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    storeName: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    image: z
      .any()
      .refine(
        (file: File) =>
          !file || ACCEPTED_IMAGE_TYPES.includes(file.type) || typeof file === 'string',
        {
          message: 'Only .jpg, .jpeg, .png and .webp formats are supported',
        },
      )
      .optional(),
    isMailingAddressSameAsPhysical: z.string({ invalid_type_error: 'Please enter a valid value' }),
    full_address: z.string({ invalid_type_error: 'Please enter a valid value' }).min(1, 'Required'),
    street: z.string({ invalid_type_error: 'Please enter a valid value' }).min(1, 'Required'),
    city: z.string({ invalid_type_error: 'Please enter a valid value' }).min(1, 'Required'),
    state: z.string({ invalid_type_error: 'Please enter a valid value' }).min(1, 'Required'),
    zip: z.string({ invalid_type_error: 'Please enter a valid value' }).nullish(),
    stateId: z.string({ invalid_type_error: 'Please enter a valid value' }).min(1, 'required'),
    defaultAppointmentReminderId: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'please select a valid value')
      .nullish(),
    defaultTaskReminderId: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'please select a valid value')
      .nullish(),
    monthlySalesGoal: z.string().nullish(),
    dailySalesPointsTarget: z.string().nullish(),
    emailsSentNumber: z.string().nullish(),
    smssSentNumber: z.string().nullish(),
    callsMadeNumber: z.string().nullish(),
    appointmentsCompletedNumber: z.string().nullish(),
    appointmentsMadeNumber: z.string().nullish(),
    soldCustomersNumber: z.string().nullish(),
  });

  const validatedData = businessSchema.safeParse({
    county: formData.get('county'),
    countyCode: formData.get('countyCode'),
    einNumber: formData.get('einNumber'),
    email: formData.get('email'),
    faxNumber: formData.get('faxNumber'),
    maillingAddress: formData.get('maillingAddress'),
    salesTax: formData.get('salesTax'),
    storeAlias: formData.get('storeAlias'),
    storeId: formData.get('storeId'),
    storeLicense: formData.get('storeLicense'),
    image: formData.get('image'),
    storeName: formData.get('storeName'),
    isMailingAddressSameAsPhysical: formData.get('isMailingAddressSameAsPhysical'),
    full_address: formData.get('currentAddress'),
    street: formData.get('street'),
    city: formData.get('city'),
    state: formData.get('state'),
    zip: formData.get('zip'),
    stateId: formData.get('stateId'),
    defaultAppointmentReminderId: formData.get('defaultAppointmentReminderId'),
    defaultTaskReminderId: formData.get('defaultTaskReminderId'),
    monthlySalesGoal: formData.get('monthlySalesGoal'),
    dailySalesPointsTarget: formData.get('dailySalesPointsTarget'),
    emailsSentNumber: formData.get('emailsSentNumber'),
    smssSentNumber: formData.get('smssSentNumber'),
    callsMadeNumber: formData.get('callsMadeNumber'),
    appointmentsCompletedNumber: formData.get('appointmentsCompletedNumber'),
    appointmentsMadeNumber: formData.get('appointmentsMadeNumber'),
    soldCustomersNumber: formData.get('soldCustomersNumber'),
  });

  if (!validatedData.success) {
    let fieldErrors = validatedData.error.flatten().fieldErrors;
    if (
      fieldErrors.full_address ||
      fieldErrors.street ||
      fieldErrors.city ||
      fieldErrors.state ||
      fieldErrors.stateId
    ) {
      fieldErrors = {
        ...fieldErrors,
        maillingAddress: [
          'Please, enter at least a Street name, a City name and a State separated by comma.',
        ],
      };
    }
    return NextResponse.json({ fieldErrors: fieldErrors }, { status: 422 });
  }

  const {
    county,
    countyCode,
    einNumber,
    email,
    faxNumber,
    maillingAddress,
    salesTax,
    storeAlias,
    storeId,
    storeLicense,
    image,
    storeName,
    isMailingAddressSameAsPhysical,
    full_address,
    street,
    city,
    state,
    zip,
    stateId,
    defaultAppointmentReminderId,
    defaultTaskReminderId,
    monthlySalesGoal,
    dailySalesPointsTarget,
    emailsSentNumber,
    smssSentNumber,
    callsMadeNumber,
    appointmentsCompletedNumber,
    appointmentsMadeNumber,
    soldCustomersNumber,
  } = validatedData.data;

  const is_Mailing_Address_Same_As_Physical = isMailingAddressSameAsPhysical === 'true';

  const mailingAddressData = {
    full_address: full_address,
    street: street,
    city: city,
    state: { id: parseInt(stateId) },
    zip: zip,
    county: county,
  };

  const salesGoalsData = {
    monthlySalesGoal: monthlySalesGoal ? parseInt(monthlySalesGoal) : null,
    dailySalesPointsTarget: dailySalesPointsTarget ? parseInt(dailySalesPointsTarget) : null,
    emailsSentNumber: emailsSentNumber ? parseInt(emailsSentNumber) : null,
    smssSentNumber: smssSentNumber ? parseInt(smssSentNumber) : null,
    callsMadeNumber: callsMadeNumber ? parseInt(callsMadeNumber) : null,
    appointmentsCompletedNumber: appointmentsCompletedNumber
      ? parseInt(appointmentsCompletedNumber)
      : null,
    appointmentsMadeNumber: appointmentsMadeNumber
      ? parseInt(appointmentsMadeNumber)
      : null,
    soldCustomersNumber: soldCustomersNumber ? parseInt(soldCustomersNumber) : null,
  };

  try {
    let finalImage = image;
    if (typeof image !== 'string' && image) {
      const fileRef = ref(storage, `images/${image.name}`);
      const doUpload = await uploadBytes(fileRef, image);
      finalImage = await getDownloadURL(doUpload.ref);
    }

    const data = mockDb.business.update({
      where: {
        id: businessId,
      },
      data: {
        name: storeName,
        county: county,
        county_code: countyCode,
        store_id: storeId,
        store_license_number: storeLicense,
        store_alias: storeAlias,
        sales_tax_license: salesTax,
        ein_number: einNumber,
        fax_number: faxNumber,
        email: email,
        image: finalImage,
        appointment_reminder_time_id: defaultAppointmentReminderId
          ? parseInt(defaultAppointmentReminderId)
          : null,
        task_reminder_time_id: defaultTaskReminderId ? parseInt(defaultTaskReminderId) : null,
        is_Mailing_Address_Same_As_Physical,
        mailing_address: mailingAddressData,
        salesGoalsConfig: salesGoalsData,
      },
    });

    return NextResponse.json({ successMessage: 'Business Successfully Updated' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}