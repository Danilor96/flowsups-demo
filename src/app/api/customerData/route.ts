import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prisma';

export async function POST(request: Request) {
  const data: any[] = await request.json();

  try {
    const emailCache: Record<string, number> = {};
    const mobileCache: Record<string, number> = {};

    const leadSource = await prisma.lead_sources.findMany();
    const leadType = await prisma.lead_types.findMany();
    const clientStatus = await prisma.client_status.findMany();

    const getEmail = async (email: string) => {
      if (emailCache[email]) return true;

      const data = await prisma.clients.findUnique({
        where: { email },
      });

      if (data) {
        emailCache[email] = 1;
        return true;
      }

      return false;
    };

    const getMobile = async (phone: string) => {
      if (mobileCache[phone]) return true;

      const data = await prisma.clients.findUnique({
        where: { mobile_phone: phone },
      });

      if (data) {
        mobileCache[phone] = 1;
        return true;
      }

      return false;
    };

    for (let i = 0; i < data.length; i += 10) {
      const batch = data.slice(i, i + 10);

      await prisma.$transaction(async (prisma) => {
        for (const element of batch) {
          const email = `${element.mobilePhone}@prisma.io`;
          const mobile = `${element.mobilePhone}`;

          const emailExists = await getEmail(email);
          const mobileExists = await getMobile(mobile);

          const leadSourceValue = element.leadSource ? element.leadSource.toLowerCase() : '';
          const leadTypeValue = element.leadType ? element.leadType.toLowerCase() : '';
          const customerStatusValue = element.customerStatus
            ? element.customerStatus.toLowerCase()
            : '';

          if (!emailExists && !mobileExists) {
            const customerAddress = await prisma.client_address.create({
              data: {
                city: element.city || `City ${i}`,
                street: `Street ${i}`,
                state_id: 1,
              },
            });

            const customerData = await prisma.clients.create({
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
                  leadSource.find((el) => el.source.toLowerCase() === leadSourceValue)?.id || 1,
                lead_type_id:
                  leadType.find((el) => el.type.toLowerCase() === leadTypeValue)?.id || 1,
                client_address_id: customerAddress.id,
                client_status_id:
                  clientStatus.find((el) => el.status.toLowerCase() === customerStatusValue)?.id ||
                  1,
                client_status_changed_at: new Date(),
              },
            });

            const lead = await prisma.leads.create({
              data: {
                customer_id: customerData.id,
                // sales_rep_id: parseInt(created_by),
                customer_status_id: 1,
              },
            });

            emailCache[email] = 1;
            mobileCache[mobile] = 1;
          }
        }
      });
    }

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Data Successfully Imported' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
