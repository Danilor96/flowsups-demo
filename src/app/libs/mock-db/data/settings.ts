export const seedClientStatuses = [
  { id: 1, status: 'New' },
  { id: 2, status: 'Contacted' },
  { id: 3, status: 'Credit App' },
  { id: 4, status: 'Delivery' },
  { id: 5, status: 'Undelivered' },
  { id: 6, status: 'Appointment' },
  { id: 7, status: 'Show' },
  { id: 8, status: 'No Show up' },
  { id: 9, status: 'Deposit' },
  { id: 10, status: 'Sold' },
  { id: 11, status: 'Paid' },
  { id: 12, status: 'Lost' },
];

export const seedLeadSources = [
  { id: 1, source: 'Website' },
  { id: 2, source: 'Facebook' },
  { id: 3, source: 'Instagram' },
  { id: 4, source: 'Google' },
  { id: 5, source: 'Referral' },
  { id: 6, source: 'Walk-in' },
  { id: 7, source: 'Phone Call' },
  { id: 8, source: 'Email' },
  { id: 9, source: 'TikTok' },
  { id: 10, source: 'Craigslist' },
  { id: 11, source: 'Other' },
];

export const seedLeadTypes = [
  { id: 1, type: 'Cash' },
  { id: 2, type: 'Finance' },
  { id: 3, type: 'Lease' },
  { id: 4, type: 'Internet Lead' },
  { id: 5, type: 'Walk-in' },
  { id: 6, type: 'Phone' },
];

export const seedLeadTemperatures = [
  { id: 1, temperature: 'Hot' },
  { id: 2, temperature: 'Warm' },
  { id: 3, temperature: 'Cold' },
];

export const seedClientTypes = [
  { id: 1, type: 'Buyer' },
  { id: 2, type: 'Seller' },
  { id: 3, type: 'Both' },
  { id: 4, type: 'Referrer' },
  { id: 5, type: 'Walk-in' },
];

export const seedContactMethods = [
  { id: 1, method: 'Email' },
  { id: 2, method: 'Phone' },
  { id: 3, method: 'Text' },
  { id: 4, method: 'In Person' },
];

export const seedContactTimes = [
  { id: 1, time: 'Morning' },
  { id: 2, time: 'Afternoon' },
  { id: 3, time: 'Evening' },
];

export const seedLanguages = [
  { id: 1, language: 'English' },
  { id: 2, language: 'Spanish' },
  { id: 3, language: 'Portuguese' },
  { id: 4, language: 'Creole' },
];

export const seedInquiryTypes = [
  { id: 1, type: 'New Vehicle' },
  { id: 2, type: 'Used Vehicle' },
  { id: 3, type: 'Trade-in' },
  { id: 4, type: 'Service' },
];

export const seedGenders = [
  { id: 1, gender: 'Male' },
  { id: 2, gender: 'Female' },
  { id: 3, gender: 'Other' },
];

export const seedStates = [
  { id: 1, state: 'Alabama', state_code: 'AL' },
  { id: 2, state: 'California', state_code: 'CA' },
  { id: 3, state: 'Florida', state_code: 'FL' },
  { id: 4, state: 'Georgia', state_code: 'GA' },
  { id: 5, state: 'New Jersey', state_code: 'NJ' },
  { id: 6, state: 'New York', state_code: 'NY' },
  { id: 7, state: 'North Carolina', state_code: 'NC' },
  { id: 8, state: 'Texas', state_code: 'TX' },
];

export const seedUserStatuses = [
  { id: 1, status: 'Active' },
  { id: 2, status: 'Inactive' },
];

export const seedRoleStatuses = [
  { id: 1, status: 'active' },
  { id: 2, status: 'deactive' },
];

export const seedTaskStatuses = [
  { id: 1, status: 'Pending' },
  { id: 2, status: 'Accepted' },
  { id: 3, status: 'Completed' },
  { id: 4, status: 'Cancelled' },
  { id: 5, status: 'In Progress' },
  { id: 6, status: 'Follow Up' },
];

export const seedAppointmentStatuses = [
  { id: 1, status: 'Scheduled' },
  { id: 2, status: 'Confirmed' },
  { id: 3, status: 'Canceled' },
  { id: 4, status: 'Rescheduled' },
  { id: 5, status: 'No Show' },
  { id: 6, status: 'Completed' },
];

export const seedDepositMethods = [
  { id: 1, method: 'Cash' },
  { id: 2, method: 'Credit Card' },
  { id: 3, method: 'Debit Card' },
  { id: 4, method: 'Check' },
  { id: 5, method: 'Bank Transfer' },
];

