import { useCallback, useState } from 'react';
import { CloseWindow } from '@/app/libs/definitions';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { ActivityReport } from '@/app/api/reports/storeReport/activitiesReport/types';
import { getData } from './activity.services';
import { reportsFiltersStore, transformDateToQuery } from '@/store/filtersHandling';
import { buildDateQueryString } from '@/app/libs/buildDatePrismaFilter';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { CustomerName } from '@/app/ui/miscellaneous/customerName/CustomerName';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { FilterGroupV2 } from '@/app/ui/miscellaneous/filterGroup/FilterGroupV2';
import { FilterableField } from '@/store/customerList/types';
import { ExtraTitleButtonsReports } from '@/app/ui/miscellaneous/extraTitleButtonsReports/ExtraTitleButtonsReports';
import { dateFormatsStore } from '@/store/dateFormats';

export function ActivitiesReport({ closeWindow }: CloseWindow) {
  // ----- global states -----

  const { dateFormatted } = dateFormatsStore();

  const createDate = reportsFiltersStore((store) => store.createDate);
  const { clearFilters, applyFilter } = reportsFiltersStore();

  const getPromiseData = useCallback(() => {
    const resultForQuery = transformDateToQuery(createDate);

    const dateQueryString = resultForQuery ? buildDateQueryString(resultForQuery) : null;

    if (
      resultForQuery?.optionDate === '13' &&
      (!resultForQuery.fromDate || !resultForQuery.toDate)
    ) {
      return [];
    }

    const options = ['4', '5', '10', '11'];
    if (
      options.includes(resultForQuery?.optionDate || '0') &&
      (!resultForQuery?.valueDate || resultForQuery?.valueDate === '0')
    ) {
      return [];
    }

    return [fetchData(dateQueryString)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createDate]);

  const { loading } = useLoadingGetData(getPromiseData);

  // ----- local states -----

  const fetchData = async (dateQueryString?: string | null) => {
    const reportData = await getData(dateQueryString);

    setData(reportData);
  };

  const [data, setData] = useState<ActivityReport[]>([]);

  const handleCloseWindow = () => {
    clearFilters();

    closeWindow(false);
  };

  const columnRenderers: { [key: string]: (el: ActivityReport) => any } = {
    customer_name: (el) => <CustomerName customer={el.customerName} customerId={el.customerId} />,
    activity_status: (el) => el.activityStatus,
    activity_type: (el) => el.activityType,
    ['disposition/description']: (el) => el.dispositionDescription,
    subject: (el) => el.subject,
    assigned_rep_on_activity: (el) => el.assignedRepOnActivity,
    assigned_sales_rep_on_customer: (el) => el.assignedSalesRepOnCustomer,
    last_updated_date: (el) => dateFormatted(5, el.lastUpdatedDate),
    last_updated_by: (el) => el.lastUpdatedBy,
  };

  const initialColumnsDef = {
    customer_name: true,
    activity_status: true,
    activity_type: true,
    ['disposition/description']: true,
    subject: true,
    assigned_rep_on_activity: true,
    assigned_sales_rep_on_customer: true,
    last_updated_date: true,
    last_updated_by: true,
  };

  const { columns } = useDynamicTableColumns<ActivityReport, typeof initialColumnsDef>({
    columnRenderers,
    initialColumnsDef,
    accessorFnMapper: {
      customer_name: (el) => el.customerName,
      activity_status: (el) => el.activityStatus,
      activity_type: (el) => el.activityType,
      ['disposition/description']: (el) => el.dispositionDescription,
      subject: (el) => el.subject,
      assigned_rep_on_activity: (el) => el.assignedRepOnActivity,
      assigned_sales_rep_on_customer: (el) => el.assignedSalesRepOnCustomer,
      last_updated_date: (el) => el.lastUpdatedDate,
      last_updated_by: (el) => el.lastUpdatedBy,
    },
  });

  const [showFilter, setShowFilter] = useState(true);

  const filterableFields: FilterableField[] = [
    { id: 'customerName', label: 'Customer', type: 'text' },
    { id: 'assignedRepOnActivity', label: 'Sales Rep On Activity', type: 'text' },
    { id: 'assignedSalesRepOnCustomer', label: 'Sales Rep On Customer', type: 'text' },
  ];

  const filteredData = applyFilter(data, {
    customerFullName: 'customerName',
    customerStatus: 'customerStatusId',
    leadActivityType: 'activityTypeId',
    leadActivityStatus: 'activityStatusId',
    salesRep: 'salesRepOnActivityId',
    secondSalesRep: 'salesRepOnCustomerId',
  });

  const [reloading, setReloading] = useState(false);

  const reloadHandling = async () => {
    setReloading(true);

    const resultForQuery = transformDateToQuery(createDate);

    const dateQueryString = resultForQuery ? buildDateQueryString(resultForQuery) : null;

    if (
      resultForQuery?.optionDate === '13' &&
      (!resultForQuery.fromDate || !resultForQuery.toDate)
    ) {
      return;
    }

    const options = ['4', '5', '10', '11'];
    if (
      options.includes(resultForQuery?.optionDate || '0') &&
      (!resultForQuery?.valueDate || resultForQuery?.valueDate === '0')
    ) {
      return;
    }

    await fetchData(dateQueryString);

    setReloading(false);
  };

  return (
    <ModalWindow top={0}>
      <ModalContainer width={97.395833} marginTop={1.759259}>
        <ModalContainerTitle
          title="Activities Report"
          closeWindowFunction={handleCloseWindow}
          extraTitleComponent={
            <ExtraTitleButtonsReports
              isFilterVisible={showFilter}
              filterableFields={filterableFields}
              filterToggle={() => setShowFilter(!showFilter)}
              reloadData={reloadHandling}
            />
          }
        />
        <ModalContent>
          {showFilter && (
            <ButtonContainer
              marginTop={0}
              marginBottom={1.5}
              widthFull
              justify="space-between"
              alignContentCenter
            >
              <FilterGroupV2
                availableFilters={{
                  customerName: true,
                  createDate: true,
                  customerStatus: true,
                  leadActivityType: true,
                  leadActivityStatus: true,
                  salesRep: true,
                  secondSalesRep: true,
                }}
                advancedFilterFields={filterableFields}
                customLabels={{
                  salesRep: 'Assigned Rep On Activity',
                  secondSalesRep: 'Assigned Rep On Customer',
                }}
              />
            </ButtonContainer>
          )}
          <ColoredTableV2
            data={filteredData}
            columns={columns}
            loading={loading || reloading}
            paginationIsActive
            itemsPerPage={8}
            printButtonIsActive
            textColor="#FFF"
          />
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
