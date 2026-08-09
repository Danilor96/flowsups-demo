import { useCallback, useState } from 'react';
import { CloseWindow } from '@/app/libs/definitions';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { reportsFiltersStore, transformDateToQuery } from '@/store/filtersHandling';
import { CreditAppReportSummary } from '@/app/api/reports/storeReport/creditApp/types';
import { getData } from './creditAppReport.services';
import { buildDateQueryString } from '@/app/libs/buildDatePrismaFilter';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { ExtraTitleButtonsReports } from '@/app/ui/miscellaneous/extraTitleButtonsReports/ExtraTitleButtonsReports';
import { FilterableField } from '@/store/customerList/types';
import { FilterGroupV2 } from '@/app/ui/miscellaneous/filterGroup/FilterGroupV2';
import { CustomerColumn } from './customerColumn/CustomerColumn';
import { VehicleColumn } from './vehicleColumn/VehicleColumn';
import { TradeInColumn } from './tradeInColumn/TradeInColumn';
import { LeadInfoColumn } from './leadInfoColumn/LeadInfoColumn';
import { CreditAppInfoColumn } from './creditInfoColumn/CreditInfoColumn';
import { DateColumn } from './dateColumn/DateColumn';
import { EmploymentColumn } from './employmentColumn/EmploymentColumn';
// import {
//   ColumnDefinition,
//   defaultDetailCellStyle,
//   PdfContainerByDefinitions,
// } from '../visitReport/generateTablePdf';
// import { Text, View } from '@react-pdf/renderer';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { dateFormatsStore } from '@/store/dateFormats';
import { AnimatePresence } from 'framer-motion';
import { CellDefinitionType } from '../visitReport/xlsGenerator';

