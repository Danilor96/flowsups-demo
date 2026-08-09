import {
  CategoriesEnumToString,
  LeadHistoryCategoriesEnum,
  subcategoryToGroupMap,
} from '@/app/ui/dashboard/clientSystem/clientDetail/leadHistory/categoriesIdMap';

export interface ActivityReport {
  leadId: number;
  customerName: string;
  customerId: number;
  customerStatusId: number;
  activityStatus: string;
  activityStatusId: number;
  activityType: string;
  activityTypeId: number;
  dispositionDescription: string;
  subject: string;
  assignedRepOnActivity: string;
  salesRepOnActivityId: number | null;
  assignedSalesRepOnCustomer: string;
  salesRepOnCustomerId: number | null;
  lastUpdatedDate: Date | null;
  lastUpdatedBy: string;
}

export const leadTitle = (leadId: number, lead?: string) => {
  const title = subcategoryToGroupMap[leadId] || null;
  if (title) {
    return {
      title: `${title}`,
      subTitle: `${CategoriesEnumToString[leadId as LeadHistoryCategoriesEnum]}`,
    };
  }

  if (lead) {
    return {
      title: `${lead.replace(lead[0], lead[0].toUpperCase())}:`,
    };
  }

  return { title: 'Other:' };
};
