import { NextResponse } from 'next/server';
import { z } from 'zod';
import { mockDb } from '@/app/libs/mock-db';
import { createEvent } from '@/app/libs/events/events';
import { AddressData } from '@/app/api/adminDashboard/creditApp/types';
import { io } from 'socket.io-client';

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:3001';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const formData = await request.formData();

  const customerId = parseInt(params.id);

  const addressEschema = z.object({
    id: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    modifiedDate: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    currentAddress: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    currentYear: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    currentMonthId: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    currentAddressTypeId: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    currentRentMort: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    currentStreet: z.string({ invalid_type_error: 'Please enter a value' }).nullable(),
    currentCity: z.string({ invalid_type_error: 'Please enter a value' }).nullable(),
    currentStateId: z.string({ invalid_type_error: 'Please enter a value' }).nullable(),
    currentZip: z.string({ invalid_type_error: 'Please enter a value' }).nullable(),
    currentCounty: z.string({ invalid_type_error: 'Please enter a value' }).nullable(),
    mailingStreet: z.string({ invalid_type_error: 'Please enter a value' }).nullable(),
    mailingCity: z.string({ invalid_type_error: 'Please enter a value' }).nullable(),
    mailingStateId: z.string({ invalid_type_error: 'Please enter a value' }).nullable(),
    mailingZip: z.string({ invalid_type_error: 'Please enter a value' }).nullable(),
    mailingCounty: z.string({ invalid_type_error: 'Please enter a value' }).nullable(),
    sameAsCurrent: z.string({ invalid_type_error: 'Please enter a value' }).nullable(),
    mailingAddress: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
    nextToEmploymentStatus: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .nullable(),
    previousAddressForms: z
      .array(
        z
          .object({
            id: z.number({ invalid_type_error: 'Please enter a valid value' }).nullable(),
            prevAddress: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
            prevStreet: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
            prevCity: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
            prevStateId: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
            prevZip: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
            prevCounty: z.string({ invalid_type_error: 'Please enter a valid value' }).nullable(),
            prevInputs: z
              .array(
                z
                  .object({
                    name: z.string().nullable(),
                    value: z.string().nullable(),
                  })
                  .nullable(),
              )
              .nullable(),
          })
          .nullable(),
      )
      .nullable(),
  });

  const array = formData.get('previousAddressForms');

  const validatedData = addressEschema.safeParse({
    id: formData.get('id'),
    currentAddress: formData.get('currentAddress'),
    currentYear: formData.get('currentYear'),
    currentMonthId: formData.get('currentMonthId'),
    currentAddressTypeId: formData.get('currentAddressTypeId'),
    currentRentMort: formData.get('currentRentMort'),
    mailingAddress: formData.get('mailingAddress'),
    currentStreet: formData.get('currentStreet'),
    currentCity: formData.get('currentCity'),
    currentStateId: formData.get('currentStateId'),
    currentZip: formData.get('currentZip'),
    currentCounty: formData.get('currentCounty'),
    mailingStreet: formData.get('mailingStreet'),
    mailingCity: formData.get('mailingCity'),
    mailingStateId: formData.get('mailingStateId'),
    mailingZip: formData.get('mailingZip'),
    mailingCounty: formData.get('mailingCounty'),
    modifiedDate: formData.get('modifiedDate'),
    sameAsCurrent: formData.get('sameAsCurrent'),
    nextToEmploymentStatus: formData.get('nextToEmploymentStatus'),
    previousAddressForms: array && typeof array === 'string' && JSON.parse(array),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const {
    id,
    currentAddress,
    currentYear,
    currentMonthId,
    currentAddressTypeId,
    currentRentMort,
    currentStreet,
    currentCity,
    currentStateId,
    currentZip,
    currentCounty,
    mailingStreet,
    mailingCity,
    mailingStateId,
    mailingZip,
    mailingCounty,
    mailingAddress,
    modifiedDate,
    previousAddressForms,
    sameAsCurrent,
    nextToEmploymentStatus,
  } = validatedData.data;

  try {
    const prevData = mockDb.credit_app_address.findUnique({
      where: {
        id: Number(id),
      },
    });

    mockDb.credit_app_navigation.upsert({
      where: {
        customer_id: customerId,
      },
      update: {
        nextToEmploymentStatus: nextToEmploymentStatus === 'true',
      },
      create: {
        customer_id: customerId,
        nextToEmploymentStatus: nextToEmploymentStatus === 'true',
      },
    });

    const currentData = mockDb.credit_app_address.upsert({
      where: {
        id: Number(id),
      },
      update: {
        client_id: customerId,
        current_address: currentAddress,
        current_year: currentYear,
        current_month_id: currentMonthId ? parseInt(currentMonthId) : null,
        current_address_type_id: currentAddressTypeId ? parseInt(currentAddressTypeId) : null,
        current_rent_mort: currentRentMort,
        current_street: currentStreet,
        current_city: currentCity,
        current_state_id: currentStateId ? parseInt(currentStateId) : null,
        current_zip: currentZip,
        current_county: currentCounty,
        mailing_address: mailingAddress,
        mailing_street: mailingStreet,
        mailing_city: mailingCity,
        mailing_state_id: mailingStateId ? parseInt(mailingStateId) : null,
        mailing_zip: mailingZip,
        mailing_county: mailingCounty,
        mailing_same_as_current: sameAsCurrent ? true : null,
      },
      create: {
        client_id: customerId,
        current_address: currentAddress,
        current_year: currentYear,
        current_month_id: currentMonthId ? parseInt(currentMonthId) : null,
        current_address_type_id: currentAddressTypeId ? parseInt(currentAddressTypeId) : null,
        current_rent_mort: currentRentMort,
        current_street: currentStreet,
        current_city: currentCity,
        current_state_id: currentStateId ? parseInt(currentStateId) : null,
        current_zip: currentZip,
        current_county: currentCounty,
        mailing_address: mailingAddress,
        mailing_street: mailingStreet,
        mailing_city: mailingCity,
        mailing_state_id: mailingStateId ? parseInt(mailingStateId) : null,
        mailing_zip: mailingZip,
        mailing_county: mailingCounty,
        mailing_same_as_current: sameAsCurrent ? true : null,
      },
    });

    type CreditAppAddressPrev = {
      id: number;
      credit_app_address_id: number;
      prev_address: string | null;
      prev_street: string | null;
      prev_city: string | null;
      prev_state_id: number | null;
      prev_zip: string | null;
      prev_county: string | null;
      prev_year: string | null;
      prev_month_id: number | null;
      prev_address_type_id: number | null;
      prev_rent_mort: string | null;
    };

    let prviousAddressData: CreditAppAddressPrev[] = [];

    if (previousAddressForms && previousAddressForms.length > 0) {
      const formsCopy = [...previousAddressForms];
      const formsIds = formsCopy.map((form) => form?.id);

      deletePreviousForm(formsIds);

      for (const form of previousAddressForms) {
        const prevYear = form?.prevInputs?.find((el) => el?.name === 'year')?.value;
        const prevMonthId = form?.prevInputs?.find((el) => el?.name === 'month')?.value;
        const prevAddressTypeId = form?.prevInputs?.find((el) => el?.name === 'addressType')?.value;
        const prevRentMort = form?.prevInputs?.find((el) => el?.name === 'rentMort')?.value;

        const prevDataPrev = mockDb.credit_app_address_prev.findUnique({
          where: {
            id: Number(form?.id),
          },
        });

        const updatedData = mockDb.credit_app_address_prev.upsert({
          where: {
            id: Number(form?.id),
          },
          update: {
            credit_app_address_id: currentData.id,
            prev_address: form?.prevAddress,
            prev_street: form?.prevStreet,
            prev_city: form?.prevCity,
            prev_state_id: form && form.prevStateId ? parseInt(form.prevStateId) : null,
            prev_zip: form?.prevZip,
            prev_county: form?.prevCounty,
            prev_year: prevYear,
            prev_month_id: prevMonthId ? parseInt(prevMonthId) : null,
            prev_address_type_id: prevAddressTypeId ? parseInt(prevAddressTypeId) : null,
            prev_rent_mort: prevRentMort,
          },
          create: {
            credit_app_address_id: currentData.id,
            prev_address: form?.prevAddress,
            prev_street: form?.prevStreet,
            prev_city: form?.prevCity,
            prev_state_id: form && form.prevStateId ? parseInt(form.prevStateId) : null,
            prev_zip: form?.prevZip,
            prev_county: form?.prevCounty,
            prev_year: prevYear,
            prev_month_id: prevMonthId ? parseInt(prevMonthId) : null,
            prev_address_type_id: prevAddressTypeId ? parseInt(prevAddressTypeId) : null,
            prev_rent_mort: prevRentMort,
          },
        });

        prviousAddressData.push(updatedData);

        const worksWith = [
          'prev_address',
          'prev_street',
          'prev_city',
          'prev_state_id',
          'prev_zip',
          'prev_county',
          'prev_year',
          'prev_month_id',
          'prev_address_type_id',
          'prev_rent_mort',
        ];
      }
    } else {
      mockDb.credit_app_address_prev.deleteMany({
        where: {
          credit_app_address_id: currentData.id,
        },
      });
    }


    const worksWith = [
      'current_address',
      'current_year',
      'current_month_id',
      'current_address_type_id',
      'current_rent_mort',
      'current_street',
      'current_city',
      'current_state_id',
      'current_zip',
      'current_county',
      'mailing_address',
      'mailing_street',
      'mailing_city',
      'mailing_state_id',
      'mailing_zip',
      'mailing_county',
    ];

    const description = `Fields at Credit App modified by customer`;

    await createEvent(description, undefined, customerId, new Date(modifiedDate));

    const dataToReturn: AddressData = {
      id: currentData.id,
      currentAddress: currentData.current_address,
      currentAddressType: currentData.current_address_type_id,
      currentMonth: currentData.current_month_id,
      currentRentMortAmt: currentData.current_rent_mort,
      currentYear: currentData.current_year,
      mailingAddress: currentData.mailing_address,
      sameAsCurrentAddress: currentData.mailing_same_as_current,
      currentStateId: currentData.current_state_id,
      mailingStateId: currentData.mailing_state_id,
      prevAddress: prviousAddressData.map((el) => ({
        id: el.id,
        address: el.prev_address,
        addressType: el.prev_address_type_id,
        month: el.prev_month_id,
        rentMortAmt: el.prev_rent_mort,
        year: el.prev_year,
        stateId: el.prev_state_id,
      })),
    };

    const socket = io(socketUrl);

    socket?.emit('ask_for_update_data', 'creditApp', false, '', {
      customerId,
      employmentStatus: true,
    });

    socket?.disconnect();

    return NextResponse.json({
      successMessage: 'Current App Address Successfully Updated',
      data: dataToReturn,
    });
  } catch (error) {
    console.log(error);


    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

const deletePreviousForm = async (formId: (number | null | undefined)[]) => {
  try {
    if (formId && formId.length > 0) {
      const previousForms = mockDb.credit_app_address_prev.findMany();

      if (formId.length < previousForms.length) {
        const formsToDelete = previousForms.filter((form) => !formId.includes(form.id));

        if (formsToDelete.length > 0) {
          const formsIds = formsToDelete.map((form) => form.id);

          mockDb.credit_app_address_prev.deleteMany({
            where: {
              id: {
                in: formsIds,
              },
            },
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
