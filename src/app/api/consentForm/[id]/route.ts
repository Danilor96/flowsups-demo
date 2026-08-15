import { filterNumber } from '@/app/libs/customer/customersFunctions';
import { createEvent } from '@/app/libs/events/events';
import { mockDb } from '@/app/libs/mock-db';
import { createNotification } from '@/app/libs/notifications/notifications';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const consentId = parseInt(params.id);

  const formData = await request.formData();

  const userAgent = request.headers.get('user-agent');
  const ipAddress = request.headers.get('x-forwarded-for') || '';

  const customerSchema = z
    .object({
      firstName: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      lastName: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      phone: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      countryCode: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      dateOfBirth: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      email: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      street: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      city: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      state: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      zipCode: z
        .string({ invalid_type_error: 'Please enter a valid value' })
        .min(1, 'Please enter a value'),
      checks: z.array(
        z.object({
          id: z
            .number({ invalid_type_error: 'Please enter a valid value' })
            .min(1, 'Please enter a value'),
          description: z
            .string({ invalid_type_error: 'Please enter a valid value' })
            .min(1, 'Please enter a value'),
          required: z.boolean(),
          checked: z.boolean(),
        }),
      ),
    })
    .superRefine((data, ctx) => {
      const { checks } = data;

      const requiredEl = checks.find((el) => el.required === true && el.checked === false);

      if (requiredEl) {
        ctx.addIssue({
          path: ['checks'],
          message: 'Required to continue',
          code: 'custom',
        });
      }
    });

  const arrayData = formData.get('checks');

  const validatedData = customerSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    phone: formData.get('phone'),
    countryCode: formData.get('countryCode'),
    dateOfBirth: formData.get('dateOfBirth'),
    email: formData.get('email'),
    street: formData.get('street'),
    city: formData.get('city'),
    state: formData.get('state'),
    zipCode: formData.get('zipCode'),
    checks: typeof arrayData === 'string' && JSON.parse(arrayData),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const {
    city,
    countryCode,
    dateOfBirth,
    email,
    firstName,
    lastName,
    phone,
    state,
    street,
    zipCode,
    checks,
  } = validatedData.data;

  try {
    const validateCode = mockDb.consent_code.findUnique({
      where: {
        id: consentId,
      },
    });

    if (!validateCode) {

      throw new Error('Consent code not found');
    }

    const customerId = validateCode.customer_id;

    const consentSms = checks.find((el) => el.id === 3);

    const customer = mockDb.clients.update({
      where: {
        id: customerId,
      },
      data: {
        first_name: firstName,
        last_name: lastName,
        name_lastname: `${firstName}${lastName ? ` ${lastName}` : ''}`,
        mobile_phone: filterNumber(phone),
        email: email,
        country_phone_code_id: parseInt(countryCode),
        born_date: new Date(dateOfBirth),
        consent_approved: true,
        client_status_id: 2,
        client_status_changed_at: new Date(),
        consent_to_sent_sms: consentSms ? (consentSms.checked ? true : false) : false,
      },
    });

    const activeLead = mockDb.leads.findFirst({
      where: {
        customer_id: customerId,
        is_active: true,
      },
      select: {
        id: true,
      },
    });

    if (activeLead) {
      mockDb.leads.update({
        where: {
          id: activeLead.id,
          customer_id: customerId,
          is_active: true,
        },
        data: {
          customer_status_id: 2,
        },
      });
    }

    const prevTermsProcessed = mockDb.terms_and_conditions_processed.findMany({
      where: {
        customer_id: customerId,
      },
    });

    const customerContactPhone = customer.mobile_phone || customer.home_phone || '';

    const policyStatement = mockDb.consent_terms.findFirst({
      select: {
        consent_statement: true,
      },
    });

    const consentLog = mockDb.customer_consent_logs.create({
      data: {
        phoneNumber: customerContactPhone,
        policyStatement: policyStatement?.consent_statement || '',
        customerId: customerId,
        consentStatusId: 1,
        ipAddress: userAgent,
        userAgent: ipAddress,
      },
    });

    for (let i = 0; i < checks.length; i++) {
      const el = checks[i];

      const prevDescriptionExists = prevTermsProcessed.find(elPrev => {
        const prevDescriptionFormatted = elPrev.description.toLowerCase().trim();
        const currentDescriptionFormatted = el.description.toLowerCase().trim();

        if (prevDescriptionFormatted === currentDescriptionFormatted) {
          return el;
        }
      });

      if (!prevDescriptionExists) {
        mockDb.terms_and_conditions_processed.create({
          data: {
            description: el.description,
            accepted: el.checked,
            customer_id: customerId,
            term_or_condition_id: el.id,
            customerConsentLogsId: consentLog.id,
          },
        });
      }
    }

    if (customer.client_address_id) {
      mockDb.client_address.update({
        where: {
          id: customer.client_address_id,
        },
        data: {
          city: city,
          street: street,
          zip: zipCode,
          state_id: parseInt(state),
        },
      });
    } else {
      const newClientAddress = mockDb.client_address.create({
        data: {
          city: city,
          street: street,
          zip: zipCode,
          state_id: parseInt(state),
        },
      });
      mockDb.clients.update({
        where: {
          id: customerId,
        },
        data: {
          client_address_id: newClientAddress.id,
        },
      });
    }

    try {
      const verificationMessage = mockDb.client_sms.create({
        data: {
          message:
            'Security Verification: We received a request using this phone number. To confirm you submitted this form and agree to our consent policy, please reply YES.',
          sent_by_user: true,
          manual_sent: false,
          message_sid: 'SM' + consentId + Date.now(),
          client_phone_number: customerContactPhone,
          is_consent_message: true,
          status_id: 1,
          client_message_id: customerId,
          date_sent: new Date(),
        },
      });

      mockDb.customer_consent_logs.update({
        where: {
          id: consentLog.id,
        },
        data: {
          sentSmsVerificationRecordId: verificationMessage.id,
        },
      });

      mockDb.consent_code.delete({
        where: {
          customer_id: customerId,
        },
      });

      // Notify when a client submits an application by themselves.
      await createNotification({
        message: `Customer ${firstName || ''} ${lastName || ''} has submitted an application`,
        customerId: customerId,
        assignedToId: customer.seller_id,
        notificationType: {
          general: true,
        },
        notificationsForManagers: true,
        eventTypeId: 8,
      });

      const description = `Application submitted by this customer`;

      await createEvent(description, undefined, customerId);
    } catch (error) {
      mockDb.terms_and_conditions_processed.deleteMany({
        where: {
          customer_id: customerId,
          customerConsentLogsId: consentLog.id,
        },
      });

      mockDb.customer_consent_logs.delete({
        where: {
          id: consentLog.id,
        },
      });

      throw error;
    }


    return NextResponse.json({ successMessage: 'Data Successfully Submitted' });
  } catch (error) {
    console.log(error);


    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
