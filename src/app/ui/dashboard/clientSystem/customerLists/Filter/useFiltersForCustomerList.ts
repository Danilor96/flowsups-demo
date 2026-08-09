import { Clients, SpecificClients } from '@/app/libs/definitions';
import { customerListStore } from '@/store/customerList/customerList.store';
import { timeSpansStore } from '@/store/dateFormats';
import { applyAmountFilter } from './AmountFilter/filterByAmount';
import { FilterByOption } from './DateFilters/FilterByOption';

export const useFiltersForCustomerList = () => {
  // ----- global states -----
  const { todaySpan, tomorrowSpan, previousSpans, upcomingSpans, quarters, days, months } =
    timeSpansStore();
  const filters = customerListStore((state) => state.filters);
  const updateFilter = customerListStore((state) => state.updateFilters);
  const clearFilters = customerListStore((state) => state.clearFilters);

  // ----- local states -----

  const filterCustomer = (data: SpecificClients | Clients) => {
    if (!data) return [];

    let filteredData = [...data];

    if (filters.customerName && data) {
      const customerNamesFilter = filters.customerName.toLowerCase().split(' ');
      filteredData = data.filter((customer) => {
        const clientName = `${customer.first_name} ${customer.last_name}`.toLowerCase();
        const phoneNumber = customer.mobile_phone?.replace(/-/g, '').toLowerCase();
        return customerNamesFilter.every(
          (word) => clientName.includes(word) || phoneNumber?.includes(word.replace(/-/g, '')),
        );
      });
    }

    if (filters.interestedVehicle && data) {
      const vehicleNamesFilter = filters.interestedVehicle.toLowerCase().split(' ');
      filteredData = data.filter((customer) => {
        const interestedVehicle = customer.interested_vehicle;
        const interestedVehicleFullName = interestedVehicle
          ? `${interestedVehicle.vehicle_brands?.brand || ''} ${
              interestedVehicle.vehicle_manufacture_years?.year || ''
            } ${interestedVehicle.vehicle_models?.model || ''} ${
              interestedVehicle.vehicle_identification_numbers?.vin || ''
            }`.toLowerCase()
          : '';

        return vehicleNamesFilter.every((word) => interestedVehicleFullName.includes(word));
      });
    }

    if (filters.leadSource && data) {
      filteredData = filteredData.filter(
        (customer) => customer.lead_source?.id == filters.leadSource,
      );
    }
    if (filters.leadSources && filters.leadSources.length > 0 && data) {
      filteredData = filteredData.filter((customer) =>
        filters.leadSources?.includes(customer.lead_source?.id || 0),
      );
    }

    if (filters.leadType && data) {
      filteredData = filteredData.filter((customer) => customer.lead_type?.id == filters.leadType);
    }
    if (filters.leadTypes && filters.leadTypes.length > 0 && data) {
      filteredData = filteredData.filter((customer) =>
        filters.leadTypes?.includes(customer.lead_type?.id || 0),
      );
    }

    if (filters.status && data) {
      filteredData = filteredData.filter(
        (customer) => customer.client_status?.id == filters.status,
      );
    }
    if (filters.statusIds && filters.statusIds.length > 0 && data) {
      filteredData = filteredData.filter((customer) =>
        filters.statusIds?.includes(customer.client_status?.id || 0),
      );
    }

    if (filters.leadTemperature && data) {
      filteredData = filteredData.filter(
        (customer) => customer.client_lead_temperature?.id == filters.leadTemperature,
      );
    }

    if (filters.interestedVehicleId && data) {
      filteredData = filteredData.filter(
        (customer) => customer.interested_vehicle?.id == filters.interestedVehicleId,
      );
    }

    if (filters.assignedToSellerId && data) {
      filteredData = filteredData.filter(
        (customer) => customer.seller?.id === Number(filters.assignedToSellerId),
      );
    }
    if (filters.assignedToSellerIds && filters.assignedToSellerIds.length > 0 && data) {
      filteredData = filteredData.filter((customer) =>
        filters.assignedToSellerIds?.includes(customer.seller?.id || 0),
      );
    }

    if (filters.assignedToBdcId && data) {
      filteredData = filteredData.filter(
        (customer) => customer.bdc?.id === Number(filters.assignedToBdcId),
      );
    }
    if (filters.assignedToBdcIds && filters.assignedToBdcIds.length > 0 && data) {
      filteredData = filteredData.filter((customer) =>
        filters.assignedToBdcIds?.includes(customer.bdc?.id || 0),
      );
    }

    if (filters.assignedToManagerId && data) {
      filteredData = filteredData.filter(
        (customer) => customer.sales_manager?.id === Number(filters.assignedToManagerId),
      );
    }
    if (filters.assignedToManagerIds && filters.assignedToManagerIds.length > 0 && data) {
      filteredData = filteredData.filter((customer) =>
        filters.assignedToManagerIds?.includes(customer.sales_manager?.id || 0),
      );
    }

    if (filters.assignedToFinanceManagerId && data) {
      filteredData = filteredData.filter(
        (customer) => customer.finance_manager?.id === Number(filters.assignedToFinanceManagerId),
      );
    }
    if (
      filters.assignedToFinanceManagerIds &&
      filters.assignedToFinanceManagerIds.length > 0 &&
      data
    ) {
      filteredData = filteredData.filter((customer) =>
        filters.assignedToFinanceManagerIds?.includes(customer.finance_manager?.id || 0),
      );
    }

    if (filters.contactTimeId && data && filters.contactTimeId !== 0) {
      filteredData = filteredData.filter(
        (customer) => customer.contact_time?.id === filters.contactTimeId,
      );
    }

    const helpersDate = {
      todaySpan,
      tomorrowSpan,
      previousSpans,
      upcomingSpans,
      quarters,
      days,
      months,
    };
    // // filterInputs.createdDate = 1 ----> all clients
    // if (filters.dateFilter.createdDate && filters.dateFilter.createdDate !== '1') {
    //   const opt = filters.dateFilter.createdDate;

    //   filteredData = FilterByOption(
    //     filteredData as any,
    //     'created_at',
    //     opt,
    //     { dateFilter: filters.dateFilter },
    //     helpersDate,
    //   );
    // }

    // if (filters.deliveryTime.createdDate && filters.deliveryTime.createdDate !== '1') {
    //   const opt = filters.deliveryTime.createdDate;
    //   filteredData = FilterByOption(
    //     filteredData as any,
    //     'vehicle_delivery',
    //     opt,
    //     { dateFilter: filters.deliveryTime },
    //     helpersDate,
    //   );
    // }

    // if (filters.daysIn.createdDate && filters.daysIn.createdDate !== '1') {
    //   const opt = filters.daysIn.createdDate;
    //   filteredData = FilterByOption(
    //     filteredData as any,
    //     'client_status_changed_at',
    //     opt,
    //     {
    //       dateFilter: filters.daysIn,
    //     },
    //     helpersDate,
    //   );
    // }

    // if (filters.lostDate?.createdDate && filters.lostDate?.createdDate !== '1') {
    //   const opt = filters.lostDate?.createdDate;
    //   filteredData = FilterByOption(
    //     filteredData as any,
    //     'lost_date',
    //     opt,
    //     {
    //       dateFilter: filters.lostDate,
    //     },
    //     helpersDate,
    //   );
    // }

    // if (filters.soldDate?.createdDate && filters.soldDate?.createdDate !== '1') {
    //   const opt = filters.soldDate?.createdDate;
    //   filteredData = FilterByOption(
    //     filteredData as any,
    //     'sold_date',
    //     opt,
    //     {
    //       dateFilter: filters.soldDate,
    //     },
    //     helpersDate,
    //   );
    // }

    // if (filters.lastActivity.createdDate && filters.lastActivity.createdDate !== '1') {
    //   const opt = filters.lastActivity.createdDate;
    //   filteredData = FilterByOption(
    //     filteredData as any,
    //     'last_activity',
    //     opt,
    //     {
    //       dateFilter: filters.lastActivity,
    //     },
    //     helpersDate,
    //   );
    // }

    // if (filters.visitDate.createdDate && filters.visitDate.createdDate !== '1') {
    //   const opt = filters.visitDate.createdDate;
    //   filteredData = FilterByOption(
    //     filteredData as any,
    //     'visit_date',
    //     opt,
    //     {
    //       dateFilter: filters.visitDate,
    //     },
    //     helpersDate,
    //   );
    // }

    // if (filters.depositDate.createdDate && filters.depositDate.createdDate !== '1') {
    //   const opt = filters.depositDate.createdDate;
    //   filteredData = FilterByOption(
    //     filteredData as any,
    //     'deposit_client',
    //     opt,
    //     {
    //       dateFilter: filters.depositDate,
    //     },
    //     helpersDate,
    //   );
    // }

    if (filters.depositAmount) {
      filteredData = applyAmountFilter(filteredData as any, filters.depositAmount);
    }

    if (filters.dealBank && data) {
      const dealBankFilters = filters.dealBank.toLowerCase().split(' ');
      filteredData = data.filter((customer) => {
        if (!customer.deal || customer.deal.length === 0) return false;

        const lastDeal = customer.deal[customer.deal.length - 1];
        const dealBankName = lastDeal.bank?.bank.toLowerCase();
        return dealBankFilters.every((word) => dealBankName?.includes(word));
      });
    }

    return filteredData;
  };

  // const updateFilter = (filters: Partial<filter>) => {
  //   setFilters(prevFilters => ({
  //     ...prevFilters,
  //     ...filters
  //   }));
  // };

  // const clearFilters = () => {
  //   setFilters(initialState);
  // };

  return {
    filterCustomer,
    updateFilter,
    filters,
    clearFilters,
  };
};
