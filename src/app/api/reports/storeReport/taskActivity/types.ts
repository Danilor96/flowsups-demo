export interface TaskActivityData {
  customerFullName: string;
  customerPhoneNumber: string;
  customerEmail: string;
  customerId: number | null;
  taskSubject: string;
  salesRepName: string;
  salesRepId: number;
  taskDueDate: Date;
  taskStatusId: number;
  taskId: number;
  taskCreatedAt: Date;
}
