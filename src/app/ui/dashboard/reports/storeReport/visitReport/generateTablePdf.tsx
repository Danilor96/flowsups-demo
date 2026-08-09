import { Clients, ClientType, InterestedVehicle } from '@/app/libs/definitions';
import { createTw } from 'react-pdf-tailwind';
import { Page, Text, View, Document, StyleSheet, Image, PDFViewer, pdf } from '@react-pdf/renderer';
import { daysOld } from '../../../clientSystem/customerLists/utils/utils';
import { ModalContent } from '@/app/ui/modalWindowsStructure/ModalContent';
import { ModalContainer } from '@/app/ui/modalWindowsStructure/ModalContainer';
import { ModalWindow } from '@/app/ui/modalWindowsStructure/ModalWindow';
import { Button } from '@/app/ui/buttons/Button';
import { Input } from '@/app/ui/inputs/Input';
import { ModalContainerTitle } from '@/app/ui/modalWindowsStructure/ModalContainerTitle';
import { SoldPdfTable } from '../soldCustomer/generateTablePdf';
import { useMemo, useState } from 'react';
import { CellDefinitionType, exportTableToExcel } from './xlsGenerator';

export const tw = createTw({
  theme: {
    fontFamily: {
      sans: ['Comic Sans'],
    },
    extend: {
      colors: {
        custom: '#bada55',
      },
    },
  },
});

interface ClientPdfTableProps {
  columnData: Clients;
  name: string;
  colorView?: boolean;
  columnDefinition: ColumnDefinition<any>;
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: '1vw',
    paddingVertical: '1vh',
  },
  view: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3vh',
  },
  table: {
    border: '0.2vw solid #92CEC3',
    borderRadius: '0.520833vw',
    overflow: 'hidden',
  },
  body: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    color: '#FFF',
  },
});

export const UserAssignedName = ({
  userFullName,
  labelText,
}: {
  userFullName: string;
  labelText: string;
}) => {
  return (
    <Text>
      {/* <Text style={{ ...tw('font-semibold') }}>{labelText}</Text> */}
      <Text style={{ ...tw('font-bold') }}>{labelText + ' '}</Text>
      {userFullName}
    </Text>
  );
};

export const PropertyBold = ({ labelText, value }: { value: string; labelText: string }) => {
  return (
    <Text>
      {/* <Text style={{ ...tw('font-semibold') }}>{labelText}</Text> */}
      <Text style={{ ...tw('font-bold') }}>{labelText + ' '}</Text>
      {value}
    </Text>
  );
};

export const MobilePhone = ({ phone }: { phone: string }) => {
  if (!phone) return <Text>{'N/A'}</Text>;

  const customerContactArray = phone?.split('');
  const customerContactFormatted = `${customerContactArray
    ?.slice(0, 3)
    .join('')}-${customerContactArray?.slice(3, 6).join('')}-${customerContactArray
    ?.slice(6, 10)
    .join('')}`;

  return <Text> {`${customerContactFormatted}`}</Text>;
};

export const DateFormat = ({
  date,
  format,
}: {
  date: Date | null | undefined;
  format?: number;
}) => {
  if (!date) return <Text>{'N/A'}</Text>;

  let newDateFormat: Intl.DateTimeFormatOptions = {};

  switch (format) {
    case 1:
      newDateFormat = {
        hour: '2-digit',
        minute: '2-digit',
      };
      break;

    case 2:
      newDateFormat = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      break;

    case 3:
      newDateFormat = {
        month: 'long',
      };
      break;

    case 4:
      newDateFormat = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      break;

    case 5:
      newDateFormat = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      };
      break;

    default:
      newDateFormat = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      };
      break;
  }

  return <Text>{new Date(date).toLocaleString('en-US', newDateFormat)}</Text>;
};

