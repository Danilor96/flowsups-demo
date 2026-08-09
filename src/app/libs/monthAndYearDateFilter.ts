import { startOfMonth, endOfMonth, subMonths, startOfWeek, endOfWeek, addWeeks } from 'date-fns';

export function getMonthDateRangeParams(
  monthIndex: number,
  year: number,
  weekIndex?: number,
  weekStartsOn: 0 | 1 = 1,
) {
  const date = new Date(year, monthIndex, 1);

  let startDate: Date;
  let endDate: Date;

  if (typeof weekIndex === 'number' && weekIndex >= 0) {
    const firstWeekStart = startOfWeek(date, { weekStartsOn });

    startDate = addWeeks(firstWeekStart, weekIndex - 1);

    endDate = endOfWeek(startDate, { weekStartsOn });
  } else {
    startDate = startOfMonth(date);

    endDate = endOfMonth(date);
  }

  const dateFilter = {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };

  return new URLSearchParams(dateFilter).toString();
}

export function getPreviousMonthDateRange(date: Date): { startDate: string; endDate: string } {
  const previousMonth = subMonths(date, 1);

  const previousMontStartDate = startOfMonth(previousMonth);
  const previousMontEndDate = endOfMonth(previousMonth);

  const dateFilter = {
    startDate: previousMontStartDate.toISOString(),
    endDate: previousMontEndDate.toISOString(),
  };

  return dateFilter;
}

interface DateRangeFilter {
  gte?: Date;
  lte?: Date;
}

export function buildDateRangeFilter(
  startDateString: string | null,
  endDateString: string | null,
): DateRangeFilter {
  const filter: DateRangeFilter = {};

  if (startDateString && typeof startDateString === 'string') {
    const startDate = new Date(startDateString);

    if (isNaN(startDate.getTime())) {
      throw new Error(`Invalid start date provided: ${startDateString}`);
    }
    filter.gte = startDate;
  }

  if (endDateString && typeof endDateString === 'string') {
    const endDate = new Date(endDateString);

    if (isNaN(endDate.getTime())) {
      throw new Error(`Invalid end date provided: ${endDateString}`);
    }
    filter.lte = endDate;
  }

  return filter;
}
