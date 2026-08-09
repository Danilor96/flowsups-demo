export interface VisitReportData {
  visitDate: Date;
  customerId: number;
  customerName: string;
  homePhone: string;
  cellPhone: string;
  email: string;
  salesRepName: string;
  interestedVehicle: {
    model: string;
    brand: string;
    year: string;
    vin: string;
  };
  customerStatus: string;
  source: string;
  comments: string;
  salesRepId: number;
}