export const VehicleFormat = ({ interestedVehicle }: { interestedVehicle: InterestedVehicle }) => {
  if (!interestedVehicle) return <Text>{''}</Text>;

  const year = interestedVehicle?.vehicle_manufacture_years?.year;
  const brand = interestedVehicle?.vehicle_brands.brand.toUpperCase();
  const model = interestedVehicle?.vehicle_models.model;
  const vin = interestedVehicle?.vehicle_identification_numbers.vin;
  const lastSixVin = vin?.slice(vin.length - 6, vin.length);
  const stockNo = interestedVehicle?.stock_no;
  const lastSixStockNo = stockNo ? `[${stockNo.slice(-6)}]` : '';

  return (
    <Text>
      {`${year} ${brand} `} {`${model} ${lastSixStockNo}`}
    </Text>
  );
};

export const CustomerStatus = ({
  status,
  colorView = true,
}: {
  status: string | undefined | null;
  colorView?: boolean;
}) => {
  if (!status) return <Text>{'N/A'}</Text>;

  return (
    <Text
      style={{
        ...tw(
          `rounded-2xl text-sm flex py-1 px-2 font-bold capitalize items-center justify-center
          ${
            colorView ? 'bg-[#C9EBE6] text-[#00A78B]' : 'bg-[#FFF] text-black border border-black'
          }`,
        ),
      }}
    >
      {status}
    </Text>
  );
};

const CellView = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
  className?: string;
}) => {
  return (
    <View
      style={{
        // width: `${100 / data.length}%`,
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        textAlign: 'center',
        ...style,
      }}
    >
      {children}
    </View>
  );
};

export interface ColumnDefinition<T> {
  [key: string]: {
    id: string;
    label: string;
    render: (el: T, colorView?: boolean) => JSX.Element;
    style: any | undefined;
  };
}

const COLUMN_DEFINITIONS: ColumnDefinition<ClientType> = {
  customer_name: {
    id: 'customer_name',
    label: 'Customer Name',
    render: (el) => (
      <Text style={{ fontWeight: 'bold' }}>{`${el.first_name} ${el.last_name}`}</Text>
    ),
    style: {},
  },
  assigned_to: {
    id: 'assigned_to',
    label: 'Assigned To',
    render: (el) => (
      <View style={{ ...tw('flex gap-1') }}>
        <UserAssignedName
          labelText="Sales Rep:"
          userFullName={`${el.seller?.name || 'N/A'} ${el.seller?.last_name || ''}`}
        />
        <UserAssignedName
          labelText="BDC Rep:"
          userFullName={`${el.bdc?.name || 'N/A'} ${el.bdc?.last_name || ''}`}
        />
        <UserAssignedName
          labelText="Sales Manager:"
          userFullName={`${el.sales_manager?.name || 'N/A'} ${el.sales_manager?.last_name || ''}`}
        />
      </View>
    ),
    style: { textAlign: 'left', paddingHorizontal: '4px' },
  },
  phone_number: {
    id: 'phone_number',
    label: 'Phone Number',
    render: (el) => <MobilePhone phone={el.mobile_phone || ''} />,
    style: { justifyContent: 'center' },
  },
  credit_app: {
    id: 'credit_app',
    label: 'Credit App',
    render: (el) => <Text>{el.credit_app_list_status_id ? 'Yes' : 'No'}</Text>,
    style: { justifyContent: 'center' },
  },
  source: {
    id: 'source',
    label: 'Source',
    render: (el) => <Text>{el.lead_source?.source}</Text>,
    style: { justifyContent: 'center' },
  },
  city: {
    id: 'city',
    label: 'City',
    render: (el) => <Text>{el.client_address?.city || ''}</Text>,
    style: { justifyContent: 'center' },
  },
  state: {
    id: 'state',
    label: 'State',
    render: (el) => <Text>{el.client_address?.state?.state || ''}</Text>,
    style: { justifyContent: 'center' },
  },
  status: {
    id: 'status',
    label: 'Status',
    render: (el, colorView) => (
      <CustomerStatus status={el.client_status?.status} colorView={colorView} />
    ),
    style: { ...tw('flex justify-center items-center w-full') },
  },
  created_date: {
    id: 'created_date',
    label: 'Created Date',
    render: (el) => <DateFormat date={el.created_at} />,
    style: { justifyContent: 'center' },
  },
  created_by: {
    id: 'created_by',
    label: 'Created By',
    render: (el) => <Text>{'User Admin'}</Text>,
    style: { justifyContent: 'center' },
  },
  interested_vehicle: {
    id: 'interested_vehicle',
    label: 'Interested Vehicle',
    render: (el) => <VehicleFormat interestedVehicle={el.interested_vehicle} />,
    style: { justifyContent: 'center' },
  },
};

