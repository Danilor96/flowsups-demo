export interface SmsData {
  message: string;
  dateSent: Date | null;
  fileAttachment: Object | null;
  clientPhoneNumber: string;
  user: string;
  customer: string;
  sentByUser: boolean;
  sent: boolean;
  delivered: boolean;
  failed: boolean;
}

export interface SmsDetail {
  customerName?: string;
  customerId?: number;
  smsData: SmsData[];
  customerStatus: string;
}
