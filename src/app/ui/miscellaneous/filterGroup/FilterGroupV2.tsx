import { reportsFiltersStore } from '@/store/filtersHandling';
import DateFiltersV2 from '../../dashboard/clientSystem/customerLists/Filter/DateFilters/DateFilterV2';
import { useEffect, useState } from 'react';
import { adminDashboardStore } from '@/store/adminDashboard';
import { AddingSelect } from '../../dashboard/clientSystem/AddingSelect';
import { ContentRow } from '../../modalWindowsStructure/ContentRow';
import { Input } from '../../inputs/Input';
import { AdvancedFiltersPanel } from '&/miscellaneous/advanceFilterPanel/AdvanceFilterPanel';
import { FilterableField } from '@/store/customerList/types';
import { SortButtons } from '&/miscellaneous/extraTitleButtonsReports/reportsButtons/addReportModal/advanceFilter/sortButton/SortButton';
import { Button } from '../../buttons/Button';
import { handlingCapitalWords } from '@/app/libs/functions/inputs/inputsFunction';

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

interface FilterConfiguration {
  createDate?: boolean;
  createDateLabel?: string;
  dueDate?: boolean;
  soldDate?: boolean;
  salesRep?: boolean;
  secondSalesRep?: boolean;
  customerName?: boolean;
  taskStatus?: boolean;
  leadSource?: boolean;
  customerStatus?: boolean;
  leadActivityType?: boolean;
  leadActivityStatus?: boolean;
}

interface CustomLabels {
  salesRep?: string;
  secondSalesRep?: string;
}

const taskStatusOptions = [
  { value: 1, option: 'Pending' },
  { value: 2, option: 'Completed' },
  { value: 3, option: 'Canceled' },
  { value: 4, option: 'Late' },
];