export const defaultDetailCellStyle = {
  // width: `${100 / data.length}%`,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'flex-start',
  textAlign: 'left',
  flexDirection: 'row',
  //   paddingHorizontal: '10px',
  paddingRight: '10px',
  gap: '8px',
};

const DETAIL_COLUMN_DEFINITIONS: ColumnDefinition<ClientType> = {
  customer: {
    id: 'customer',
    label: 'Customer',
    render: (el) => (
      <>
        <View style={{ ...tw('flex flex-col gap-1') }}>
          <Text style={{ fontWeight: 'bold' }}>{`${el.first_name} ${el.last_name}`}</Text>
          <Text>
            Cell Phone: <MobilePhone phone={el.mobile_phone || ''} />
          </Text>
          <Text>
            Home Phone: <MobilePhone phone={el.home_phone || ''} />
          </Text>
          <Text>{`Email: ${el.email || ''}`}</Text>
          {/* <Text>
            DOB: <DateFormat date={el.born_date} />
          </Text> */}
        </View>
        {/* <View style={{ ...tw('flex flex-col gap-1 px-2/'), flex: 1 }}>
          <Text>{`City: ${el.client_address.city || 'N/A'}`}</Text>
          <Text>{`State: ${el.client_address.state.state || 'N/A'}`}</Text>
          <Text>{`Zip: ${el.client_address.zip || 'N/A'}`}</Text>
          <Text>{`Income: ${el.other_income || 'N/A'}`}</Text>
          <Text>{`Cash Down: ${el.cash_down || 'N/A'}`}</Text>
        </View> */}
      </>
    ),
    style: { ...defaultDetailCellStyle, width: '100%' },
  },
  interested_vehicle: {
    id: 'interested_vehicle',
    label: 'Vehicle Sold',
    render: (el) => (
      <>
        <VehicleFormat interestedVehicle={el.interested_vehicle} />
      </>
    ),
    style: { ...defaultDetailCellStyle, width: '100%', paddingHorizontal: '' },
  },
  lead_info: {
    id: 'lead_info',
    label: 'Lead Info',
    render: (el: ClientType) => (
      <>
        <View style={{ ...tw('flex flex-col gap-1 items-start'), flex: 1 }}>
          {/* <Text>Status: {el.client_status?.status || 'No status stablished'}</Text> */}
          {/* <Text>Credit App: {el.credit_app_list_status_id ? 'Yes' : 'No'}</Text> */}
          {/* <Text>{`Email: ${el.email || 'N/A'}`}</Text> */}
          <UserAssignedName
            labelText="Sales Rep:"
            userFullName={`${el.seller?.name || 'N/A'} ${el.seller?.last_name || ''}`}
          />
          <UserAssignedName
            labelText="BDC Rep:"
            userFullName={`${el.bdc?.name || 'N/A'} ${el.bdc?.last_name || ''}`}
          />
          <UserAssignedName
            labelText="Manager:"
            userFullName={`${el.sales_manager?.name || 'N/A'} ${el.sales_manager?.last_name || ''}`}
          />
          <PropertyBold labelText="Source:" value={`${el.lead_source?.source || ''}`} />
        </View>
        {/* <View style={{ ...tw('flex flex-col gap-1 px-2/'), flex: 1 }}>         
          <Text>{`Type: ${el.lead_type?.type || 'N/A'}`}</Text>
        </View> */}
      </>
    ),
    style: { ...defaultDetailCellStyle, paddingHorizontal: '', width: '100%' },
  },
  date: {
    id: 'date',
    label: 'Date',
    render: (el: ClientType) => (
      <View style={{ ...tw('flex flex-col gap-1 items-start justify-start'), flex: 1 }}>
        <Text>
          Created: <DateFormat date={el.created_at} />
        </Text>
        <Text>
          Sales Assigned: <DateFormat date={el.last_activity} />
        </Text>
        <Text>
          Sold: <DateFormat date={el.last_activity} />
        </Text>
        <Text>
          Delivered :{' '}
          <DateFormat
            date={
              el.vehicle_delivery &&
              el.vehicle_delivery.length > 0 &&
              el.vehicle_delivery[el.vehicle_delivery.length - 1].start_date
                ? el.vehicle_delivery[el.vehicle_delivery.length - 1].start_date
                : null
            }
          />
        </Text>
        <Text>
          Vehicle Days Old:{' '}
          {el.interested_vehicle && el.interested_vehicle.entry_stock
            ? daysOld(el.interested_vehicle.entry_stock)
            : ''}
        </Text>
        {/* </View> */}
      </View>
    ),
    style: { ...defaultDetailCellStyle, paddingHorizontal: '' },
  },
  deal_info: {
    id: 'deal_info',
    label: 'Deal Info',
    render: (el: ClientType) => {
      const dealInfo = el.deal.length > 0 ? el.deal[el.deal.length - 1] : null;
      const bank = dealInfo ? dealInfo.bank : ' ';
      const downPayment = dealInfo ? dealInfo.downpayment : '0';
      const paid = dealInfo ? dealInfo.paid : '';
      const deferredMoney = dealInfo ? dealInfo.deferredDownpayment[0] : '0';
      const frontend = dealInfo ? dealInfo.frontend : '0';
      const backend = dealInfo ? dealInfo.backend : '0';
      const totalProfit = dealInfo ? dealInfo.totalProfit : '0';
      const bonus = dealInfo ? dealInfo.bonus : '0';
      const totalDeferredDownpayment =
        parseFloat(downPayment.replaceAll(',', '')) -
        parseFloat(paid.replaceAll(',', '')) -
        parseFloat(bonus.replaceAll(',', ''));

      return (
        <>
          <View style={{ ...tw('flex flex-col gap-1'), flex: 1 }}>
            <Text>Frontend: {frontend || ''}</Text>
            <Text>Backend: {backend || ''}</Text>
            <Text>Total : {totalProfit || ''}</Text>
            <Text>{`Lender: ${bank || ''}`}</Text>
            {/* <Text>
            DOB: <DateFormat date={el.born_date} />
          </Text> */}
          </View>
          <View style={{ ...tw('flex flex-col gap-1 px-2/'), flex: 1 }}>
            <Text>{`Money Down: ${paid || ''}`}</Text>
            <Text>{`Deferred: ${totalDeferredDownpayment || ''}`}</Text>
            <Text>{`Bonus: ${bonus || ''}`}</Text>
            <Text>{`Total Down: ${downPayment || ''}`}</Text>
            {/* <Text>{`Cash Down: ${el.cash_down || 'N/A'}`}</Text> */}
          </View>
        </>
      );
    },
    style: { ...defaultDetailCellStyle, width: '100%', paddingHorizontal: '0px' },
  },
};

