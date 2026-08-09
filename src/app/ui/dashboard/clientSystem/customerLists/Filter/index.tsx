import { ButtonContainer } from '@/app/ui/buttons/ButtonContainer';
import { Input } from '@/app/ui/inputs/Input';
import { adminDashboardStore } from '@/store/adminDashboard';
import { useCallback, useEffect, useState } from 'react';
import { AddingSelect } from '../../AddingSelect';
import DateFilters from './DateFilters/DateFilters';
import { Button } from '@/app/ui/buttons/Button';
import DateFiltersV2, { availablePropOptions } from './DateFilters/DateFilterV2';
import AmountFilter from './AmountFilter/AmountFilter';
import { filter, FilterableField } from '@/store/customerList/types';
import { reportsFiltersStore, transformDateToQuery } from '@/store/filtersHandling';
import { FilterGroupV2 } from '@/app/ui/miscellaneous/filterGroup/FilterGroupV2';
import { buildDateQueryString } from '@/app/libs/buildDatePrismaFilter';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { processDateFilters } from '@/app/libs/datesFilters/functions.datesFilters';
import { handlingCapitalWords } from '@/app/libs/functions/inputs/inputsFunction';
import { customerListStore } from '@/store/customerList/customerList.store';

interface props {
  filters: filter;
  updateFilter: (filters: Partial<filter>) => void;
  clearFilters: () => void;
  visibleFiltersOptions?: {
    customerName?: boolean;
    assignedToSellerId?: boolean;
    contactTimeId?: boolean;
    dateFilters?: boolean;
    leadSource?: boolean;
    leadType?: boolean;
    status?: boolean;
    leadTemperature?: boolean;
    asignedToManagerId?: boolean;
    asignedToBdcId?: boolean;
    interestedVehicle?: boolean;
    deliveryTime?: boolean;
    daysIn?: boolean;
    lastActivity?: boolean;
    visitDate?: boolean;
    depositDate?: boolean;
    depositAmount?: boolean;
    asignedToFinanceManagerId?: boolean;
    dealBank?: boolean;
    lostDate?: boolean;
    soldDate?: boolean;
    lostReason?: boolean;
  };
  setLoading?: (val: React.SetStateAction<boolean>) => void;
  setDoFetch?: (val: React.SetStateAction<boolean>) => void;
  filtersToApply?: AppliedFilter[];
  specificCustomerStatusId?: string | number;
  specificCustomerStatusTwoId?: string | number;
  specificCustomerStatusThreeId?: string | number;
  doDataFetch?: boolean;
  disabledOptions?: availablePropOptions[];
  disabledDatesOptions?: {
    lastActivity?: availablePropOptions[];
    visitDate?: availablePropOptions[];
    depositDate?: availablePropOptions[];
    lostDate?: availablePropOptions[];
    soldDate?: availablePropOptions[];
    deliveryTime?: availablePropOptions[];
    daysIn?: availablePropOptions[];
  };
}

const defaultInputStyle = {
  width: 10,
  backgroundColor: '#FFF',
  border: 0.13,
  borderColor: '#00A78B',
  borderRadius: 1.302083,
  textAlterColor: '#00A78B',
  placeHolderColor: '#9ca3af',
  labelSameColor: true,
  height: 5.55,
};

const visibleFiltersOptionsDefault = {
  customerName: true,
  assignedToSellerId: true,
  contactTimeId: true,
  dateFilters: true,
  leadSource: false,
  leadType: false,
  status: false,
  asignedToManagerId: false,
  asignedToBdcId: false,
  leadTemperature: false,
  interestedVehicle: false,
  deliveryTime: false,
  daysIn: false,
  lastActivity: false,
  visitDate: false,
  depositDate: false,
  depositAmount: false,
  asignedToFinanceManagerId: false,
  dealBank: false,
  lostDate: false,
  soldDate: false,
  lostReason: false,
};