export function FilterGroupV2({
  availableFilters,
  advancedFilterFields,
  customLabels,
}: {
  availableFilters: FilterConfiguration;
  advancedFilterFields?: FilterableField[];
  customLabels?: CustomLabels;
}) {
  const { users } = adminDashboardStore();
  const { getUsers } = adminDashboardStore();

  const [
    getLeadSources,
    leadSourcesData,
    clientStatusesData,
    getClientStatuses,
    getClientDetailLead,
    clientDetailLeadData,
  ] = adminDashboardStore((state) => [
    state.getLeadSources,
    state.leadSourcesData,
    state.clientStatusesData,
    state.getClientStatuses,
    state.getClientDetailLead,
    state.clientDetailLeadData,
  ]);

  useEffect(() => {
    getUsers();
    if (availableFilters.leadSource) {
      getLeadSources();
    }

    if (availableFilters.customerStatus) {
      getClientStatuses();
    }

    if (availableFilters.leadActivityType) {
      getClientDetailLead();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const leadSourceOptions = leadSourcesData.map((el) => {
    return { value: el.id, option: el.source };
  });

  const customerStatusOptions =
    clientStatusesData?.map((el) => {
      return { value: el.id, option: el.status };
    }) || [];

  let leadActivityTypeOptions = clientDetailLeadData.map((el) => ({
    value: el.id,
    option: el.lead,
  }));

  const leadActivityStatusOptions = [
    {
      value: 1,
      option: 'Pending',
    },
    {
      value: 2,
      option: 'Completed',
    },
    {
      value: 3,
      option: 'Canceled',
    },
  ];

  const {
    updateFilter,
    createDate,
    clearFilters,
    assignedToSellerIds,
    customerName,
    dueDate,
    soldDate,
    taskStatusIds,
    updateAdvancedFilters,
    sortConfig,
    sortHandler,
    clearSort,
    leadSourcesIds,
    customerStatusIds,
    leadActivityTypeIds,
    leadActivityStatusIds,
    secondAssignedToSellerIds,
  } = reportsFiltersStore();

  const [asingUserValue, setAsingUserValue] = useState('');
  const [asingUserSecondValue, setAsingUserSecondValue] = useState('');
  const [taskStatusValue, setTaskStatusValue] = useState('');
  const [leadSourceSearchInput, setLeadSourceSearchInput] = useState('');
  const [statusSearchInput, setStatusSearchInput] = useState('');
  const [leadActivityTypeInput, setLeadActivityTypeInput] = useState('');
  const [leadActivityStatusInput, setLeadActivityStatusInput] = useState('');

  const userOptions =
    users && users.length > 0
      ? users.map((el) => ({ value: el.id, option: `${el.name} ${el.last_name}` }))
      : [];

  const filterHandler = (filters: AppliedFilter[]) => {
    updateAdvancedFilters(filters);
  };

  return (
    <div className="w-full">
      <ContentRow
        cols={8}
        gap={1.5}
        widthFull
        gridTrack="minmax(0, max-content)"
        marginBottom={0.5}
      >
        {Object?.keys(availableFilters).map((conf, index) => {
          switch (conf) {
            case 'createDate':
              return (
                <DateFiltersV2
                  key={`DateFiltersV2--${index}`}
                  dateFilters={createDate}
                  labelText={
                    availableFilters?.createDateLabel
                      ? availableFilters.createDateLabel
                      : 'Create Date'
                  }
                  updateFilter={(state) => {
                    updateFilter({ createDate: { ...createDate, ...state } });
                  }}
                />
              );

            case 'dueDate':
              return (
                <DateFiltersV2
                  key={`DateFiltersV2DueDate--${index}`}
                  dateFilters={dueDate}
                  labelText="Due Date"
                  updateFilter={(state) => {
                    updateFilter({ dueDate: { ...dueDate, ...state } });
                  }}
                />
              );

            case 'salesRep':
              return (
                <AddingSelect
                  key={`AddingSelect||${index}`}
                  name="addingUser"
                  label={customLabels?.salesRep ? customLabels.salesRep : 'Sales Rep Assigned'}
                  value={handlingCapitalWords(asingUserValue)}
                  width={11}
                  options={userOptions}
                  selectedValues={assignedToSellerIds || []}
                  onChange={(e) => {
                    setAsingUserValue(e.target.value);
                  }}
                  onMultiSelect={(selected) => {
                    updateFilter({ assignedToSellerIds: selected as number[] });
                  }}
                />
              );

            case 'secondSalesRep':
              return (
                <AddingSelect
                  key={`AddingSelect||${index}`}
                  name="addingUser"
                  label={
                    customLabels?.secondSalesRep
                      ? customLabels.secondSalesRep
                      : 'Sales Rep Assigned'
                  }
                  value={handlingCapitalWords(asingUserSecondValue)}
                  width={11}
                  options={userOptions}
                  selectedValues={secondAssignedToSellerIds || []}
                  onChange={(e) => {
                    setAsingUserSecondValue(e.target.value);
                  }}
                  onMultiSelect={(selected) => {
                    updateFilter({ secondAssignedToSellerIds: selected as number[] });
                  }}
                />
              );

            case 'taskStatus':
              return (
                <AddingSelect
                  key={`AddingSelectTaskStatus||${index}`}
                  name="addingTask"
                  label="Status"
                  value={handlingCapitalWords(taskStatusValue)}
                  width={11}
                  options={taskStatusOptions}
                  selectedValues={taskStatusIds || []}
                  onChange={(e) => {
                    setTaskStatusValue(e.target.value);
                  }}
                  onMultiSelect={(selected) => {
                    updateFilter({ taskStatusIds: selected as number[] });
                  }}
                />
              );

            case 'customerName':
              return (
                <Input
                  key={`Input//${index}`}
                  {...defaultInputStyle}
                  width={10}
                  name="customerName"
                  label="Customer Search"
                  placeholder="Search"
                  type="text"
                  value={handlingCapitalWords(customerName) || ''}
                  onChange={(e) => updateFilter({ customerName: e.currentTarget.value })}
                />
              );

            case 'soldDate':
              return (
                <DateFiltersV2
                  key={`DateFiltersV2SoldDate--${index}`}
                  dateFilters={soldDate}
                  labelText="Sold Date"
                  updateFilter={(state) => {
                    updateFilter({ soldDate: { ...soldDate, ...state } });
                  }}
                />
              );

            case 'leadSource':
              return (
                <AddingSelect
                  name="leadSource"
                  label="Lead Source"
                  value={handlingCapitalWords(leadSourceSearchInput)}
                  width={9}
                  options={leadSourceOptions}
                  selectedValues={leadSourcesIds || []}
                  onChange={(e) => {
                    setLeadSourceSearchInput(e.target.value);
                  }}
                  onMultiSelect={(selected) => {
                    updateFilter({ leadSourcesIds: selected as number[] });
                  }}
                />
              );

            case 'customerStatus':
              return (
                <AddingSelect
                  name="customerStatusIds"
                  label="Customer Status"
                  value={handlingCapitalWords(statusSearchInput)}
                  width={9}
                  options={customerStatusOptions}
                  selectedValues={customerStatusIds || []}
                  onChange={(e) => {
                    setStatusSearchInput(e.target.value);
                  }}
                  onMultiSelect={(selected) => {
                    updateFilter({ customerStatusIds: selected as number[] });
                  }}
                />
              );

            case 'leadActivityType':
              return (
                <AddingSelect
                  name="leadActivityTypeIds"
                  label="Activity Type"
                  value={handlingCapitalWords(leadActivityTypeInput)}
                  width={9}
                  options={leadActivityTypeOptions}
                  selectedValues={leadActivityTypeIds || []}
                  onChange={(e) => {
                    setLeadActivityTypeInput(e.target.value);
                  }}
                  onMultiSelect={(selected) => {
                    updateFilter({ leadActivityTypeIds: selected as number[] });
                  }}
                />
              );

            case 'leadActivityStatus':
              return (
                <AddingSelect
                  name="leadActivityStatusIds"
                  label="Activity Status"
                  value={handlingCapitalWords(leadActivityStatusInput)}
                  width={9}
                  options={leadActivityStatusOptions}
                  selectedValues={leadActivityStatusIds || []}
                  onChange={(e) => {
                    setLeadActivityStatusInput(e.target.value);
                  }}
                  onMultiSelect={(selected) => {
                    updateFilter({ leadActivityStatusIds: selected as number[] });
                  }}
                />
              );

            default:
              return null;
          }
        })}
        <Button
          backgroundColor="#00A78B"
          identity="clear"
          textColor="#FFF"
          buttonText="Reset"
          border={0.104166}
          borderColor="#00A78B"
          borderRadius={1.302083}
          fontWeight={400}
          buttonTextSize={2}
          width={5}
          height={6}
          onClick={() => {
            clearFilters && clearFilters();
          }}
        />
      </ContentRow>
      {advancedFilterFields && (
        <div className="flex flex-row justify-end gap-[0.5vw]">
          <AdvancedFiltersPanel
            filterableFields={advancedFilterFields}
            onApplyFilters={filterHandler}
          />
          {sortConfig && (
            <SortButtons
              sortOptions={advancedFilterFields}
              sortConfig={sortConfig}
              sortHandler={sortHandler}
              clearSort={clearSort}
            />
          )}
        </div>
      )}
    </div>
  );
}