interface props {
  handleCloseWindow: () => void;
  dataTable: any[] | undefined;
  columnDefinition: ColumnDefinition<any>;
  name: string;
  xlsColumnDefinition: CellDefinitionType<any>;

  // pagination: {
  //   currentPage: number;
  //   totalPages: number;
  //   itemsPerPage: number;
  // };
  // visibleColumns: string[];
}

export const PdfContainerByDefinitions = ({
  handleCloseWindow,
  dataTable,
  columnDefinition,
  name,
  xlsColumnDefinition,
}: // pagination,
// visibleColumns
props) => {
  // ----- local states -----
  const [exportTo, setExportTo] = useState('PDF');
  const [printFrom, setPrintFrom] = useState('All');
  const [colorView, setColorView] = useState(true);

  const styles = StyleSheet.create({
    viewer: {
      width: '100%',
      height: '100%',
    },
  });

  const PdfDocument = useMemo(() => {
    if (!dataTable || dataTable.length === 0) {
      return (
        <Document>
          <Page size="A4">
            <Text>No data available</Text>
          </Page>
        </Document>
      );
    }
    const clientsToExport = dataTable;

    return (
      <PdfTable
        columnDefinition={columnDefinition}
        columnData={clientsToExport}
        name={`${name}-list-`}
        colorView={colorView}
      />
    );
  }, [dataTable, printFrom, colorView, name]);

  const savePDF = async () => {
    const blob = await pdf(PdfDocument).toBlob();
    const file = new Blob([blob], { type: 'application/pdf' });
    const url = URL.createObjectURL(file);

    // Trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}-list-${Date.now().toString()}.pdf`;
    link.click();
  };

  const printPDF = async () => {
    const blob = await pdf(PdfDocument).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url); // Abre el PDF en una nueva pestaña
  };

  const handleExport = () => {
    const clientsToExport = dataTable;

    if (exportTo === 'XLS') {
      return exportTableToExcel(
        clientsToExport || [],
        `${name}-list-${Date.now().toString()}.xlsx`,
        colorView,
        {
          visibleColumns: [],
        },
        xlsColumnDefinition,
      );
    }
    if (exportTo === 'PDF' && PdfDocument) {
      savePDF();
    }
  };

  return (
    <ModalWindow top={-13.8}>
      <ModalContainer marginTop={2} width={98}>
        <ModalContainerTitle title="Print" closeWindowFunction={handleCloseWindow} />
        <ModalContent overflowVisible height={88}>
          <div className="flex h-full w-full rounded-md">
            <section className="w-[20%] h-[100%] pr-7 flex flex-col bg-[white] border-r-2 border-[#E0E0E0]">
              <div className="flex flex-col pt-4 h-full gap-4">
                {/* <div className="flex flex-col gap-2">
                  <Input
                    type="select"
                    value={printFrom === 'All' ? '1' : '2'}
                    onChange={e => (e.target.value === '1' ? setPrintFrom('All') : setPrintFrom('currentPage'))}
                    options={[
                      { value: 1, option: 'All' },
                      { value: 2, option: 'This Page' }
                    ]}
                    label="Page"
                    name="printFrom"
                    width={10}
                  />
                  <span className="text-[1.396296vh] text-[#959595] font-light leading-[1.805556.vh]">
                    Page {`${printFrom === 'currentPage' ? pagination.currentPage : `1 - ${pagination.totalPages}`}`}
                  </span>
                </div> */}
                {/* <Input
                  type="select"
                  value={viewTypeValue === 'list' ? '1' : '2'}
                  onChange={handleViewTypeChange}
                  options={[
                    { value: 1, option: 'List View' },
                    { value: 2, option: 'Detail View' }
                  ]}
                  label="View Type"
                  name="viewType"
                  width={10}
                /> */}
                <Input
                  type="select"
                  value={colorView ? '1' : '2'}
                  onChange={(e) => setColorView(e.target.value === '1')}
                  options={[
                    { value: 1, option: 'flowsups colors' },
                    { value: 2, option: 'Black and white' },
                  ]}
                  label="Color"
                  name="colorView"
                  width={10}
                />
                <Input
                  type="select"
                  value={exportTo === 'PDF' ? '1' : '2'}
                  onChange={(e) => setExportTo(e.target.value === '1' ? 'PDF' : 'XLS')}
                  options={[
                    { value: 1, option: 'PDF' },
                    { value: 2, option: 'XLS' },
                  ]}
                  label="Export as"
                  name="exportAs"
                  width={10}
                />
              </div>
              <div className="flex gap-3 justify-center items-center">
                <Button
                  onClick={() => printPDF()}
                  width={8}
                  buttonText="Print"
                  borderColor="#00A78B"
                  backgroundColor=""
                  textColor="#00A78B"
                  border={0.104167}
                  identity="cancelarExportTo"
                />
                <Button
                  onClick={() => handleExport()}
                  width={8}
                  buttonText="Export"
                  backgroundColor="#00A78B"
                  textColor="#FFF"
                  border={0.104167}
                  identity="c-listExportTo"
                  borderColor="#00A78B"
                />
              </div>
            </section>
            <div className="w-[80%] h-[100%]">
              <PDFViewer style={styles.viewer} showToolbar={true}>
                {PdfDocument}
              </PDFViewer>
            </div>
          </div>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
};

