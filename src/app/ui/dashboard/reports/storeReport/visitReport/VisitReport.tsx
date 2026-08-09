import { useCallback, useState } from 'react';
import { CloseWindow } from '@/app/libs/definitions';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { VisitReportData } from '@/app/api/reports/storeReport/visitReport/types';
import { getData } from './visitReport.services';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { dateFormatsStore } from '@/store/dateFormats';
import { CustomerColumn } from './customerColumn/CustomerColumn';
import { VehicleFormatName } from '@/app/ui/miscellaneous/vehicelPicker/VehiclePicker';
import { modalWindowStore, singleCLientDataStore } from '@/store/adminDashboard';
import { FilterGroupV2 } from '@/app/ui/miscellaneous/filterGroup/FilterGroupV2';
import { reportsFiltersStore, transformDateToQuery } from '@/store/filtersHandling';
import { buildDateQueryString } from '@/app/libs/buildDatePrismaFilter';
import { ExtraTitleButtonsReports } from '@/app/ui/miscellaneous/extraTitleButtonsReports/ExtraTitleButtonsReports';
import { FilterableField } from '@/store/customerList/types';
import { AnimatePresence } from 'framer-motion';
// import {
//   ColumnDefinition,
//   DateFormat,
//   defaultDetailCellStyle,
//   MobilePhone,
//   PdfContainerByDefinitions,
//   tw,
// } from './generateTablePdf';
// import { Text, View } from '@react-pdf/renderer';
import { CellDefinitionType, textLabelValueCell } from './xlsGenerator';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';

