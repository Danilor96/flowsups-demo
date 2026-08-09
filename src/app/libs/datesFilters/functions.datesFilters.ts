import { Datefilter } from '@/store/customerList/types';
import { transformDateToQuery } from '@/store/filtersHandling';
import { buildDateQueryString } from '../buildDatePrismaFilter';

interface DateConfigs {
  date: Datefilter;
  suffix?: string | null;
}

export const processDateFilters = (dateConfigs: DateConfigs[]) => {
  const queryStrings = [];
  const options = ['4', '5', '10', '11'];

  for (const config of dateConfigs) {
    if (!config.date) continue;

    const { date, suffix = '' } = config;
    const result = transformDateToQuery(date);

    if (!result) continue;

    if (result.optionDate === '13' && (!result.fromDate || !result.toDate)) {
      return null;
    }

    if (
      options.includes(result.optionDate || '0') &&
      (!result.valueDate || result.valueDate === '0')
    ) {
      return null;
    }

    const dateQuery = buildDateQueryString(result, suffix);
    if (dateQuery) {
      queryStrings.push(dateQuery);
    }
  }

  return queryStrings;
};
