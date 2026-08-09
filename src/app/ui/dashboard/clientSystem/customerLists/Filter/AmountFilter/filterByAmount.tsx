import { ClientType, SpecificClients } from '@/app/libs/definitions';

export interface AmountFilterCriteria {
  condition: '>' | '<' | '=' | '>=' | '<=' | '!=';
  value: string;
}

export function applyAmountFilter(list: ClientType[] | SpecificClients, amountFilter?: AmountFilterCriteria) {
  if (!list || list.length === 0) return [];

  if (!amountFilter || amountFilter.value === undefined || amountFilter.value === null || amountFilter.value === '') {
    return list;
  }

  const filterValueNumber = Number(amountFilter.value);

  if (isNaN(filterValueNumber)) {
    return list;
  }
  let filteredList = [...list];
  filteredList = filteredList.filter(client => {
    const clientAmount = client.deposit_client ? client.deposit_client[client.deposit_client.length - 1].amount : null;

    if (clientAmount === undefined || clientAmount === null || clientAmount === '') {
      return false;
    }

    const itemAmountNumber = Number(clientAmount);
    if (isNaN(itemAmountNumber)) {
      return false;
    }

    switch (amountFilter.condition) {
      case '>':
        return itemAmountNumber > filterValueNumber;
      case '<':
        return itemAmountNumber < filterValueNumber;
      case '=':
        return itemAmountNumber === filterValueNumber;
      case '>=':
        return itemAmountNumber >= filterValueNumber;
      case '<=':
        return itemAmountNumber <= filterValueNumber;
      case '!=':
        return itemAmountNumber !== filterValueNumber;
      default:
        return true;
    }
  });

  return filteredList;
}
