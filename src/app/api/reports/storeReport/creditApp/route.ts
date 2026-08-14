import { buildDatePrismaFilter } from '@/app/libs/buildDatePrismaFilter';
import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { TemporalCreditAppReportSummary } from './types';
import { revalidatePath } from 'next/cache';
import { differenceInDays } from 'date-fns';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const option = searchParams.get('optionDate');
  const value = searchParams.get('valueDate');
  const from = searchParams.get('fromDate');
  const to = searchParams.get('toDate');

  const dateFilterObject = option ? { option, value, from, to } : null;

  try {
    const dateWhereClause = buildDatePrismaFilter(dateFilterObject);

    const creditAppData = mockDb.credit_app.findMany({
      where: {
        created_at: dateWhereClause,
        client: {
          credit_app_forms_completed: true,
        },
      },
      select: {
        id: true,
        cash_down: true,
        ssn: true,
        created_at: true,
        client: {
          select: {
            created_at: true,
            lead: {
              select: {
                id: true,
              },
            },
            message: {
              orderBy: {
                date_sent: 'desc',
              },
              take: 1,
              select: {
                date_sent: true,
              },
            },
            calls: {
              orderBy: {
                call_date: 'desc',
              },
              take: 1,
              select: {
                call_date: true,
              },
            },
          },
        },
      },
    });

    const leads = mockDb.leads.findMany({
      where: {
        clients: {
          credit_app_forms_completed: true,
        },
      },
      select: {
        id: true,
        clients: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            mobile_phone: true,
            home_phone: true,
            email: true,
            born_date: true,
            work_phone: true,
            credit_app_forms_completed: true,
            created_at: true,
            credit_app: {
              select: {
                id: true,
                created_at: true,
                ssn: true,
                cash_down: true,
              },
            },
            client_employment: {
              select: {
                current_employer_name: true,
                has_bank_account: true,
                income_type: {
                  select: {
                    income: true,
                  },
                },
                occupation: {
                  select: {
                    occupation: true,
                  },
                },
                montly_income: true,
                year: true,
                month_id: true,
              },
            },
            lead_source: {
              select: {
                id: true,
                source: true,
              },
            },
            lead_type: {
              select: {
                type: true,
              },
            },
            client_address: {
              select: {
                city: true,
                state: {
                  select: {
                    state: true,
                  },
                },
                zip: true,
              },
            },
          },
        },
        customer_status: {
          select: {
            id: true,
            status: true,
          },
        },
        sales_rep: {
          select: {
            id: true,
            name: true,
            last_name: true,
            username: true,
          },
        },
        bdc: {
          select: {
            name: true,
            last_name: true,
            username: true,
          },
        },
        sales_manager: {
          select: {
            name: true,
            last_name: true,
            username: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            vehicle_image: {
              select: {
                path: true,
              },
            },
            vehicle_brands: {
              select: {
                brand: true,
              },
            },
            vehicle_models: {
              select: {
                model: true,
              },
            },
            vehicle_manufacture_years: {
              select: {
                year: true,
              },
            },
            vehicle_identification_numbers: {
              select: {
                vin: true,
              },
            },
            vehicle_mileages: {
              select: {
                mileage: true,
              },
            },
            general_info: {
              select: {
                date_in_stock: true,
                stock_no: true,
              },
            },
            title_license: {
              select: {
                asking_price: true,
              },
            },
          },
        },
        client_vehicle_tradein: {
          select: {
            id: true,
            make: {
              select: {
                brand: true,
              },
            },
            model: {
              select: {
                model: true,
              },
            },
            year: {
              select: {
                year: true,
              },
            },
            vin: {
              select: {
                vin: true,
              },
            },
            mileage: {
              select: {
                mileage: true,
              },
            },
            titleLicense: {
              select: {
                asking_price: true,
              },
            },
          },
        },
      },
    });

    const creditAppMap = new Map<number, TemporalCreditAppReportSummary>();

    creditAppData.forEach((creditApp) => {
      creditApp.client.lead.forEach((lead: any) => {
        if (!creditAppMap.has(lead.id)) {
          const { client } = creditApp;

          // start credit app info column

          const bank = '';
          const incomeType = '';
          const ssnTin = creditApp.ssn || '';
          const cashDown = creditApp.cash_down || '';

          const creditAppInfo = {
            bank,
            incomeType,
            ssnTin,
            cashDown,
          };

          // end credit app info column

          // start date column

          const createdAt = creditApp.created_at;
          const daysOld = differenceInDays(new Date().toISOString(), client.created_at);
          const lastContactedDay = oldestContactHandler(client.message, client.calls);

          const date = {
            createdAt,
            salesRep: '',
            daysOld,
            lastContactedDay,
          };

          // end date column

          creditAppMap.set(lead.id, {
            date,
            creditAppInfo,
          });
        }
      });
    });

    leads.forEach((lead) => {
      const leadId = lead.id;

      const mappedData = creditAppMap.get(leadId);

      if (mappedData) {
        const {
          clients,
          sales_rep,
          bdc: bdcData,
          sales_manager,
          vehicle: vehicleData,
          client_vehicle_tradein,
          customer_status,
        } = lead;

        // start customer column

        const customerFirstName = clients.first_name || '';
        const customerLastName = clients.last_name || '';
        const customerName = `${customerFirstName} ${customerLastName}`;
        const cellPhone = clients.mobile_phone || '';
        const homePhone = clients.home_phone || '';
        const email = clients.email || '';
        const city = clients.client_address?.city || '';
        const state = clients.client_address?.state?.state || '';
        const zip = clients.client_address?.zip || '';
        const dateOfBirth = clients.born_date;
        const customerId = clients.id;
        const statusId = customer_status?.id || 0;

        const customer = {
          customerName,
          cellPhone,
          homePhone,
          email,
          city,
          state,
          zip,
          dateOfBirth,
          customerId,
          statusId,
        };

        mappedData.customer = customer;

        // end customer column

        // start interested vehicle column

        const brand = vehicleData?.vehicle_brands?.brand || '';
        const model = vehicleData?.vehicle_models?.model || '';
        const year = vehicleData?.vehicle_manufacture_years?.year || '';
        const vehicle = vehicleData?.id ? `${year} ${brand} ${model}` : 'No vehicle';
        const vin = vehicleData?.vehicle_identification_numbers.vin || '';
        const price = vehicleData?.title_license?.asking_price || '0';
        const millage = vehicleData?.vehicle_mileages?.mileage || 'No millage info';
        const stockDate = vehicleData?.general_info?.date_in_stock;
        const daysInStock = stockDate ? differenceInDays(new Date().toISOString(), stockDate) : 0;
        const stockNumber = vehicleData?.general_info?.stock_no || '';
        const img = vehicleData?.vehicle_image?.path || null;

        const interestedVehicle = {
          vehicle,
          price,
          millage,
          daysInStock,
          vin,
          stockNumber,
          img,
        };

        mappedData.interestedVehicle = interestedVehicle;

        // end interested vehicle column

        // start trade in vehicle column

        const brandTradeIn = client_vehicle_tradein?.make?.brand;
        const modelTradeIn = client_vehicle_tradein?.model?.model;
        const yearTradeIn = client_vehicle_tradein?.year?.year;
        const vehicleTradeIn = client_vehicle_tradein
          ? `${yearTradeIn} ${brandTradeIn} ${modelTradeIn}`
          : 'No vehicle';
        const vinTradeIn = client_vehicle_tradein?.vin?.vin || '';
        const millageTradeIn = client_vehicle_tradein?.mileage?.mileage || '';
        const priceTradeIn = client_vehicle_tradein?.titleLicense?.asking_price || '0';

        const tradeInVehicle = {
          vehicle: vehicleTradeIn,
          vin: vinTradeIn,
          millage: millageTradeIn,
          price: priceTradeIn,
        };

        mappedData.tradeInVehicle = tradeInVehicle;

        // end trade in vehicle column

        // start lead info column

        const status = customer_status?.status || '';
        const creditAppCompleted = clients.credit_app_forms_completed
          ? 'Completed'
          : 'No Completed';
        const salesRepName = sales_rep?.name || '';
        const salesRepLastname = sales_rep?.last_name || '';
        const salesRepUsername = sales_rep?.username || '';
        const salesRep = `${salesRepName} ${salesRepLastname}${
          salesRepUsername ? ` - ${salesRepUsername}` : ''
        }`;
        const salesRepId = sales_rep?.id || 0;
        const bdcName = bdcData?.name || '';
        const bdcLastname = bdcData?.last_name || '';
        const bdcUsername = bdcData?.username || '';
        const bdc = `${bdcName} ${bdcLastname}${bdcUsername ? ` - ${bdcUsername}` : ''}`;
        const managerName = sales_manager?.name || '';
        const managerLastname = sales_manager?.last_name || '';
        const managerUsername = sales_manager?.username || '';
        const manager = `${managerName} ${managerLastname}${
          managerUsername ? ` - ${managerUsername}` : ''
        }`;
        const source = clients.lead_source?.source || '';
        const type = clients.lead_type?.type || '';
        const id = clients.lead_source?.id || 0;

        const leadInfo = {
          id,
          status,
          creditAppCompleted,
          salesRep,
          bdc,
          manager,
          source,
          type,
          salesRepId,
        };

        mappedData.leadInfo = leadInfo;

        mappedData.date = mappedData.date
          ? { ...mappedData.date, salesRep: salesRep }
          : mappedData.date;

        // end lead info column

        // start employment column

        const employerName = clients.client_employment[0].current_employer_name || '';
        const occupation = clients.client_employment[0].occupation?.occupation || '';
        const employmentYears = clients.client_employment.map((el: any) => el.year);
        const employmentMonths = clients.client_employment.map((el: any) => el.month_id);
        const lengthAtJob = totalEmploymentTime(employmentYears, employmentMonths);
        const income = clients.client_employment[0].montly_income || '';
        const workPhone = clients.work_phone || '';

        const employment = {
          employerName,
          occupation,
          lengthAtJob,
          income,
          workPhone,
        };

        mappedData.employment = employment;

        // end employment column

        // start credit app column

        if (mappedData.creditAppInfo?.bank === '') {
          mappedData.creditAppInfo.bank = lead.clients.client_employment[0].has_bank_account
            ? 'Yes'
            : 'No';
        }

        if (mappedData.creditAppInfo?.incomeType === '') {
          mappedData.creditAppInfo.incomeType =
            lead.clients.client_employment[0].income_type?.income || '';
        }

        // end credit app column
      }
    });

    const creditAppReportSummary = Array.from(creditAppMap.values());

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(creditAppReportSummary);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

const oldestContactHandler = (
  smsDate: {
    date_sent: Date;
  }[],
  callDate: {
    call_date: Date;
  }[],
) => {
  if (smsDate && callDate) {
    const [sms] = smsDate;
    const [call] = callDate;

    const smsDiff = differenceInDays(new Date().toISOString(), sms.date_sent);
    const callDiff = differenceInDays(new Date().toISOString(), call.call_date);

    const dateToReturn = smsDiff > callDiff ? call.call_date : sms.date_sent;

    return dateToReturn;
  }

  return null;
};

const totalEmploymentTime = (years: (string | null)[], months: (number | null)[]) => {
  const validYears = years.filter((year) => year !== null);
  const validMonths = months.filter((month) => month !== null);

  let totalYears = 0;
  let totalMonths = 0;

  if (validYears.length > 0) {
    validYears.forEach((year) => {
      totalYears += Number(year);
    });
  }

  if (validMonths.length > 0) {
    validMonths.forEach((month) => {
      totalMonths += month - 1;

      if (totalMonths === 12) {
        totalYears += 1;

        totalMonths = 0;
      }
    });
  }

  return `${totalYears} Yrs, ${totalMonths} Mths`;
};
