import { ClientType, InterestedVehicle } from '@/app/libs/definitions';
import { currencyFormat } from '../../../reports/utils';

export const generateDealColumns = (client: ClientType) => {
  const el = client;
  const deal = el.deal && el.deal.length > 0 ? el.deal[el.deal.length - 1] : null;

  return {
    bank: deal ? `${deal.bank?.bank || ''}` : 'N/A',
    down_payment: deal ? currencyFormat.format(Number(deal.downpayment || 0)) : 'N/A',
    paid: deal ? currencyFormat.format(Number(deal.paid || 0)) : 'N/A',
    deferred_money: deal ? currencyFormat.format(Number(deal.deferredDownpayment || 0)) : 'N/A',
    front_end_profit: deal ? currencyFormat.format(Number(deal.frontend || 0)) : 'N/A',
    back_end_profit: deal ? currencyFormat.format(Number(deal.backend || 0)) : 'N/A',
    total_profit: deal ? currencyFormat.format(Number(deal.totalProfit || 0)) : 'N/A',
    source: el.lead_source ? `${el.lead_source.source}` : 'N/A'
  };
};

export const daysOld = (creationDate: Date) => {
  const creation = new Date(creationDate).getTime() / 1000 / 60 / 60 / 24;
  const today = new Date().getTime() / 1000 / 60 / 60 / 24;

  const daysOld = Math.trunc(today - creation);

  // const returnedText = daysOld < 1 ? 'Today' : daysOld > 0 && daysOld < 2 ? '1 day' : `${daysOld} days`;
  const returnedText = daysOld < 1 ? '0' : daysOld > 0 && daysOld < 2 ? '1' : `${daysOld}`;
  const textDate = new Intl.DateTimeFormat('default', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
    .format(new Date(creationDate))
    .replace(/\./g, '')
    .toUpperCase();

  return `${textDate} (${returnedText})`;
};

export const enum updateDataEvent {
  depositCustomersList = 'depositCustomersList',
  customersList = 'customersList'
}

export const formatVehicle = (interestedVehicle: InterestedVehicle) => {
  if(!interestedVehicle) return '';
  const year = interestedVehicle?.vehicle_manufacture_years?.year;
  const brand = interestedVehicle?.vehicle_brands.brand.toUpperCase();
  const model = interestedVehicle?.vehicle_models.model;
  const vin = interestedVehicle?.vehicle_identification_numbers.vin;
  const lastSixVin = vin?.slice(vin.length - 6, vin.length);

  return `${year} ${brand} ${model} [${lastSixVin}]`;
};

export const formatOtherVehicle = (vehicle: {
  id: number;
  make: string | null;
  model: string | null;
  year: string | null;
  stock_no: string | null;
  vin: string | null;
  created_at: Date;
}) => {
  if (!vehicle) return '';
  const year = vehicle?.year;
  const brand = vehicle?.make?.toUpperCase();
  const model = vehicle?.model;
  const vin = vehicle?.vin;
  const stockNo = vehicle?.stock_no;
  const stockNoLength = vehicle.stock_no?.length || 0;
  const slicedStockNo = stockNoLength >= 6 ? stockNo?.slice(stockNoLength - 6, stockNoLength) : stockNo;
  const lastSixStockNumber = slicedStockNo || '';

  return `${year} ${brand} ${model} [${lastSixStockNumber}]`;
};