export function VisitReport({ closeWindow }: CloseWindow) {
  // ----- global states -----

  const { dateFormatted } = dateFormatsStore();

  const { getSingleClientData } = singleCLientDataStore();
  const { openClientDetail } = modalWindowStore();

  const createDate = reportsFiltersStore((store) => store.createDate);
  const { clearFilters, applyFilter } = reportsFiltersStore();

  const { formatPhoneNumber } = phoneNumbersFormatStore();

  // ----- local states -----

  const [showFilter, setShowFilter] = useState(true);

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

  const [data, setData] = useState<VisitReportData[]>([]);

  const fetchData = async (dateQueryString?: string | null) => {
    const fetchedData = await getData({ dateQueryString });

    setData(fetchedData);
  };

  type VisitArray = Exclude<VisitReportData[], undefined>;

  type VisitItem = VisitArray[number];

  const handleComments = (comment: string) => {
    if (comment.length <= 14) return comment;

    return `${comment.slice(-14)}...`;
  };

  const handleDate = (dateFormatted: string) => {
    const dateSplitted = dateFormatted.split(',');

    const [date, time] = dateSplitted;

    return (
      <div className="flex flex-col">
        <p>{date}</p>
        <p>{time}</p>
      </div>
    );
  };

  const columnRenderers: { [key: string]: (el: VisitItem) => any } = {
    visit_date: (el) => handleDate(dateFormatted(5, el.visitDate)),
    customer: (el) => (
      <CustomerColumn
        cellPhone={el.cellPhone}
        email={el.email}
        fullName={el.customerName}
        homePhone={el.homePhone}
        salesRepName={el.salesRepName}
      />
    ),
    vehicle: (el) => {
      const { brand, model, vin, year } = el.interestedVehicle;

      return (
        <VehicleFormatName brand={brand} model={model} lastSixVin={vin.slice(-6)} year={year} />
      );
    },
    customer_status: (el) => el.customerStatus,
    source: (el) => el.source,
    comments: (el) => handleComments(el.comments),
  };

  const initialColumnsDef = {
    visit_date: true,
    customer: true,
    vehicle: true,
    customer_status: true,
    source: true,
    comments: true,
  };

  const { columns } = useDynamicTableColumns<VisitReportData, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    columnRenderers,
    accessorFnMapper: {
      visit_date: (el) => el.visitDate,
      customer: (el) => el.customerName,
      vehicle: (el) => `${el.interestedVehicle.brand} ${el.interestedVehicle.model}`,
      customer_status: (el) => el.customerStatus,
      source: (el) => el.source,
      comments: (el) => el.comments,
    },
    columnStyles: {
      visit_date: {
        size: 83,
      },
      source: {
        size: 100,
      },
    },
  });

  const filteredData = applyFilter(data, {
    salesRep: 'salesRepId',
    customerFullName: 'customerName',
    customerMobilePhone: 'cellPhone',
  });

  // handling close current window
  const handleCloseWindow = () => {
    closeWindow(false);
  };

  const [reloadingData, setReloadingData] = useState(false);

  const reloadHandling = async () => {
    setReloadingData(true);

    const resultForQuery = transformDateToQuery(createDate);

    const dateQuery = resultForQuery ? buildDateQueryString(resultForQuery) : null;

    await fetchData(dateQuery);

    setReloadingData(false);
  };

  const filterableFields: FilterableField[] = [
    { id: 'salesRepName', label: 'Sales Rep', type: 'text' },
    { id: 'homePhone', label: 'Home Phone', type: 'text' },
    { id: 'cellPhone', label: 'Cell Phone', type: 'text' },
    { id: 'email', label: 'Email', type: 'text' },
    { id: 'interestedVehicle', label: 'Vehicle', type: 'text' },
  ];

  const [showPdf, setShowPdf] = useState(false);

  // const columnDefinition: ColumnDefinition<VisitReportData> = {
  //   visitDate: {
  //     id: 'visitDate',
  //     label: 'Visit Date',
  //     render: (el) => DateFormat({ date: el.visitDate, format: 4 }),
  //     style: { ...defaultDetailCellStyle, width: '100%' },
  //   },
  //   customer: {
  //     id: 'customer',
  //     label: 'Customer',
  //     render: (el) => (
  //       <>
  //         <View style={{ ...tw('flex flex-col gap-1') }}>
  //           <Text style={{ fontWeight: 'bold' }}>{el.customerName}</Text>
  //           <Text>
  //             Home Phone: <MobilePhone phone={el.homePhone || ''} />
  //           </Text>
  //           <Text>
  //             Cell Phone: <MobilePhone phone={el.cellPhone || ''} />
  //           </Text>
  //           <Text>{`Email: ${el.email || ''}`}</Text>
  //           <Text>{`Sales Rep: ${el.salesRepName || ''}`}</Text>
  //           {/* <Text>
  //               DOB: <DateFormat date={el.born_date} />
  //             </Text> */}
  //         </View>
  //         {/* <View style={{ ...tw('flex flex-col gap-1 px-2/'), flex: 1 }}>
  //             <Text>{`City: ${el.client_address.city || 'N/A'}`}</Text>
  //             <Text>{`State: ${el.client_address.state.state || 'N/A'}`}</Text>
  //             <Text>{`Zip: ${el.client_address.zip || 'N/A'}`}</Text>
  //             <Text>{`Income: ${el.other_income || 'N/A'}`}</Text>
  //             <Text>{`Cash Down: ${el.cash_down || 'N/A'}`}</Text>
  //           </View> */}
  //       </>
  //     ),
  //     style: { ...defaultDetailCellStyle, width: '100%' },
  //   },
  //   vehicle: {
  //     id: 'vehicle',
  //     label: 'Vehicle',
  //     render: (el) => {
  //       const vehicleObj = el.interestedVehicle;
  //       const { brand, model, vin, year } = vehicleObj;
  //       const lastSixVin = vin?.slice(vin.length - 6, vin.length);

  //       return (
  //         <Text>
  //           {`${year} ${brand} `} {`${model} [${lastSixVin}]`}
  //         </Text>
  //       );
  //     },
  //     style: { ...defaultDetailCellStyle, width: '100%' },
  //   },
  //   customerStatus: {
  //     id: 'customerStatus',
  //     label: 'customer Status',
  //     render: (el) => <Text>{el.customerStatus}</Text>,
  //     style: { ...defaultDetailCellStyle, width: '100%' },
  //   },
  //   source: {
  //     id: 'source',
  //     label: 'source',
  //     render: (el) => <Text>{el.source}</Text>,
  //     style: { ...defaultDetailCellStyle, width: '100%' },
  //   },
  //   comments: {
  //     id: 'comments',
  //     label: 'comments',
  //     render: (el) => <Text>{el.comments}</Text>,
  //     style: { ...defaultDetailCellStyle, width: '100%' },
  //   },
  // };

  const xlsColumnDefinition: CellDefinitionType<VisitReportData> = {
    visitDate: {
      header: 'Visit Date',
      key: 'visitDate',
      width: 20,
      render: (el) => dateFormatted(5, el.visitDate),
    },
    customer: {
      header: 'Customer',
      key: 'name',
      width: 20,
      rows: [
        {
          key: 'name_customer',
          render: (el) => el.customerName,
        },
        {
          key: 'home_phone',
          render: (el, colorView) => {
            const homePhone = formatPhoneNumber(el.homePhone);
            return textLabelValueCell('Home Phone', homePhone, colorView);
          },
        },
        {
          key: 'phone_customer',
          render: (el, colorView) => {
            const phone = formatPhoneNumber(el.cellPhone);
            return textLabelValueCell('Cell Phone', phone, colorView);
          },
        },
        {
          key: 'email',
          render: (el, colorView) => {
            const email = el.email || '';
            return textLabelValueCell('Email', email, colorView);
          },
        },
        {
          key: 'sales_rep',
          render: (el, colorView) => {
            const salesRep = el.salesRepName || '';
            return textLabelValueCell('Sales Rep', salesRep, colorView);
          },
        },
      ],
    },
    vehicle: {
      header: 'Vehicle',
      key: 'vehicle',
      width: 20,
      render: (el) => {
        const vehicleObj = el.interestedVehicle;
        const { brand, model, vin, year } = vehicleObj;
        const lastSixVin = vin?.slice(vin.length - 6, vin.length);

        return `${year} ${brand} ${model} [${lastSixVin}]`;
      },
    },
    customerStatus: {
      header: 'Customer Status',
      key: 'customerStatus',
      width: 20,
      render: (el) => el.customerStatus,
    },
    source: {
      header: 'Source',
      key: 'source',
      width: 20,
      render: (el) => el.source,
    },
    comments: {
      header: 'Comments',
      key: 'comments',
      width: 20,
      render: (el) => el.comments,
    },
  };

  return (
    <ModalWindow top={0}>
      <ModalContainer width={97.395833} marginTop={1.759259}>
        <ModalContainerTitle
          title="Visit Report"
          closeWindowFunction={() => {
            clearFilters();

            handleCloseWindow();
          }}
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
          <ButtonContainer marginTop={0} marginBottom={1.5} widthFull alignContentCenter>
            <FilterGroupV2
              availableFilters={{
                customerName: true,
                createDate: true,
                salesRep: true,
                createDateLabel: 'Visit Date',
              }}
              advancedFilterFields={filterableFields}
            />
          </ButtonContainer>
          <ColoredTableV2
            data={filteredData}
            columns={columns}
            initialColumnsDef={initialColumnsDef}
            itemsPerPage={12}
            paginationIsActive
            textColor="#FFF"
            height={63.2}
            rowSelectionIsActive={false}
            printButtonIsActive
            loading={loading || reloadingData}
            bodyTdContentHeight="100%"
            bodyTdContentOverflowX="scroll"
            customPrint={() => setShowPdf(true)}
            onRowClick={(rowData) => {
              const customerId = rowData.customerId;

              if (customerId) {
                getSingleClientData(customerId?.toString());

                openClientDetail();
              }
            }}
          />
          {/* <AnimatePresence>
            {showPdf && (
              <PdfContainerByDefinitions
                name="Visit_Report"
                dataTable={filteredData}
                handleCloseWindow={() => setShowPdf(false)}
                columnDefinition={columnDefinition}
                xlsColumnDefinition={xlsColumnDefinition}
              />
            )}
          </AnimatePresence> */}
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