export const PdfTable = ({
  columnData,
  name,
  colorView = true,
  columnDefinition,
}: ClientPdfTableProps) => {
  const pages = [];
  const MAX_ROWS_PER_PAGE = 6; //viewType === ListViewTypes.ListView ? 7 : 6;

  let data = columnData || [];
  for (let i = 0; i < data.length; i += MAX_ROWS_PER_PAGE) {
    pages.push(data.slice(i, i + MAX_ROWS_PER_PAGE));
  }

  const pageOrientation = 'landscape';
  // const dataToTablePdf = generateListViewTableData(clients);
  const columnsDefinitionsByView = columnDefinition; // viewType === ListViewTypes.ListView ? COLUMN_DEFINITIONS : DETAIL_COLUMN_DEFINITIONS;
  const colsTotal = Object.keys(columnsDefinitionsByView);
  const localVisibleClomnsIds = colsTotal;
  //visibleColumnIds.length > 0 ? colsTotal.filter(col => visibleColumnIds.includes(col)) : colsTotal;

  const hasData = data && data.length > 0;

  return (
    <Document
      title={`${name.split(' ').join('_')}_${new Date().toLocaleString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })}`}
    >
      {pages.map((pageData, pageIndex) => (
        <Page
          key={`${pageIndex}<${pageIndex + pageIndex}`}
          style={styles.page}
          orientation={pageOrientation}
        >
          {/*eslint-disable-next-line jsx-a11y/alt-text*/}
          <Image
            src="/flowsups.png"
            style={{
              width: pageOrientation === 'landscape' ? '20vw' : '30vw',
              height: pageOrientation === 'landscape' ? '3vh' : '3vh',
              marginBottom: '4vh',
            }}
          />
          {/* table */}
          <View
            style={{
              ...styles.table,
              border: colorView ? '0.2vw solid #92CEC3' : '1px solid #000',
            }}
          >
            {/* header */}
            <View
              style={{
                width: '100%',
                height: pageOrientation === 'landscape' ? '3.5vh' : '2vh',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: colorView ? '#92CEC3' : '',
                color: colorView ? '#FFF' : '#000',
                fontSize: pageOrientation === 'landscape' ? '1.4vh' : '1.1vh',
                fontWeight: 'bold',
                borderBottom: colorView ? '' : '1px solid #000',
                paddingHorizontal: '10px', //viewType === ListViewTypes.DetailView ? '10px' : '',
              }}
            >
              {localVisibleClomnsIds.map((columnId, index) => (
                // cell
                <View
                  key={index}
                  style={{
                    // width: `${100 / data.length}%`,
                    width: `${index === 0 ? '100%' : '100%'}`, // viewType === ListViewTypes.ListView ? '100%' : `${index === 0 ? '130%' : '100%'}`,
                    display: 'flex',
                    justifyContent: 'flex-start',
                    textAlign: 'left', //viewType === ListViewTypes.ListView ? 'center' : 'left',
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    {columnsDefinitionsByView[columnId]?.label || ''}
                  </Text>
                </View>
              ))}
            </View>
            {/* body */}
            <View style={{ ...styles.body, color: colorView ? '#FFF' : '#000' }}>
              {hasData &&
                pageData.map((el, index) => (
                  // tr -> row
                  <View
                    key={el.id}
                    style={{
                      // height: pageOrientation === 'landscape' ? '3.5vh' : '2vh',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor:
                        index % 2
                          ? colorView
                            ? '#92CEC3'
                            : '#FFF'
                          : colorView
                          ? '#00A78B'
                          : '#FFF',
                      fontSize: pageOrientation === 'landscape' ? '1.2vh' : '0.8vh',
                      paddingVertical: '10px',
                      borderBottom: colorView ? '' : '1px solid #000',
                      paddingHorizontal: '10px',
                    }}
                  >
                    {/* // cell */}
                    {localVisibleClomnsIds.map((columnId, columnIndex) => {
                      const column = columnsDefinitionsByView[columnId];
                      if (!column) return null;
                      return (
                        <CellView key={el.id + columnId} style={column.style}>
                          {column.render(el, colorView)}
                        </CellView>
                      );
                    })}
                  </View>
                ))}
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};
