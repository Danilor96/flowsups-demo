import { seedSmsTemplates } from './smsTemplates';

export const seedAutomatedReviews = [
  {
    id: 1,
    invitation: 'Please leave us a review of your experience!',
    enable_automated_review_invitations: true,
  },
];

export const seedAutomaticEmails = [
  {
    id: 1,
    internet_lead_auto_response: true,
    appointment_reminder: true,
    appointment_reminder_days: '2',
    appointment_scheduled_on_site: true,
    appointment_rescheduled_on_site: true,
    appointment_scheduled_online: true,
    appointment_rescheduled_online: true,
    sold_deals_thank_you: true,
    sold_deals_thank_you_days: '3',
    vehicle_price_drop: true,
    customer_status_id: 1,
    deposit_payment_receipt: true,
    deposit_payment_receipt_send_immediately_id: 1,
    stipulation_request: true,
    consent_sms: false,
    consent_sms_template_id: null,
    appointment_confirmation: false,
    appointment_confirmation_template_id: null,
    appointment_reminder_template_id: null,
    appointment_reschedule_online_template_id: null,
    appointment_reschedule_on_site_template_id: null,
    appointment_schedule_online_template_id: null,
    appointment_schedule_on_site_template_id: null,
    deposit_payment_recipient_template_id: null,
    internet_lead_auto_response_template_id: null,
    sold_deals_thank_you_template_id: null,
    stipulation_request_template_id: null,
    vehicle_price_drop_template_id: null,
  },
];

export const seedAutomaticSms = [
  {
    id: 1,
    appointment_reminder: true,
    appointment_reminder_timing: '24 hours',
    appointment_schedule_on_site: true,
    appointment_schedule_online: true,
    appointment_reschedule_onSite: true,
    appointment_reschedule_online: true,
    stipulation_request: true,
    consent_sms: false,
    appointment_confirmation: true,
    credit_app: false,
    appointment_reminder_template_id: null,
    appointment_schedule_on_site_template_id: 1,
    appointment_schedule_online_template_id: 1,
    appointment_reschedule_onSite_template_id: 1,
    appointment_reschedule_online_template_id: 1,
    stipulation_request_template_id: null,
    consent_sms_template_id: null,
    appointment_confirmation_template_id: 1,
    credit_app_template_id: null,
    appointment_confirmation_template: seedSmsTemplates[0],
    schedule_on_site_template: seedSmsTemplates[0],
    schedule_online_template: seedSmsTemplates[0],
    reschedule_onSite_template: seedSmsTemplates[0],
    reschedule_online_template: seedSmsTemplates[0],
  },
];

export const seedCustomBeBackReasons = [
  { id: 1, reason: 'Wants to think about it' },
  { id: 2, reason: 'Needs to check with someone else' },
];

export const seedCustomLostReasons = [
  { id: 1, reason: 'Purchased elsewhere' },
  { id: 2, reason: 'Could not reach agreement' },
];

export const seedCustomNoSaleReasons = [
  { id: 1, reason: 'Financing not approved' },
  { id: 2, reason: 'Vehicle not available' },
];

export const seedCustomerSettings = [
  {
    id: 1,
    lead_lost_after: 30,
    active_lost_customer: false,
    complete_all_open_tasks: false,
    set_active_lost_customer_status_to: 12,
    followup_task_visibility: 1,
    show_followup: false,
    ignore_first_name: false,
  },
];

export const seedTaskSettings = [
  {
    id: 1,
    first_span_limit_id: 2,
    second_span_limit_id: 3,
    third_span_limit_id: 4,
  },
];

export const seedEmailToLead = [
  { id: 1, lead: 'prospect@example.com' },
];

export const seedPaymentTypes = [
  { id: 1, type: 'Cash' },
  { id: 2, type: 'Check' },
  { id: 3, type: 'Credit Card' },
];

export const seedTrackingCodes = [
  { id: 1, code: 'demo-tracking-code' },
];

export const seedUnknownAdfElements = [
  { id: 1, element: 'unknown-element-example' },
];

export const seedVoiceAndSms = [
  {
    id: 1,
    system_phone_for_publishing: '+13055550101',
    system_email_address_for_publishing: 'demo@flowsups.com',
    email_verfified: true,
    forward_incoming_calls_to: '+13055550102',
    forward_incoming_calls_option_id: 1,
    dealership_phone_number: true,
    disable_auto_emails_to_customer: false,
    disable_sending_auto_sms_over_montly_limit: false,
    for_buying_vehicles_from_customers: true,
    in_spanish: false,
    include_dealership_address: true,
    email_name_displayed_id: 1,
  },
];

export const seedIncomingCallsOptions = [
  { id: 1, option: 'Voicemail' },
  { id: 2, option: 'Forward to a phone number' },
];

export const seedEmailNameDisplayed = [
  { id: 1, name: 'Flowsups' },
  { id: 2, name: 'Sales Team' },
];

export const seedSmsLimitWarningRecipients = [
  { id: 1, recipient: 'manager@flowsups.com' },
];

export const seedBusiness = [
  {
    id: 1,
    name: 'Flowsups Demo Dealership',
    image: '',
    store_id: 'STORE-001',
    store_license_number: 'LIC-001',
    store_alias: 'Flowsups',
    sales_tax_license: 'TAX-001',
    ein_number: '00-0000000',
    fax_number: '+13055550100',
    email: 'demo@flowsups.com',
    county: 'Miami-Dade',
    county_code: 'FL',
    is_Mailing_Address_Same_As_Physical: true,
    appointment_reminder_time_id: 1,
    task_reminder_time_id: 1,
  },
];

export const seedTimeSpan = [
  { id: 1, time_span: '5 minutes' },
  { id: 2, time_span: '10 minutes' },
  { id: 3, time_span: '15 minutes' },
  { id: 4, time_span: '30 minutes' },
  { id: 5, time_span: '60 minutes' },
  { id: 6, time_span: '90 minutes' },
  { id: 7, time_span: '120 minutes' },
];