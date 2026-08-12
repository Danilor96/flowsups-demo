import { NextResponse } from 'next/server';
import { mockDb } from '@/app/libs/mock-db';

export async function POST(request: Request) {
  const data: any[] = await request.json();

  try {
    const emailCache: Record<string, number> = {};
    const mobileCache: Record<string, number> = {};

    const leadSources = mockDb.lead_sources.findMany();
    const leadTypes = mockDb.lead_types.findMany();
    const clientStatuses = mockDb.client_status.findMany();

    const getEmail = (email: string): boolean => {
      if (emailCache[email]) return true;
      const found = mockDb.clients.findUnique({ where: { email } });
      if (found) {
        emailCache[email] = 1;
        return true;
      }
      return false;
    };

    const getMobile = (phone: string): boolean => {
      if (mobileCache[phone]) return true;
      const found = mockDb.clients.findUnique({ where: { mobile_phone: phone } });
      if (found) {
        mobileCache[phone] = 1;
        return true;
      }
      return false;
    };

    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      const email = `${element.mobilePhone}@prisma.io`;
      const mobile = `${element.mobilePhone}`;

      const emailExists = getEmail(email);
      const mobileExists = getMobile(mobile);

      const leadSourceValue = element.leadSource ? element.leadSource.toLowerCase() : '';
      const leadTypeValue = element.leadType ? element.leadType.toLowerCase() : '';
      const customerStatusValue = element.customerStatus
        ? element.customerStatus.toLowerCase()
        : '';

      if (!emailExists && !mobileExists) {
        const addressId = Date.now() + i;
        const customerAddress = {
          id: addressId,
          city: element.city || `City ${i}`,
          street: `Street ${i}`,
          state_id: 1,
          zip: null,
          county_id: null,
          current_data_from_webhook: false,
          state: null,
        };

        const customerData = mockDb.clients.create({
          data: {
            email,
            first_name: element.firstName || 'no name',
            last_name: element.lastName || 'no last name',
            home_phone: `${element.homePhone} - ${i}`,
            mobile_phone: mobile,
            work_phone: `${element.workPhone} - ${i}`,
            social_security: `${i}`,
            current_address: `address ${element.city}`,
            created_at: element.customerCreatedDate
              ? new Date(element.customerCreatedDate)
              : new Date(),
            lead_source_id:
              leadSources.find((el) => el.source.toLowerCase() === leadSourceValue)?.id || 1,
            lead_type_id:
              leadTypes.find((el) => el.type.toLowerCase() === leadTypeValue)?.id || 1,
            client_address_id: addressId,
            client_address: customerAddress,
            client_status_id:
              clientStatuses.find((el) => el.status.toLowerCase() === customerStatusValue)?.id ||
              1,
            client_status_changed_at: new Date(),
            deleted: false,
            cobuyer: false,
            consent_approved: false,
            consent_sent: false,
            consent_to_sent_sms: false,
            appointment_confirmation_sms_sent: false,
            credit_app_forms_completed: false,
            current_data_from_webhook: false,
            last_activity: new Date(),
          },
        });

        mockDb.leads.create({
          data: {
            customer_id: customerData.id,
            customer_status_id: 1,
            created_at: new Date(),
            end_at: null,
            has_ended: false,
            is_active: true,
            is_selected: true,
            lead_temperature_id: 1,
            isSplitSold: false,
          },
        });

        emailCache[email] = 1;
        mobileCache[mobile] = 1;
      }
    }

    return NextResponse.json({ successMessage: 'Data Successfully Imported' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