export function CreditAppReport({ closeWindow }: CloseWindow) {
  // ----- global states -----

  const { formatPhoneNumber } = phoneNumbersFormatStore();
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
  }, [createDate]);

  const { loading } = useLoadingGetData(getPromiseData);

  // ----- local states -----

  const [reloading, setReloading] = useState(false);
  const [showFilter, setShowFilter] = useState(true);

  const [data, setData] = useState<CreditAppReportSummary[]>([]);

  const fetchData = async (dateQueryString?: string | null) => {
    const res = await getData(dateQueryString);

    setData(res);
  };

  const columnRenderers: { [key: string]: (el: CreditAppReportSummary) => any } = {
    customer: (el) => <CustomerColumn customer={el.customer} />,
    interested_vehicle: (el) => <VehicleColumn vehicle={el.interestedVehicle} />,
    trade_in_vehicle: (el) => <TradeInColumn vehicle={el.tradeInVehicle} />,
    lead_info: (el) => <LeadInfoColumn lead={el.leadInfo} />,
    credit_info: (el) => <CreditAppInfoColumn creditAppInfo={el.creditAppInfo} />,
    date: (el) => <DateColumn dateData={el.date} />,
    employment: (el) => <EmploymentColumn employer={el.employment} />,
  };

  const initialColumnsDef = {
    customer: true,
    interested_vehicle: true,
    trade_in_vehicle: true,
    lead_info: true,
    credit_info: true,
    date: true,
    employment: true,
  };

  const { columns } = useDynamicTableColumns<CreditAppReportSummary, typeof initialColumnsDef>({
    columnRenderers,
    initialColumnsDef,
    accessorFnMapper: {
      customer: (el) => el.customer.customerName,
      interested_vehicle: (el) => el.interestedVehicle?.vehicle,
      trade_in_vehicle: (el) => el.tradeInVehicle?.vehicle,
      lead_info: (el) => el.leadInfo.type,
      credit_info: (el) => el.creditAppInfo.bank,
      date: (el) => el.date.createdAt,
      employment: (el) => el.employment.employerName,
    },
    columnStyles: {
      customer: {
        minSize: 400,
      },
      interested_vehicle: {
        minSize: 300,
      },
      trade_in_vehicle: {
        minSize: 300,
      },
      lead_info: {
        minSize: 400,
      },
      credit_info: {
        minSize: 300,
      },
      date: {
        minSize: 300,
      },
      employment: {
        minSize: 300,
      },
    },
  });

  const filterableFields: FilterableField[] = [
    { id: 'customer.customerName', label: 'Customer', type: 'text' },
    { id: 'customer.cellPhone', label: 'Cell phone', type: 'text' },
    { id: 'customer.homePhone', label: 'Home phone', type: 'text' },
    { id: 'customer.email', label: 'Email', type: 'text' },
    { id: 'interestedVehicle.vehicle', label: 'Vehicle', type: 'text' },
    { id: 'tradeInVehicle.vehicle', label: 'Trade in vehicle', type: 'text' },
    { id: 'leadInfo.salesRepId', label: 'Sales rep', type: 'text' },
    { id: 'leadInfo.bdc', label: 'Bdc', type: 'text' },
    { id: 'leadInfo.manager', label: 'Manager', type: 'text' },
    { id: 'leadInfo.source', label: 'Lead source', type: 'text' },
    { id: 'leadInfo.type', label: 'Lead type', type: 'text' },
  ];

  const handleCloseWindow = () => {
    clearFilters();

    closeWindow(false);
  };

  const filteredData = applyFilter(data, {
    customerFullName: 'customer.customerName',
    leadSource: 'leadInfo.id',
    salesRep: 'leadInfo.salesRepId',
    customerStatus: 'customer.statusId',
  });

  const reloadHandling = async () => {
    setReloading(true);

    const resultForQuery = transformDateToQuery(createDate);

    const dateQuery = resultForQuery ? buildDateQueryString(resultForQuery) : null;

    await fetchData(dateQuery);

    setReloading(false);
  };

  const [showPdf, setShowPdf] = useState(false);

  // const columnDefinition: ColumnDefinition<CreditAppReportSummary> = {
  //   customer: {
  //     id: 'customer',
  //     label: 'Customer',
  //     style: { ...defaultDetailCellStyle, width: '100%' },
  //     render: (el) => (
  //       <>
  //         <View>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>Full name:</Text>
  //             {` ${el.customer.customerName}`}
  //           </Text>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>Cell phone:</Text>
  //             {` ${formatPhoneNumber(el.customer.cellPhone)}`}
  //           </Text>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>Home phone:</Text>
  //             {` ${formatPhoneNumber(el.customer.homePhone)}`}
  //           </Text>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>Email:</Text>
  //             {` ${el.customer.email}`}
  //           </Text>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>DOB:</Text>
  //             {` ${dateFormatted(2, el.customer.dateOfBirth)}`}
  //           </Text>
  //         </View>
  //         <View>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>City:</Text>
  //             {` ${el.customer.city}`}
  //           </Text>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>State:</Text>
  //             {` ${el.customer.state}`}
  //           </Text>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>Zip code:</Text>
  //             {` ${el.customer.zip}`}
  //           </Text>
  //         </View>
  //       </>
  //     ),
  //   },
  //   interestedVehicle: {
  //     id: 'interestedVehicle',
  //     label: 'Interested Vehicle',
  //     style: { ...defaultDetailCellStyle, width: '100%' },
  //     render: (el) => (
  //       <>
  //         <View>
  //           <Text>{` ${el.interestedVehicle?.vehicle}`}</Text>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>Price:</Text>
  //             {` $${el.interestedVehicle?.price}`}
  //           </Text>
  //           <Text>{` ${el.interestedVehicle?.millage}`}</Text>
  //           <Text>{` ${el.interestedVehicle?.vin}`}</Text>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>Stock #:</Text>
  //             {` ${el.interestedVehicle?.stockNumber}`}
  //           </Text>
  //         </View>
  //       </>
  //     ),
  //   },
  //   tradeInVehicle: {
  //     id: 'tradeInVehicle',
  //     label: 'Trade In Vehicle',
  //     style: { ...defaultDetailCellStyle, width: '100%' },
  //     render: (el) => (
  //       <>
  //         <View>
  //           <Text>{` ${el.tradeInVehicle?.vehicle}`}</Text>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>VIN:</Text>
  //             {` ${el.tradeInVehicle?.vin}`}
  //           </Text>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>Millage:</Text>
  //             {` ${el.tradeInVehicle?.millage}`}
  //           </Text>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>Price:</Text>
  //             {` $${el.tradeInVehicle?.price}`}
  //           </Text>
  //         </View>
  //       </>
  //     ),
  //   },
  //   leadInfo: {
  //     id: 'leadInfo',
  //     label: 'Lead Info',
  //     style: { ...defaultDetailCellStyle, width: '100%' },
  //     render: (el) => (
  //       <>
  //         <View>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>Status:</Text>
  //             {` ${el.leadInfo.status}`}
  //           </Text>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>Credit app completed:</Text>
  //             {` ${el.leadInfo.creditAppCompleted}`}
  //           </Text>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>Sales rep:</Text>
  //             {` ${el.leadInfo.salesRep}`}
  //           </Text>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>BDC rep:</Text>
  //             {` ${el.leadInfo.bdc}`}
  //           </Text>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>Manager:</Text>
  //             {` ${el.leadInfo.manager}`}
  //           </Text>
  //         </View>
  //         <View>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>Source:</Text>
  //             {` ${el.leadInfo.source}`}
  //           </Text>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>Type:</Text>
  //             {` ${el.leadInfo.type}`}
  //           </Text>
  //         </View>
  //       </>
  //     ),
  //   },
  //   creditInfo: {
  //     id: 'creditInfo',
  //     label: 'Credit Info',
  //     style: { ...defaultDetailCellStyle, width: '100%' },
  //     render: (el) => (
  //       <>
  //         <View>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>Bank Account:</Text>
  //             {` ${el.creditAppInfo.bank}`}
  //           </Text>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>Paystubs:</Text>
  //             {` ${el.creditAppInfo.paystubs}`}
  //           </Text>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>SSN/ITIN:</Text>
  //             {` ${el.creditAppInfo.ssnTin}`}
  //           </Text>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>Open Loan:</Text>
  //             {` ${el.creditAppInfo.openLoan}`}
  //           </Text>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>Cash down:</Text>
  //             {` ${el.creditAppInfo.cashDown}`}
  //           </Text>
  //         </View>
  //       </>
  //     ),
  //   },
  //   date: {
  //     id: 'date',
  //     label: 'Date',
  //     style: { ...defaultDetailCellStyle, width: '100%' },
  //     render: (el) => (
  //       <>
  //         <View>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>Created:</Text>
  //             {` ${dateFormatted(2, el.date.createdAt)}`}
  //           </Text>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>Sales rep assigned:</Text>
  //             {` ${el.date.salesRep}`}
  //           </Text>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>Days old:</Text>
  //             {` ${el.date.daysOld}`}
  //           </Text>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>Last contacted day:</Text>
  //             {` ${dateFormatted(2, el.date.lastContactedDay)}`}
  //           </Text>
  //         </View>
  //       </>
  //     ),
  //   },
  //   employment: {
  //     id: 'employment',
  //     label: 'Employment',
  //     style: { ...defaultDetailCellStyle, width: '100%' },
  //     render: (el) => (
  //       <>
  //         <View>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>Employer name:</Text>
  //             {` ${el.employment.employerName}`}
  //           </Text>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>Occupation:</Text>
  //             {` ${el.employment.occupation}`}
  //           </Text>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>Length at job:</Text>
  //             {` ${el.employment.lengthAtJob}`}
  //           </Text>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>Income:</Text>
  //             {` $${el.employment.income}`}
  //           </Text>
  //           <Text>
  //             <Text style={{ fontWeight: 'bold' }}>Work phone:</Text>
  //             {` ${formatPhoneNumber(el.employment.workPhone)}`}
  //           </Text>
  //         </View>
  //       </>
  //     ),
  //   }
  // };

  const xlsColumnDefinition: CellDefinitionType<CreditAppReportSummary> = {
    customer: {
      header: 'Customer',
      key: 'name',
      width: 20,
      rows: [
        {
          key: 'customerName',
          render: (el) => el.customer.customerName,
        },
        {
          key: 'cellPhone',
          render: (el) => formatPhoneNumber(el.customer.cellPhone),
        },
        {
          key: 'homePhone',
          render: (el) => formatPhoneNumber(el.customer.homePhone),
        },
        {
          key: 'email',
          render: (el) => el.customer.email,
        },
        {
          key: 'dob',
          render: (el) => dateFormatted(2, el.customer.dateOfBirth),
        },
        {
          key: 'city',
          render: (el) => el.customer.city,
        },
        {
          key: 'state',
          render: (el) => el.customer.state,
        },
        {
          key: 'zipCode',
          render: (el) => el.customer.zip,
        },
      ],
    },
    vehicle: {
      header: 'Interested Vehicle',
      key: 'vehiclename',
      width: 20,
      rows: [
        {
          key: 'vehicleName',
          render: (el) => el.interestedVehicle?.vehicle || '',
        },
        {
          key: 'price',
          render: (el) => `$${el.interestedVehicle?.price || 0}`,
        },
        {
          key: 'millage',
          render: (el) => el.interestedVehicle?.millage || '',
        },
        {
          key: 'vin',
          render: (el) => el.interestedVehicle?.vin || '',
        },
        {
          key: 'stock#',
          render: (el) => el.interestedVehicle?.stockNumber || '',
        },
      ],
    },
    tradeInVehicle: {
      header: 'Trade In Vehicle',
      key: 'tradeINVehicle',
      width: 20,
      rows: [
        {
          key: 'vehicleName',
          render: (el) => el.tradeInVehicle?.vehicle || '',
        },
        {
          key: 'vin',
          render: (el) => `${el.tradeInVehicle?.vin || ''}`,
        },
        {
          key: 'millage',
          render: (el) => el.tradeInVehicle?.millage || '',
        },
        {
          key: 'price',
          render: (el) => `$${el.tradeInVehicle?.price || 0}`,
        },
      ],
    },
    leadInfo: {
      header: 'Lead Info',
      key: 'leadInfo',
      width: 20,
      rows: [
        {
          key: 'Status',
          render: (el) => el.leadInfo.status || '',
        },
        {
          key: 'creditAppCompleted',
          render: (el) => `${el.leadInfo.creditAppCompleted || ''}`,
        },
        {
          key: 'salesRep',
          render: (el) => el.leadInfo.salesRep || '',
        },
        {
          key: 'bdcRep',
          render: (el) => `${el.leadInfo.bdc || 0}`,
        },
        {
          key: 'manager',
          render: (el) => `${el.leadInfo.manager || 0}`,
        },
        {
          key: 'source',
          render: (el) => `${el.leadInfo.source || 0}`,
        },
        {
          key: 'type',
          render: (el) => `${el.leadInfo.type || 0}`,
        },
      ],
    },
    creditInfo: {
      header: 'Credit Info',
      key: 'creditInfo',
      width: 20,
      rows: [
        {
          key: 'Bank Account',
          render: (el) => el.creditAppInfo.bank || '',
        },
        {
          key: 'incomeType',
          render: (el) => `${el.creditAppInfo.incomeType || ''}`,
        },
        {
          key: 'ssn/itin',
          render: (el) => el.creditAppInfo.ssnTin || '',
        },
        {
          key: 'cashDown',
          render: (el) => `${el.creditAppInfo.cashDown || 0}`,
        },
      ],
    },
    date: {
      header: 'Date',
      key: 'date',
      width: 20,
      rows: [
        {
          key: 'Created',
          render: (el) => dateFormatted(2, el.date.createdAt) || '',
        },
        {
          key: 'salesRepAssigned',
          render: (el) => `${el.date.salesRep || ''}`,
        },
        {
          key: 'daysOld',
          render: (el) => `${el.date.daysOld || ''}`,
        },
        {
          key: 'lastContactedDay',
          render: (el) => `${dateFormatted(2, el.date.lastContactedDay) || 0}`,
        },
      ],
    },
    employment: {
      header: 'Employment',
      key: 'employment',
      width: 20,
      rows: [
        {
          key: 'employerName',
          render: (el) => el.employment.employerName || '',
        },
        {
          key: 'occupation',
          render: (el) => `${el.employment.occupation || ''}`,
        },
        {
          key: 'lengthAtJob',
          render: (el) => `${el.employment.lengthAtJob || ''}`,
        },
        {
          key: 'income',
          render: (el) => `$${el.employment.income || 0}`,
        },
        {
          key: 'workPhone',
          render: (el) => `${formatPhoneNumber(el.employment.workPhone) || 0}`,
        },
      ],
    },
  };

  return (
    <ModalWindow top={0}>
      <ModalContainer width={97.395833} marginTop={1.759259}>
        <ModalContainerTitle
          title="Credit App Report"
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
            <ButtonContainer marginTop={0} marginBottom={1.5} widthFull alignContentEnd>
              <FilterGroupV2
                availableFilters={{
                  customerName: true,
                  createDate: true,
                  customerStatus: true,
                  leadSource: true,
                  salesRep: true,
                }}
                advancedFilterFields={filterableFields}
              />
            </ButtonContainer>
          )}
          <ColoredTableV2
            columns={columns}
            data={filteredData}
            textColor="#FFF"
            paginationIsActive
            itemsPerPage={8}
            bodyTdContentHeight="100%"
            bodyTdContentOverflowX="scroll"
            loading={loading || reloading}
            printButtonIsActive
            customPrint={() => setShowPdf(true)}
          />
          <AnimatePresence>
            {/* {showPdf && (
              <PdfContainerByDefinitions
                name="Credit_Report"
                dataTable={filteredData}
                handleCloseWindow={() => setShowPdf(false)}
                columnDefinition={columnDefinition}
                xlsColumnDefinition={xlsColumnDefinition}
              />
            )} */}
          </AnimatePresence>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
