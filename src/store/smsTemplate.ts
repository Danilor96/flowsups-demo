import {
  AppointmentSmsTemplate,
  SingleClient,
  RescheduleSmsTemplate,
} from '@/app/libs/definitions';
import { create } from 'zustand';

interface SmsTemplate {
  replaceVariables: (template: string, data: any) => string;
  dataObject: (singleCLientData: SingleClient, consentLink?: string, creditAppLink?: string) => any;
}

export const smsTemplateStore = create<SmsTemplate>((set) => ({
  replaceVariables: (template, data) => {
    return template.replace(/{(\w+\.\w+)}/g, (_, key) => {
      const keys = key.split('.');
      return keys.reduce((obj: any, k: any) => (obj ? obj[k] : ''), data);
    });
  },
  dataObject: (singleCLientData, consentLink, creditAppLink) => {
    return {
      customer: {
        first_name: singleCLientData?.first_name,
        last_name: singleCLientData?.last_name,
        email: singleCLientData?.email,
        city: singleCLientData?.client_address?.city,
        home_phone: singleCLientData?.home_phone,
        lead_source: singleCLientData?.lead_source?.source,
        middle_name: singleCLientData?.middle_initials,
        mobile: singleCLientData?.mobile_phone,
        salutation: singleCLientData?.salutation,
        state: singleCLientData?.client_address?.state.state,
        street: singleCLientData?.client_address?.street,
        suffix: singleCLientData?.suffix,
        work_phone: singleCLientData?.work_phone,
        zip: singleCLientData?.client_address?.zip,
        assigned_sales_rep: `${singleCLientData?.seller?.name || ''} ${
          singleCLientData?.seller?.last_name || ''
        }`,
        assigned_sales_rep_first_name: singleCLientData?.seller?.name || '',
        assigned_sales_rep_last_name: singleCLientData?.seller?.last_name || '',
        assigned_bdc_rep: `${singleCLientData?.bdc?.name || ''} ${
          singleCLientData?.bdc?.last_name || ''
        }`,
        assigned_bdc_rep_first_name: singleCLientData?.bdc?.name || '',
        assigned_bdc_rep_last_name: singleCLientData?.bdc?.last_name || '',
        consent_link: consentLink ? consentLink : '(This is where the consent link goes)',
        credit_app_link: creditAppLink ? creditAppLink : '(This is where the credit app link goes)',
      },
      admin: {
        sales_rep_email: singleCLientData?.seller?.email,
        sales_rep_mobile: singleCLientData?.seller?.mobile_phone,
        [`today's_date`]: new Date(),
      },
      inventory: {
        interested_vehicle: `${singleCLientData?.interested_vehicle?.vehicle_brands?.brand} ${singleCLientData?.interested_vehicle?.vehicle_models?.model}`,
        interested_vehicle_asking_price:
          singleCLientData?.interested_vehicle?.title_license?.asking_price,
        interested_vehicle_color:
          singleCLientData?.interested_vehicle?.exterior_vehicle_colors?.color,
        interested_vehicle_make: singleCLientData?.interested_vehicle?.vehicle_brands?.brand,
        interested_vehicle_mileage: singleCLientData?.interested_vehicle?.vehicle_mileages?.mileage,
        interested_vehicle_model: singleCLientData?.interested_vehicle?.vehicle_models?.model,
        interested_vehicle_new_price:
          singleCLientData?.interested_vehicle?.title_license?.buy_now_price,
        interested_vehicle_old_price:
          singleCLientData?.interested_vehicle?.title_license?.floor_price,
        interested_vehicle_price: singleCLientData?.interested_vehicle?.title_license?.whole_price,
        interested_vehicle_trim: singleCLientData?.interested_vehicle?.vehicle_trim?.trim,
        interested_vehicle_vin:
          singleCLientData?.interested_vehicle?.vehicle_identification_numbers?.vin,
        interested_vehicle_year:
          singleCLientData?.interested_vehicle?.vehicle_manufacture_years?.year,
      },
    };
  },
}));

// appointment sms template

interface AppointmentSmsTemplateInterface {
  appointmentSmsTemplate: AppointmentSmsTemplate;
  rescheduleSmsTemplate: RescheduleSmsTemplate;
  getRescheduleSmsTemplate: () => Promise<void>;
  getAppointmentSmsTemplate: () => Promise<void>;
}

export const appointmentSmsTemplateStore = create<AppointmentSmsTemplateInterface>((set) => ({
  appointmentSmsTemplate: null,
  rescheduleSmsTemplate: null,
  getRescheduleSmsTemplate: async () => {
    const res = await fetch('/api/rescheduleSms');

    const json = await res.json();

    set({ rescheduleSmsTemplate: json });
  },
  getAppointmentSmsTemplate: async () => {
    const data = await (await fetch('/api/appointmentSmsTemplate')).json();

    set({ appointmentSmsTemplate: data });
  },
}));