const CustomerListFilter = ({
  updateFilter,
  filters,
  clearFilters,
  visibleFiltersOptions,
  setLoading,
  filtersToApply,
  specificCustomerStatusId,
  specificCustomerStatusTwoId,
  specificCustomerStatusThreeId,
  doDataFetch,
  setDoFetch,
  disabledOptions,
  disabledDatesOptions,
}: props) => {
  // ----- global states -----
  const {
    users,
    getUsers,
    contactTimeData,
    getContactTime,
    leadTemperatures,
    getLeadTemperatures,
  } = adminDashboardStore();

  const updateCreateDateFilter = reportsFiltersStore((state) => state.updateFilter);
  const clearDateFilter = reportsFiltersStore((state) => state.clearFilters);

  const getSpecificClients = adminDashboardStore((state) => state.getSpecificClients);
  const getSpecificClientsTwo = adminDashboardStore((state) => state.getSpecificClientsTwo);
  const getSpecificClientsThree = adminDashboardStore((state) => state.getSpecificClientsThree);

  const doFetchGlobal = customerListStore((state) => state.doFetch);
  const clearFiltersGlobal = customerListStore((state) => state.clearFilters);
  const fetchingData = customerListStore((state) => state.fetchingData);

  const getPromiseData = useCallback(() => {
    if (!specificCustomerStatusId && !specificCustomerStatusTwoId && !specificCustomerStatusThreeId) {
      return [];
    }

    const processedQueries = processDateFilters([
      { date: filters.dateFilter, suffix: 'Default' },
      { date: filters.lastActivity, suffix: 'Activity' },
      { date: filters.visitDate, suffix: 'Visit' },
      { date: filters.depositDate, suffix: 'Deposit' },
      { date: filters.lostDate, suffix: 'Lost' },
      { date: filters.soldDate, suffix: 'Sold' },
      { date: filters.deliveryTime, suffix: 'Delivery' },
      { date: filters.daysIn, suffix: 'DaysIn' },
    ]);

    let urlResult = processedQueries?.join('&');

    if (filters.lostReasonIds && filters.lostReasonIds.length > 0) {
      const lostReasonsParam = `lostReasonId=${filters.lostReasonIds.join(',')}`;
      urlResult = urlResult ? `${urlResult}&${lostReasonsParam}` : lostReasonsParam;
    }

    if (specificCustomerStatusTwoId) {
      setLoading && setLoading(true);

      return [
        getSpecificClientsTwo(`${specificCustomerStatusTwoId}${urlResult ? `?${urlResult}` : ''}`).finally(
          () => setLoading && setLoading(false),
        ),
      ];
    }

    if (specificCustomerStatusThreeId) {
      setLoading && setLoading(true);

      return [
        getSpecificClientsThree(`${specificCustomerStatusThreeId}${urlResult ? `?${urlResult}` : ''}`).finally(
          () => setLoading && setLoading(false),
        ),
      ];
    }

    setLoading && setLoading(true);

    return [
      getSpecificClients(`${specificCustomerStatusId}${urlResult ? `?${urlResult}` : ''}`).finally(
        () => setLoading && setLoading(false),
      ),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchingData, doDataFetch]);

  const { loading } = useLoadingGetData(getPromiseData);

  const [getLeadSources, getLeadTypes, getClientStatuses, getLostReasons] = adminDashboardStore((state) => [
    state.getLeadSources,
    state.getLeadTypes,
    state.getClientStatuses,
    state.getLostReasons,
  ]);
  const [leadSourcesData, leadTypesData, clientStatusesData, lostReasons] = adminDashboardStore((state) => [
    state.leadSourcesData,
    state.leadTypesData,
    state.clientStatusesData,
    state.lostReasons,
  ]);

  useEffect(() => {
    const hasData =
      leadSourcesData.length > 0 &&
      leadTypesData.length > 0 &&
      clientStatusesData &&
      clientStatusesData.length > 0;
    if (!hasData) {
      getLeadSources();
      getLeadTypes();
      getClientStatuses();
    }
    if (!lostReasons) {
      getLostReasons();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getLeadSources, getLeadTypes, getClientStatuses, getLostReasons]);

  const [vehicleOptions, setVehicleOptions] = useState<{ value: number; option: string }[]>([]);

  useEffect(() => {
    if (!users || users.length === 0) {
      getUsers();
      getContactTime();
    }
    if (
      !contactTimeData ||
      contactTimeData.length === 0 ||
      !leadTemperatures ||
      leadTemperatures.length === 0
    ) {
      getContactTime();
      getLeadTemperatures();
    }
  }, [users, getUsers, getContactTime, contactTimeData, leadTemperatures, getLeadTemperatures]);

  // ----- local states -----
  const [asingUserValue, setAsingUserValue] = useState<string>('');
  const [asingUserBdcValue, setAsingUserBdcValue] = useState<string>('');
  const [asingUserManagerValue, setAsingUserManagerValue] = useState<string>('');
  const [asingFinanceManagerValue, setAsingUserFinanceManagerValue] = useState<string>('');
  const [statusSearchInput, setStatusSearchInput] = useState<string>('');
  const [leadSourceSearchInput, setLeadSourceSearchInput] = useState<string>('');
  const [leadTypeSearchInput, setLeadTypeSearchInput] = useState<string>('');
  const [lostReasonSearchInput, setLostReasonSearchInput] = useState<string>('');

  // ----- computed values -----
  const contactTimeOptions = [{ value: 0, option: 'All' }]
    .concat(contactTimeData?.map?.((el) => ({ value: el.id, option: el.time })) || [])
    .sort((a, b) => a.option.localeCompare(b.option));

  const leadSourceOptions =
    leadSourcesData
      ?.map?.((el) => {
        return { value: el.id, option: el.source };
      })
      .sort((a, b) => a.option.localeCompare(b.option)) || [];

  const leadTypeOptions =
    leadTypesData
      ?.map?.((el) => {
        return { value: el.id, option: el.type };
      })
      .sort((a, b) => a.option.localeCompare(b.option)) || [];

  const customerStatusOptions =
    clientStatusesData
      ?.map?.((el) => {
        return { value: el.id, option: el.status[0]?.toUpperCase() + el.status?.slice(1) || '' };
      })
      .sort((a, b) => a.option.localeCompare(b.option)) || [];

  const leadTemperaturesOptions = [{ value: 0, option: 'All' }].concat(
    (
      leadTemperatures?.map?.((el) => {
        return { value: el.id, option: el.temperature };
      }) as { value: number; option: string }[]
    ).sort((a, b) => a.option.localeCompare(b.option)) || [],
  );

  const lostReasonOptions =
    lostReasons?.map?.((el) => {
      return { value: el.id, option: el.reason };
    })
    .sort((a, b) => a.option.localeCompare(b.option)) || [];

  const userOptions =
    users && users.length > 0
      ? users
          .map?.((el) => ({ value: el.id, option: `${el.name} ${el.last_name}` }))
          .sort((a, b) => a.option.localeCompare(b.option))
      : [];

  const visibleFiltersOpts = {
    ...visibleFiltersOptionsDefault,
    ...visibleFiltersOptions,
  };

  return (
    <div className="flex gap-3 w-full items-end flex-wrap">
      <Input
        {...defaultInputStyle}
        width={10}
        name="customerName"
        label="Customer Search"
        placeholder="Search"
        type="text"
        value={handlingCapitalWords(filters.customerName) || ''}
        onChange={(e) => updateFilter({ customerName: e.target.value })}
      />
      <DateFiltersV2
        dateFilters={filters.dateFilter}
        labelText="Create Date"
        updateFilter={(state) => {
          updateFilter({ dateFilter: { ...filters.dateFilter, ...state } });
        }}
        width={9}
        height={5.5}
        // disabledOptions={disabledOptions}
        disabledOptions={['Tomorrow', 'Upcoming']}
      />
      {visibleFiltersOpts.leadSource && (
        <div>
          <AddingSelect
            name="leadSource"
            label="Lead Source"
            value={handlingCapitalWords(leadSourceSearchInput)}
            width={9}
            options={leadSourceOptions}
            selectedValues={filters.leadSources || []}
            onChange={(e) => {
              setLeadSourceSearchInput(e.target.value);
            }}
            onMultiSelect={(selected) => {
              updateFilter({ leadSources: selected as number[] });
              setLeadSourceSearchInput('');
            }}
          />
        </div>
      )}
      {visibleFiltersOpts.leadType && (
        <div>
          <AddingSelect
            name="leadType"
            label="Lead Type"
            value={handlingCapitalWords(leadTypeSearchInput)}
            width={9}
            options={leadTypeOptions}
            selectedValues={filters.leadTypes || []}
            onChange={(e) => {
              setLeadTypeSearchInput(e.target.value);
            }}
            onMultiSelect={(selected) => {
              updateFilter({ leadTypes: selected as number[] });
              setLeadTypeSearchInput('');
            }}
          />
        </div>
      )}
      {visibleFiltersOpts.status && (
        <div>
          <AddingSelect
            name="customerStatus"
            label="Customer Status"
            value={handlingCapitalWords(statusSearchInput)}
            width={9}
            options={customerStatusOptions}
            selectedValues={filters.statusIds || []}
            onChange={(e) => {
              setStatusSearchInput(e.target.value);
            }}
            onMultiSelect={(selected) => {
              updateFilter({ statusIds: selected as number[] });
              setStatusSearchInput('');
            }}
          />
        </div>
      )}
      {visibleFiltersOpts.lostReason && (
        <div>
          <AddingSelect
            name="lostReason"
            label="Lost Reason"
            value={handlingCapitalWords(lostReasonSearchInput)}
            width={12}
            options={lostReasonOptions}
            selectedValues={filters.lostReasonIds || []}
            onChange={(e) => {
              setLostReasonSearchInput(e.target.value);
            }}
            onMultiSelect={(selected) => {
              updateFilter({ lostReasonIds: selected as number[] });
              setLostReasonSearchInput('');
            }}
          />
        </div>
      )}
      {visibleFiltersOpts.assignedToSellerId && (
        <div>
          <AddingSelect
            name="addingUser"
            label="Sales Rep Assigned"
            value={handlingCapitalWords(asingUserValue)}
            width={11}
            options={userOptions}
            selectedValues={filters.assignedToSellerIds || []}
            onChange={(e) => {
              setAsingUserValue(e.target.value);
            }}
            onMultiSelect={(selected) => {
              updateFilter({ assignedToSellerIds: selected as number[] });
              setAsingUserValue('');
            }}
          />
        </div>
      )}
      <div className={`${visibleFiltersOpts.asignedToBdcId ? '' : 'hidden'}`}>
        <AddingSelect
          name="addingUserBdc"
          label="BDC Rep Assigned"
          value={handlingCapitalWords(asingUserBdcValue)}
          width={11}
          options={userOptions}
          selectedValues={filters.assignedToBdcIds || []}
          onChange={(e) => {
            setAsingUserBdcValue(e.target.value);
          }}
          onMultiSelect={(selected) => {
            updateFilter({ assignedToBdcIds: selected as number[] });
            setAsingUserBdcValue('');
          }}
        />
      </div>
      <div className={`${visibleFiltersOpts.asignedToManagerId ? '' : 'hidden'}`}>
        <AddingSelect
          name="addingUserManager"
          label="Manager Assigned"
          value={handlingCapitalWords(asingUserManagerValue)}
          width={11}
          options={userOptions}
          selectedValues={filters.assignedToManagerIds || []}
          onChange={(e) => {
            setAsingUserManagerValue(e.target.value);
          }}
          onMultiSelect={(selected) => {
            updateFilter({ assignedToManagerIds: selected as number[] });
            setAsingUserManagerValue('');
          }}
        />
      </div>
      <div className={`${visibleFiltersOpts.asignedToFinanceManagerId ? '' : 'hidden'}`}>
        <AddingSelect
          name="addingUserFinanceManager"
          label="Finance Manager"
          value={handlingCapitalWords(asingFinanceManagerValue)}
          width={11}
          options={userOptions}
          selectedValues={filters.assignedToFinanceManagerIds || []}
          onChange={(e) => {
            setAsingUserFinanceManagerValue(e.target.value);
          }}
          onMultiSelect={(selected) => {
            updateFilter({ assignedToFinanceManagerIds: selected as number[] });
            setAsingUserFinanceManagerValue('');
          }}
        />
      </div>
      {visibleFiltersOptions?.contactTimeId && (
        <div>
          <Input
            {...defaultInputStyle}
            height={5.6}
            width={8}
            name="contactTime"
            label="Contact Time"
            placeholder="Contact Time"
            type="select"
            options={contactTimeOptions}
            value={filters.contactTimeId?.toString()}
            onChange={(e) => updateFilter({ contactTimeId: Number(e.target.value) })}
          />
        </div>
      )}
      {visibleFiltersOpts.leadTemperature && (
        <div>
          <Input
            {...defaultInputStyle}
            width={6.4}
            height={5.6}
            name="leadTemperature"
            label="Lead Temperature"
            type="select"
            value={filters.leadTemperature?.toString() || ''}
            options={leadTemperaturesOptions}
            onChange={(e) => updateFilter({ leadTemperature: Number(e.target.value) })}
          />
        </div>
      )}
      {visibleFiltersOpts.visitDate && (
        <DateFiltersV2
          labelText="Visit Date"
          dateFilters={filters.visitDate}
          updateFilter={(dateFilter) =>
            updateFilter({ visitDate: { ...filters.visitDate, ...dateFilter } })
          }
          // disabledOptions={disabledDatesOptions?.visitDate}
          disabledOptions={['Tomorrow', 'Upcoming']}
        />
      )}
      {visibleFiltersOpts.deliveryTime && (
        <DateFiltersV2
          labelText="Delivery Time"
          dateFilters={filters.deliveryTime}
          updateFilter={(dateFilter) =>
            updateFilter({ deliveryTime: { ...filters.deliveryTime, ...dateFilter } })
          }
          // disabledOptions={disabledDatesOptions?.deliveryTime}
          disabledOptions={['Tomorrow', 'Upcoming']}
        />
      )}
      {visibleFiltersOpts.depositDate && (
        <DateFiltersV2
          labelText="Deposit Date"
          dateFilters={filters.depositDate}
          updateFilter={(dateFilter) =>
            updateFilter({ depositDate: { ...filters.depositDate, ...dateFilter } })
          }
          // disabledOptions={disabledDatesOptions?.depositDate}
          disabledOptions={['Tomorrow', 'Upcoming']}
        />
      )}
      {visibleFiltersOpts.lastActivity && (
        <DateFiltersV2
          labelText="Last contacted day "
          dateFilters={filters.lastActivity}
          updateFilter={(dateFilter) =>
            updateFilter({ lastActivity: { ...filters.lastActivity, ...dateFilter } })
          }
          // disabledOptions={disabledDatesOptions?.lastActivity}
          disabledOptions={['Tomorrow', 'Upcoming']}
        />
      )}
      {visibleFiltersOpts.lostDate && (
        <DateFiltersV2
          labelText="Lost Date"
          dateFilters={filters.lostDate}
          updateFilter={(dateFilter) =>
            updateFilter({ lostDate: { ...filters.lostDate, ...dateFilter } })
          }
          // disabledOptions={disabledDatesOptions?.daysIn}
          disabledOptions={['Tomorrow', 'Upcoming']}
        />
      )}
      {visibleFiltersOpts.daysIn && (
        <DateFiltersV2
          labelText="Days In"
          dateFilters={filters.daysIn}
          updateFilter={(dateFilter) =>
            updateFilter({ daysIn: { ...filters.daysIn, ...dateFilter } })
          }
          // disabledOptions={disabledDatesOptions?.daysIn}
          disabledOptions={['Tomorrow', 'Upcoming']}
        />
      )}
      {visibleFiltersOpts.interestedVehicle && (
        <div>
          <Input
            {...defaultInputStyle}
            width={10}
            name="vehicle"
            label="Interested Vehicle"
            type="text"
            placeholder="Search"
            value={handlingCapitalWords(filters.interestedVehicle) || ''}
            options={vehicleOptions}
            onChange={(e) => updateFilter({ interestedVehicle: e.target.value })}
          />
        </div>
      )}
      {visibleFiltersOpts.depositAmount && (
        <AmountFilter
          label="Deposit Amount"
          filter={filters.depositAmount || undefined}
          onChange={(filterAmount) => updateFilter({ depositAmount: filterAmount })}
        />
      )}
      {visibleFiltersOpts.soldDate && (
        <DateFiltersV2
          labelText="Sold Date"
          dateFilters={filters.soldDate}
          updateFilter={(dateFilter) =>
            updateFilter({ soldDate: { ...filters.soldDate, ...dateFilter } })
          }
          // disabledOptions={disabledDatesOptions?.soldDate}
          disabledOptions={['Tomorrow', 'Upcoming']}
        />
      )}
      {visibleFiltersOpts.dealBank && (
        <Input
          {...defaultInputStyle}
          width={10}
          name="dealBank"
          label="Bank Search"
          placeholder="Search"
          type="text"
          value={handlingCapitalWords(filters.dealBank) || ''}
          onChange={(e) => updateFilter({ dealBank: e.target.value })}
        />
      )}
      <div className="flex items-center h-full self-end">
        <Button
          backgroundColor="#00A78B"
          identity="clear"
          textColor="#fff"
          buttonText="Reset"
          border={0.104166}
          borderColor="#00A78B"
          borderRadius={1.302083}
          fontWeight={400}
          buttonTextSize={2}
          width={5}
          onClick={() => {
            clearFilters();
            clearDateFilter();
            clearFiltersGlobal();
            setAsingUserValue('');
            setAsingUserBdcValue('');
            setAsingUserManagerValue('');
            setAsingUserFinanceManagerValue('');
            setStatusSearchInput('');
            setLeadSourceSearchInput('');
            setLeadTypeSearchInput('');
            setLostReasonSearchInput('');
            doFetchGlobal();
            setDoFetch && setDoFetch((prev) => !prev);
          }}
        />
      </div>
      <div className="flex items-center h-full self-end">
        <Button
          backgroundColor="#00A78B"
          identity="run"
          textColor="#fff"
          buttonText="Run"
          border={0.104166}
          borderColor="#00A78B"
          borderRadius={1.302083}
          fontWeight={400}
          buttonTextSize={2}
          width={5}
          onClick={doFetchGlobal}
        />
      </div>
    </div>
  );
};

export default CustomerListFilter;
