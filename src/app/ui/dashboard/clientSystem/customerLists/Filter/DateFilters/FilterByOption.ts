import { ClientType, SpecificClients } from '@/app/libs/definitions';
import { startOfYesterday, endOfYesterday, isWithinInterval } from 'date-fns';

function getNestedValue(obj: any, path: string): any {
  if (!path) return undefined;
  const keys = path.split('.');
  let result = obj;
  let valueDate: Date | null = null;

  if (path === 'vehicle_delivery') {
    if (!result.vehicle_delivery || result.vehicle_delivery.length === 0) return undefined;
    valueDate = result.vehicle_delivery[result.vehicle_delivery.length - 1]?.end_date;
  }
  if (path === 'visit_date') {
    if (!result.appointment || result.appointment.length === 0) return undefined;
    valueDate = result.appointment?.find((el: { end_date: Date | null }) => el.end_date)?.end_date;
  }
  if (path === 'deposit_client') {
    if (!result.deposit_client || result.deposit_client.length === 0) return undefined;
    valueDate = result.deposit_client[result.deposit_client.length - 1].deposit_date;
  }

  if (valueDate) return new Date(valueDate);

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return undefined;
    }
  }

  return new Date(result);
}

export function FilterByOption(
  filteredData: ClientType[] | SpecificClients,
  dateFieldPath: string,
  opt: string,
  filters: {
    dateFilter: {
      createdDate?: string | null;
      fromDate?: Date | null;
      toDate?: Date | null;
      createdDateAlterInput?: number | null;
      defaultText: string;
      previousUpcomingInputs: {
        optionSelectedValue: string;
        optionSelectedName: string;
      };
    };
  },
  helpers: {
    todaySpan: (date: Date) => boolean;
    tomorrowSpan: (date: Date) => boolean;
    previousSpans: (value: string, date: Date) => boolean;
    upcomingSpans: (value: string, date: Date) => boolean;
    quarters: (quarter: number, date: Date) => boolean;
    days: (value: string, date: Date) => boolean;
    months: (value: string, date: Date) => boolean;
  },
) {
  if (!filteredData) return [];

  let localFilteredData = [...filteredData];

  switch (opt) {
    // today

    case '2':
      localFilteredData = localFilteredData?.filter((el) => {
        const deadline = getNestedValue(el, dateFieldPath) as Date;

        return deadline ? helpers.todaySpan(deadline) : null;
      });
      break;

    // tomorrow
    case '3':
      localFilteredData = localFilteredData?.filter((el) => {
        const deadline = getNestedValue(el, dateFieldPath) as Date;

        return deadline ? helpers.tomorrowSpan(deadline) : null;
      });
      break;

    // previous
    case '4':
      // previous span
      localFilteredData = localFilteredData?.filter((el) => {
        const deadline = getNestedValue(el, dateFieldPath) as Date;

        return deadline
          ? helpers.previousSpans(
              filters.dateFilter.previousUpcomingInputs.optionSelectedValue,
              deadline,
            )
          : false;
      });
      break;

    // upcoming
    case '5':
      // upcoming span
      localFilteredData = localFilteredData?.filter((el) => {
        const deadline = getNestedValue(el, dateFieldPath) as Date;

        return deadline
          ? helpers.upcomingSpans(
              filters.dateFilter.previousUpcomingInputs.optionSelectedValue,
              deadline,
            )
          : false;
      });
      break;

    // first quarter
    case '6':
      localFilteredData = localFilteredData?.filter((el) => {
        const deadline = getNestedValue(el, dateFieldPath) as Date;

        return deadline ? helpers.quarters(1, deadline) : false;
      });
      break;

    // second quarter
    case '7':
      localFilteredData = localFilteredData?.filter((el) => {
        const deadline = getNestedValue(el, dateFieldPath) as Date;

        return deadline ? helpers.quarters(2, deadline) : false;
      });
      break;

    // third quarter
    case '8':
      localFilteredData = localFilteredData?.filter((el) => {
        const deadline = getNestedValue(el, dateFieldPath) as Date;

        return deadline ? helpers.quarters(3, deadline) : false;
      });
      break;

    // fourth quarter
    case '9':
      localFilteredData = localFilteredData?.filter((el) => {
        const deadline = getNestedValue(el, dateFieldPath) as Date;

        return deadline ? helpers.quarters(4, deadline) : false;
      });
      break;

    // last x days
    case '10':
      localFilteredData = localFilteredData?.filter((el) => {
        const deadline = getNestedValue(el, dateFieldPath) as Date;

        return deadline
          ? helpers.days(filters.dateFilter.createdDateAlterInput?.toString() || '', deadline)
          : false;
      });
      break;

    // last x months
    case '11':
      localFilteredData = localFilteredData?.filter((el) => {
        const deadline = getNestedValue(el, dateFieldPath) as Date;

        return deadline
          ? helpers.months(filters.dateFilter.createdDateAlterInput?.toString() || '', deadline)
          : false;
      });
      break;

    // between
    case '13':
      const fromDate = filters.dateFilter.fromDate;
      const toDate = filters.dateFilter.toDate;
      localFilteredData = localFilteredData?.filter((el) => {
        const deadline = getNestedValue(el, dateFieldPath) as Date;
        if (!deadline) return false;
        if (fromDate && toDate) {
          return deadline >= fromDate && deadline <= toDate;
        }
        if (fromDate) {
          return deadline.getTime() >= fromDate.getTime();
        }
        if (toDate) {
          return deadline <= toDate;
        }
        return true;
      });
      break;

    // yesterday
    case '12':
      localFilteredData = localFilteredData?.filter((el) => {
        const deadline = getNestedValue(el, dateFieldPath) as Date;
        const start = startOfYesterday();
        const end = endOfYesterday();

        return isWithinInterval(deadline, { start, end });
      });
      break;
  }

  return localFilteredData;
}