export const seedDayTimes = [
  { id: 1, time: '08:00 AM' },
  { id: 2, time: '09:00 AM' },
  { id: 3, time: '10:00 AM' },
  { id: 4, time: '11:00 AM' },
  { id: 5, time: '12:00 PM' },
  { id: 6, time: '01:00 PM' },
  { id: 7, time: '02:00 PM' },
  { id: 8, time: '03:00 PM' },
  { id: 9, time: '04:00 PM' },
  { id: 10, time: '05:00 PM' },
  { id: 11, time: '06:00 PM' },
  { id: 12, time: '07:00 PM' },
  { id: 13, time: '08:00 PM' },
];

export const seedDayweeks = [
  { id: 1, day: 'Monday' },
  { id: 2, day: 'Tuesday' },
  { id: 3, day: 'Wednesday' },
  { id: 4, day: 'Thursday' },
  { id: 5, day: 'Friday' },
  { id: 6, day: 'Saturday' },
  { id: 7, day: 'Sunday' },
];

export const seedReminderTimes = [
  { id: 1, time: '15 minutes' },
  { id: 2, time: '30 minutes' },
  { id: 3, time: '1 hour' },
  { id: 4, time: '1 day' },
  { id: 5, time: '2 days' },
];

export const seedLostReasons = [
  { id: 1, reason: 'Price' },
  { id: 2, reason: 'Financing' },
  { id: 3, reason: 'Found another vehicle' },
  { id: 4, reason: 'No response' },
  { id: 5, reason: 'Bad credit' },
  { id: 6, reason: 'Other' },
];

export const seedCreditAppListStatuses = [
  { id: 1, status: 'Not Started' },
  { id: 2, status: 'In Progress' },
  { id: 3, status: 'Submitted' },
  { id: 4, status: 'Approved' },
  { id: 5, status: 'Denied' },
  { id: 6, status: 'Funded' },
  { id: 7, status: 'Declined' },
];

export const seedFundingListStatuses = [
  { id: 1, status: 'Pending' },
  { id: 2, status: 'Funded' },
  { id: 3, status: 'Returned' },
  { id: 4, status: 'Charged Back' },
];

export const seedCallStatuses = [
  { id: 1, status: 'queued' },
  { id: 2, status: 'ringing' },
  { id: 3, status: 'in-progress' },
  { id: 4, status: 'completed' },
  { id: 5, status: 'busy' },
  { id: 6, status: 'failed' },
  { id: 7, status: 'no-answer' },
  { id: 8, status: 'canceled' },
];

export const seedLeadStatuses = [
  { id: 1, status: 'New Lead' },
  { id: 2, status: 'In Contact' },
  { id: 3, status: 'Appointment Set' },
  { id: 4, status: 'Deal In Progress' },
  { id: 5, status: 'Sold' },
  { id: 6, status: 'Lost' },
];

export const seedClientDetailLeads = [
  { id: 1, lead: 'New' },
  { id: 2, lead: 'Follow Up' },
  { id: 3, lead: 'No Answer' },
  { id: 4, lead: 'Left Message' },
  { id: 5, lead: 'Spoke' },
];

export const seedSmsStatuses = [
  { id: 1, status: 'sent' },
  { id: 2, status: 'delivered' },
  { id: 3, status: 'failed' },
  { id: 4, status: 'read' },
];

export const seedSettingsStores: Record<string, any[]> = {
  client_status: seedClientStatuses,
  lead_sources: seedLeadSources,
  lead_types: seedLeadTypes,
  lead_temperature: seedLeadTemperatures,
  client_types: seedClientTypes,
  contact_methods: seedContactMethods,
  contact_time: seedContactTimes,
  languages: seedLanguages,
  inquiry_types: seedInquiryTypes,
  genders: seedGenders,
  states: seedStates,
  user_status: seedUserStatuses,
  role_status: seedRoleStatuses,
  task_status: seedTaskStatuses,
  deposit_methods: seedDepositMethods,
  day_times: seedDayTimes,
  user_schedule_dayweek: seedDayweeks,
  reminderTime: seedReminderTimes,
  lost_reasons: seedLostReasons,
  credit_app_list_status: seedCreditAppListStatuses,
  funding_list_status: seedFundingListStatuses,
  call_statuses: seedCallStatuses,
  lead_status: seedLeadStatuses,
  client_detail_leads: seedClientDetailLeads,
  sms_status: seedSmsStatuses,
};
