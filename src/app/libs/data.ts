import prisma from '@/app/libs/prisma';
import {
  CreditAppData,
  PrevAddress,
  PrevEmploymentStatus,
  References,
} from '../api/adminDashboard/creditApp/types';
// import { Roles } from './definitions/users/users';
// import { auth } from '@/auth';

// get new sign up data logic

export async function getUserCode(code: string) {
  try {
    const toActivateUser = await prisma?.activation_codes.findUnique({
      where: {
        code,
      },
      include: {
        code_data: {
          select: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    //await prisma?.$disconnect();

    return toActivateUser;
  } catch (error) {
    console.log(error);
  }
}

// get all users logic

export async function getAllUsers() {
  try {
    const users = await prisma?.users.findMany({
      where: {
        deleted_at: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        created_at: true,
        updated_at: true,
        emailVerified: true,
        password: false,
        user_has: {
          select: {
            role_id: true,
          },
        },
      },
    });

    //await prisma?.$disconnect();

    return users;
  } catch (error) {
    console.log(error);
  }
}

// get all roles logic

export async function getAllRoles() {
  try {
    const roles = await prisma?.roles.findMany({
      where: {
        NOT: {
          id: 1,
        },
      },
    });

    //await prisma?.$disconnect();

    return roles;
  } catch (error) {
    console.log(error);
  }
}

// get all task status logic
export async function getAllTaskStatuses() {
  try {
    const statuses = await prisma?.task_status.findMany();

    //await prisma?.$disconnect();

    return statuses;
  } catch (error) {
    console.log(error);
  }
}

// get an user logic

export async function getAnUser(email: string) {
  try {
    const user = await prisma?.users.findUnique({
      where: {
        email,
      },
    });

    //await prisma?.$disconnect();

    return user;
  } catch (error) {
    console.log(error);
  }
}

// get an user activation code logic

export async function getAnUserActivationCode(codeToVerify: string) {
  try {
    const code = await prisma?.activation_codes.findUnique({
      where: {
        code: codeToVerify,
      },
    });

    //await prisma?.$disconnect();

    return code;
  } catch (error) {
    console.log(error);
  }
}

// get all lead types logic (listo)

export async function getAllLeadTypes() {
  try {
    const data = await prisma?.lead_types.findMany();

    //await prisma?.$disconnect();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get all lead sources logic (listo)

export async function getAllLeadSources() {
  try {
    const data = await prisma?.lead_sources.findMany();

    //await prisma?.$disconnect();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get all contact methods logic

export async function getAllContactMethods() {
  try {
    const data = await prisma?.contact_methods.findMany();

    //await prisma?.$disconnect();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get all inquiry types logic

export async function getAllInquiryTypes() {
  try {
    const data = await prisma?.inquiry_types.findMany();

    //await prisma?.$disconnect();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get all genders logic

export async function getAllGenders() {
  try {
    const data = await prisma?.genders.findMany();

    //await prisma?.$disconnect();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get all seller users logic (listo)

export async function getAllSellerUsers() {
  try {
    const data = await prisma?.users.findMany({
      select: {
        name: true,
        last_name: true,
        email: true,
        id: true,
      },
      where: {
        user_has: {
          some: {
            role_id: 3,
          },
        },
        deleted_at: null,
      },
    });

    //await prisma?.$disconnect();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get all clients logic (listo)

export async function getAllClients() {
  try {
    const data = await prisma?.clients.findMany({
      select: {
        id: true,
        name_lastname: true,
        email: true,
        mobile_phone: true,
        home_phone: true,
        work_phone: true,
        born_date: true,
        created_at: true,
        gender: {
          select: {
            gender: true,
          },
        },
        language: {
          select: {
            language: true,
          },
        },
        current_address: true,
        current_job: true,
        previous_address: true,
        previous_job: true,
        social_security: true,
        duplicate: true,
        contact_method: {
          select: {
            method: true,
          },
        },
        contact_time: true,
        cash_down: true,
        file: {
          select: {
            file: true,
          },
        },
        inquiry_type: {
          select: {
            type: true,
          },
        },
        lead_source: {
          select: {
            source: true,
          },
        },
        lead_type: {
          select: {
            type: true,
          },
        },
        mailing_address: true,
        other_income: true,
        reference: true,
        seller: {
          select: {
            name: true,
            last_name: true,
            id: true,
            email: true,
          },
        },
      },
    });

    //await prisma?.$disconnect();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get a client by id logic
export async function getClientById(id: number) {
  try {
    const data = await prisma?.clients.findUnique({
      select: {
        id: true,
        name_lastname: true,
        email: true,
        mobile_phone: true,
        home_phone: true,
        work_phone: true,
        born_date: true,
        created_at: true,
        gender: {
          select: {
            id: true,
          },
        },
        language: {
          select: {
            language: true,
          },
        },
        current_address: true,
        current_job: true,
        previous_address: true,
        previous_job: true,
        social_security: true,
        duplicate: true,
        contact_method: {
          select: {
            id: true,
          },
        },
        contact_time: true,
        cash_down: true,
        file: {
          select: {
            file: true,
          },
        },
        inquiry_type: {
          select: {
            id: true,
          },
        },
        lead_source: {
          select: {
            id: true,
          },
        },
        lead_type: {
          select: {
            id: true,
          },
        },
        mailing_address: true,
        other_income: true,
        reference: true,
        seller: {
          select: {
            name: true,
            last_name: true,
            id: true,
            email: true,
          },
        },
      },
      where: {
        id: id,
      },
    });

    //await prisma?.$disconnect();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get all vehicles logic (listo)
export async function getAllVehicles() {
  try {
    const data = await prisma?.vehicles.findMany({
      select: {
        id: true,
        vehicle_type: {
          select: {
            type: true,
          },
        },
        vehicle_brands: {
          select: {
            brand: true,
          },
        },
        exterior_vehicle_colors: {
          select: {
            color: true,
          },
        },
        vehicle_conditions: {
          select: {
            condition: true,
          },
        },
        vehicle_fuel_tank_types: {
          select: {
            type: true,
          },
        },
        vehicle_identification_numbers: {
          select: {
            vin: true,
          },
        },
        vehicle_manufacture_years: {
          select: {
            year: true,
          },
        },
        vehicle_mileages: {
          select: {
            mileage: true,
          },
        },
        vehicle_models: {
          select: {
            model: true,
          },
        },
        vehicle_prices: {
          select: {
            price: true,
          },
        },
        vehicle_transmissions: {
          select: {
            transmission: true,
          },
        },
        entry_stock: true,
      },
    });

    //await prisma?.$disconnect();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get all appointments statuses logic (listo)
export async function getAllAppointmentStatuses() {
  try {
    const data = await prisma?.appointments_status.findMany();

    //await prisma?.$disconnect();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get all appointments logic (listo)
export async function getAllAppointments() {
  // const session = await auth();
  // const userRoleId = session?.user.user_has[0]?.role_id;
  // const userId = session?.user.id;

  try {
    // const adminRoles = [
    //   Roles.Superuser,
    //   Roles.Administrator,
    //   Roles.SalesManager,
    //   Roles.FinanceManager,
    // ];

    const data = await prisma?.appointments.findMany({
      select: {
        id: true,
        start_date: true,
        end_date: true,
        users: {
          select: {
            id: true,
            name: true,
            last_name: true,
          },
        },
        appointments_status: {
          select: {
            status: true,
          },
        },
        customers: {
          select: {
            id: true,
            name_lastname: true,
            email: true,
          },
        },
      },
      // where: {
      // ...(userRoleId && !adminRoles.includes(userRoleId)
      //   ? {
      //       OR: [
      //         {
      //           created_by: userId,
      //         },
      //         {
      //           user_id: userId,
      //         },
      //       ],
      //     }
      //   : null),
      // },
    });

    //await prisma?.$disconnect();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get an appointment by id logic
export async function getAppointmentById(id: number) {
  try {
    const data = await prisma?.appointments.findUnique({
      select: {
        id: true,
        start_date: true,
        end_date: true,
        users: {
          select: {
            id: true,
            name: true,
            last_name: true,
          },
        },
        appointments_status: {
          select: {
            status: true,
            id: true,
          },
        },
        customers: {
          select: {
            id: true,
            name_lastname: true,
            email: true,
          },
        },
      },
      where: {
        id,
      },
    });

    //await prisma?.$disconnect();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get all sellers users logic
export async function getSellersUsers() {
  try {
    const data = await prisma?.users.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        last_name: true,
        created_at: true,
        updated_at: true,
        emailVerified: true,
        password: false,
        user_has: {
          select: {
            role_id: true,
          },
        },
      },
      where: {
        user_has: {
          some: {
            role_id: {
              not: 1,
            },
            AND: {
              role_id: {
                not: 2,
              },
            },
          },
        },
        deleted_at: null,
      },
    });

    //await prisma?.$disconnect();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get all client types logic (listo)
export async function getAllClientTypes() {
  try {
    const data = await prisma?.client_types.findMany();

    prisma.$disconnect();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get a customer consent code
export async function getAConsentCode(code: string) {
  try {
    const data = await prisma.consent_code.findUnique({
      where: {
        token: code,
      },
      include: {
        customer: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            mobile_phone: true,
            country_phone_code_id: true,
            born_date: true,
            email: true,
            client_address: {
              select: {
                street: true,
                city: true,
                state: true,
                zip: true,
              },
            },
            seller: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    //await prisma.$disconnect();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get id states

export async function getIdStates() {
  try {
    const data = await prisma?.client_id_state.findMany();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get states
export async function getStates() {
  try {
    const data = await prisma?.states.findMany({
      select: {
        id: true,
        state: true,
        state_code: true,
      },
    });

    //await prisma.$disconnect();

    return data;
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();
  }
}

// get a customer appointment
export async function getCustomerAppointment(appointmentId: string) {
  const appId = parseInt(appointmentId);

  try {
    const data = await prisma.appointments.findUnique({
      where: {
        id: appId,
      },
      select: {
        customers: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
        users: {
          select: {
            name: true,
            last_name: true,
          },
        },
        start_date: true,
        end_date: true,
      },
    });

    //await prisma.$disconnect();

    return data;
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();
  }
}

// get customer sms template variables values`

export async function getCustomerSmsTemplateVariablesValues(customerId: string) {
  const customerIdNumber = parseInt(customerId);

  try {
    const data = await prisma.clients.findUnique({
      where: {
        id: customerIdNumber,
      },
      select: {
        first_name: true,
        last_name: true,
        email: true,
        home_phone: true,
        middle_initials: true,
        mobile_phone: true,
        salutation: true,
        suffix: true,
        work_phone: true,
        client_address: {
          select: {
            city: true,
            state: {
              select: {
                state: true,
              },
            },
            street: true,
            zip: true,
          },
        },
        lead_source: {
          select: {
            source: true,
          },
        },
        seller: {
          select: {
            name: true,
            last_name: true,
            mobile_phone: true,
            email: true,
          },
        },
        bdc: {
          select: {
            id: true,
            name: true,
            last_name: true,
            mobile_phone: true,
            email: true,
          },
        },
        finance_manager: {
          select: {
            id: true,
            name: true,
            last_name: true,
            mobile_phone: true,
            email: true,
          },
        },
        interested_vehicle: {
          select: {
            stock_no: true,
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
            title_license: {
              select: {
                asking_price: true,
                buy_now_price: true,
                floor_price: true,
                whole_price: true,
              },
            },
            exterior_vehicle_colors: {
              select: {
                color: true,
              },
            },
            vehicle_mileages: {
              select: {
                mileage: true,
              },
            },
            vehicle_trim: {
              select: {
                trim: true,
              },
            },
            vehicle_identification_numbers: {
              select: {
                vin: true,
              },
            },
            vehicle_manufacture_years: {
              select: {
                year: true,
              },
            },
          },
        },
      },
    });

    //await prisma.$disconnect();

    return data;
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();
  }
}

// return user data for login

type UserDataForLogin = {
  email: string;
  password: string | null;
  user_has: {
    role_id: number;
    role: {
      role: string;
    };
  }[];
} | null;

export const getUserEmailAndPassword = async (
  email: string | undefined,
): Promise<UserDataForLogin> => {
  try {
    const user = await prisma?.users.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        name: true,
        last_name: true,
        email: true,
        created_at: true,
        updated_at: true,
        username: true,
        img: true,
        password: true,
        user_has: {
          select: {
            role_id: true,
            role: {
              select: {
                role: true,
              },
            },
          },
        },
      },
    });

    //await prisma.$disconnect();

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.log(error);

    return null;
  }
};

// get credit app code

export const getCreditAppCode = async (code: string) => {
  try {
    const data = await prisma.credit_app_code.findUnique({
      where: {
        token: code,
      },
      select: {
        customer_id: true,
        code_expired: true,
      },
    });

    //await prisma.$disconnect();

    return data;
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();
  }
};

// get customer credit app info

export const getCustomerCreditAppData = async (customerId?: number) => {
  try {
    const creditAppData = await prisma.credit_app.findUnique({
      where: {
        client_id: customerId,
      },
    });

    const addressData = await prisma.credit_app_address.findFirst({
      where: {
        client_id: customerId,
      },
      include: {
        prev_address: true,
      },
    });

    const employmentData = await prisma.customer_employment.findMany({
      where: {
        client_id: customerId,
      },
      include: {
        customer_employment_address: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    const prevAddress: PrevAddress[] | undefined | null = addressData?.prev_address.map(
      (address) => ({
        id: address.id,
        address: address.prev_address,
        year: address.prev_year,
        month: address.prev_month_id,
        addressType: address.prev_address_type_id,
        rentMortAmt: address.prev_rent_mort,
        stateId: address.prev_state_id,
      }),
    );

    const filteredData = employmentData.filter((_, index) => index !== 0);

    const prevEmploymentData: PrevEmploymentStatus[] | null | undefined = filteredData.map(
      (el) => ({
        id: el.id,
        employmentName: el.previous_employer_name,
        addressId: el.customer_employment_address[0].id,
        address: el.customer_employment_address[0].previous_address,
        phoneNumber: el.customer_employment_address[0].previous_phone_number,
        employmentStatus: el.employment_status_id,
        occupation: el.occupation_id,
        year: el.year,
        month: el.month_id,
        incomeType: el.income_type_id,
        montlyIncome: el.montly_income,
        hourlyWage: el.hourlyWage,
        yearToDate: el.yearToDate,
      }),
    );

    const referencesData = await prisma.credit_app_reference.findMany({
      where: {
        customer_id: customerId,
      },
      include: {
        customer: {
          select: {
            credit_app_other_income: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    const references: References[] | undefined | null = referencesData.map((el) => ({
      id: el.id,
      name: el.name,
      address: el.address,
      phoneNumber: el.phone_number,
      relationship: el.relationship_id,
    }));

    let ssnVal = creditAppData?.ssn;
    let dateOfBirthVal = creditAppData?.date_of_birth;

    if (!ssnVal || !dateOfBirthVal) {
      const customerDefaultData = await prisma.clients.findUnique({
        where: {
          id: customerId,
        },
        select: {
          born_date: true,
          social_security: true,
        },
      });

      ssnVal = customerDefaultData?.social_security;
      dateOfBirthVal = customerDefaultData?.born_date;
    }

    const creditApp: CreditAppData = {
      start: {
        ssn: ssnVal,
        dateOfBirth: dateOfBirthVal,
        idType: creditAppData?.id_type_id,
        noId: creditAppData?.no_id,
        idNumber: creditAppData?.id_number,
        issueDate: creditAppData?.id_issue_date,
        expirationDate: creditAppData?.id_expiration_date,
        cashdown: creditAppData?.cash_down,
        gender: creditAppData?.gender_id,
        consent: creditAppData?.send_automated_sms,
        idState: creditAppData?.id_state_id,
      },
      address: {
        id: addressData?.id,
        currentAddress: addressData?.current_address,
        currentYear: addressData?.current_year,
        currentMonth: addressData?.current_month_id,
        currentAddressType: addressData?.current_address_type_id,
        currentRentMortAmt: addressData?.current_rent_mort,
        mailingAddress: addressData?.mailing_address,
        sameAsCurrentAddress: addressData?.mailing_same_as_current,
        currentStateId: addressData?.current_state_id,
        mailingStateId: addressData?.mailing_state_id,
        prevAddress: prevAddress,
      },
      employmentStatus: {
        id: employmentData[0]?.id,
        currentEmploymentName: employmentData[0]?.current_employer_name,
        addressId: employmentData[0]?.customer_employment_address[0].id,
        currentAddress: employmentData[0]?.customer_employment_address[0].current_address,
        currentPhoneNumber: employmentData[0]?.customer_employment_address[0].current_phone_number,
        currentEmploymentStatus: employmentData[0]?.employment_status_id,
        currentOccupation: employmentData[0]?.occupation_id,
        currentYear: employmentData[0]?.year,
        currentMonth: employmentData[0]?.month_id,
        currentIncomeType: employmentData[0]?.income_type_id,
        currentMontlyIncome: employmentData[0]?.montly_income,
        currentHourlyWage: employmentData[0]?.hourlyWage,
        currentYearToDate: employmentData[0]?.yearToDate,
        hasBankAccount: employmentData[0]?.has_bank_account,
        prevEmploymentData: prevEmploymentData,
      },
      references: {
        id: referencesData[0]?.customer?.credit_app_other_income[0]?.id,
        otherIncomeAmount: referencesData[0]?.customer?.credit_app_other_income[0]?.income_amount,
        otherIncomeSource: referencesData[0]?.customer?.credit_app_other_income[0]?.income_source,
        references: references,
      },
    };

    return creditApp;
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();
  }
};

// get id type

export const getIdTtype = async () => {
  try {
    const data = await prisma.client_id_type.findMany();

    //await prisma.$disconnect();

    return data;
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();
  }
};

// get gender

export const getGender = async () => {
  try {
    const data = await prisma.genders.findMany();

    //await prisma.$disconnect();

    return data;
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();
  }
};

// credit address month

export const getCreditAddressMonths = async () => {
  try {
    const data = await prisma?.credit_app_address_months.findMany();

    //await prisma?.$disconnect();

    return data;
  } catch (error) {
    console.log(error);
  }
};

// credit app address type

export const getCreditAppAddressType = async () => {
  try {
    const data = await prisma?.credit_app_address_type.findMany();

    //await prisma?.$disconnect();

    return data;
  } catch (error) {
    console.log(error);
  }
};

// address preliminary data

export const addressPreliminaryData = async (customerId?: number) => {
  try {
    const data = await prisma.credit_app_address.findFirst({
      where: {
        client_id: customerId,
      },
      select: {
        id: true,
        current_address: true,
        current_year: true,
        current_month_id: true,
        current_address_type_id: true,
        current_rent_mort: true,
        current_street: true,
        current_city: true,
        current_state: true,
        current_state_id: true,
        current_zip: true,
        current_county: true,
        mailing_address: true,
        mailing_street: true,
        mailing_state: true,
        mailing_city: true,
        mailing_state_id: true,
        mailing_zip: true,
        mailing_county: true,
      },
    });

    const data2 = await prisma.credit_app_address_prev.findMany({
      where: {
        credit_app_address_id: data?.id,
      },
      select: {
        id: true,
        credit_app_address_id: true,
        prev_address: true,
        prev_street: true,
        prev_city: true,
        prev_state_id: true,
        prev_zip: true,
        prev_county: true,
        prev_year: true,
        prev_month_id: true,
        prev_state: true,
        prev_address_type_id: true,
        prev_rent_mort: true,
      },
    });

    //await prisma.$disconnect();

    return { data, data2 };
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();
  }
};

export const getCustomerAddress = async (customerId?: number) => {
  try {
    const address = await prisma.clients.findUnique({
      where: {
        id: customerId,
      },
      select: {
        client_address: {
          include: {
            state: true,
            county: true,
          },
        },
      },
    });

    return address;
  } catch (error) {
    console.log(error);
  }
};

// employment status

export const getEmploymentStatus = async () => {
  try {
    const data = await prisma.employment_statuses.findMany();

    //await prisma.$disconnect();

    return data;
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();
  }
};

export const getOccupation = async () => {
  try {
    const data = await prisma.customer_occupation.findMany();

    //await prisma.$disconnect();

    return data;
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();
  }
};

export const getIncomeType = async () => {
  try {
    const data = await prisma.customer_income_type.findMany();

    //await prisma.$disconnect();

    return data;
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();
  }
};

export const getCreditAppEmploymentPreliminary = async (customerId?: number) => {
  try {
    const data = await prisma.customer_employment.findMany({
      where: {
        client_id: customerId,
      },
      include: {
        customer_employment_address: true,
      },
    });

    //await prisma.$disconnect();

    return data;
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();
  }
};

export const getReferenceRelationship = async () => {
  try {
    const data = await prisma.credit_app_reference_relationship.findMany();

    //await prisma.$disconnect();

    return data;
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();
  }
};

export const getChecks = async () => {
  try {
    const data = await prisma.consent_checks.findMany();

    //await prisma.$disconnect();

    return data;
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();
  }
};

export const getStatement = async () => {
  try {
    const data = await prisma.consent_terms.findFirst();

    //await prisma.$disconnect();

    return data;
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();
  }
};

export const getCustomerRelatedUsers = async (customerId: string) => {
  try {
    const customerData = await prisma.leads.findFirst({
      where: {
        is_active: true,
        id: Number(customerId),
      },
      select: {
        sales_rep_id: true,
        bdc_id: true,
        sales_manager_id: true,
        finance_manager_id: true,
      },
    });

    const relatedUsersArray = customerData ? Object.values(customerData) : [];

    return relatedUsersArray;
  } catch (error) {
    console.log(error);

    return null;
  }
};
