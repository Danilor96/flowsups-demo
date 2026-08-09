export interface LeadNote {
  createdAt: Date;
  note: string;
}

export interface LeadHistory {
  id: number;
  createdBy: string;
  lead: string;
  createdAt: Date;
  leadId: number;
  leadNote?: LeadNote | null;
  type: 'LEAD';
}

export interface TaskLeadHistory {
  id: number;
  dueDate: Date;
  statusId: number;
  subject: string;
  description: string;
  assignedTo: string;
  createdBy: string;
  createdAt: Date;
  finishedAt?: Date | null;
  type: 'TASK';
}
