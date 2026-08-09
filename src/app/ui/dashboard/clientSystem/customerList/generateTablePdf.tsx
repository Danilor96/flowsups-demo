import { Clients, ClientType, InterestedVehicle } from '@/app/libs/definitions';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { ListViewTypes } from '@/store/customerList/types';
import { daysOld } from '../customerLists/utils/utils';

// Static Stylesheet - ZERO runtime overhead for styles
const styles = StyleSheet.create({
  page: {
    paddingHorizontal: '1vw',
    paddingVertical: '1vh'
  },
  table: {
    border: '0.2vw solid #92CEC3',
    borderRadius: '0.520833vw',
    overflow: 'hidden'
  },
  body: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    color: '#FFF'
  },
  bold: {
    fontWeight: 'bold'
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row'
  },
  flexCol: {
    display: 'flex',
    flexDirection: 'column'
  },
  gap1: {
    gap: 4
  },
  statusBadge: {
    borderRadius: 16,
    fontSize: 10,
    display: 'flex',
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeColorBrand: {
    backgroundColor: '#C9EBE6',
    color: '#00A78B'
  },
  badgeColorBW: {
    backgroundColor: '#FFF',
    color: '#000',
    border: '1px solid #000'
  },
  cellBase: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    textAlign: 'center'
  },
  // Detail View Specifics
  detailCellContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    textAlign: 'left',
    flexDirection: 'row',
    paddingHorizontal: 10,
    gap: 8
  },
  detailCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    flex: 1
  }
});

const UserAssignedName = ({ userFullName, labelText }: { userFullName: string; labelText: string }) => (
  <Text>
    <Text style={styles.bold}>{labelText + ' '}</Text>
    {userFullName}
  </Text>
);

const MobilePhone = ({ phone }: { phone: string }) => {
  if (!phone) return <Text>N/A</Text>;
  const arr = phone.split('');
  return <Text>{`${arr.slice(0, 3).join('')}-${arr.slice(3, 6).join('')}-${arr.slice(6, 10).join('')}`}</Text>;
};

const DateFormat = ({ date }: { date: Date | null | undefined }) => {
  if (!date) return <Text>N/A</Text>;
  return <Text>{new Date(date).toLocaleString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}</Text>;
};

const VehicleFormat = ({ interestedVehicle }: { interestedVehicle: InterestedVehicle }) => {
  if (!interestedVehicle) return <Text>N/A</Text>;
  const year = interestedVehicle.vehicle_manufacture_years?.year;
  const brand = (interestedVehicle.vehicle_brands?.brand || '').toUpperCase();
  const model = interestedVehicle.vehicle_models?.model || '';
  const stockNo = interestedVehicle.stock_no;
  const lastSixStockNo = stockNo ? `[${stockNo.slice(-6)}]` : '';
  return <Text>{`${year} ${brand} ${model} ${lastSixStockNo}`}</Text>;
};

const CustomerStatus = ({ status, colorView = true }: { status: string | undefined | null; colorView?: boolean }) => {
  if (!status) return <Text>N/A</Text>;
  return (
    <Text style={[styles.statusBadge, colorView ? styles.badgeColorBrand : styles.badgeColorBW]}>
      {status}
    </Text>
  );
};

interface ColumnDefinition {
  [key: string]: {
    id: string;
    label: string;
    render: (el: ClientType, colorView?: boolean) => JSX.Element;
    style: any;
  };
}

const COLUMN_DEFINITIONS: ColumnDefinition = {
  customer_name: {
    id: 'customer_name',
    label: 'Customer Name',
    render: (el) => <Text style={styles.bold}>{`${el.first_name} ${el.last_name}`}</Text>,
    style: styles.cellBase
  },
  assigned_to: {
    id: 'assigned_to',
    label: 'Assigned To',
    render: (el) => (
      <View style={[styles.flexCol, styles.gap1]}>
        <UserAssignedName labelText="Sales Rep:" userFullName={`${el.seller?.name || 'N/A'} ${el.seller?.last_name || ''}`} />
        <UserAssignedName labelText="BDC Rep:" userFullName={`${el.bdc?.name || 'N/A'} ${el.bdc?.last_name || ''}`} />
        <UserAssignedName labelText="Manager:" userFullName={`${el.sales_manager?.name || 'N/A'} ${el.sales_manager?.last_name || ''}`} />
      </View>
    ),
    style: [styles.cellBase, { textAlign: 'left', paddingHorizontal: 4 }]
  },
  phone_number: {
    id: 'phone_number',
    label: 'Phone Number',
    render: (el) => <MobilePhone phone={el.mobile_phone || ''} />,
    style: [styles.cellBase, { justifyContent: 'center' }]
  },
  credit_app: {
    id: 'credit_app',
    label: 'Credit App',
    render: (el) => <Text>{el.credit_app_list_status_id ? 'Yes' : 'No'}</Text>,
    style: [styles.cellBase, { justifyContent: 'center' }]
  },
  source: {
    id: 'source',
    label: 'Source',
    render: (el) => <Text>{el.lead_source?.source}</Text>,
    style: [styles.cellBase, { justifyContent: 'center' }]
  },
  city: {
    id: 'city',
    label: 'City',
    render: (el) => <Text>{el.client_address?.city || ''}</Text>,
    style: [styles.cellBase, { justifyContent: 'center' }]
  },
  state: {
    id: 'state',
    label: 'State',
    render: (el) => <Text>{el.client_address?.state?.state || ''}</Text>,
    style: [styles.cellBase, { justifyContent: 'center' }]
  },
  status: {
    id: 'status',
    label: 'Status',
    render: (el, colorView) => <CustomerStatus status={el.client_status?.status} colorView={colorView} />,
    style: [styles.cellBase, { justifyContent: 'center', alignItems: 'center' }]
  },
  created_date: {
    id: 'created_date',
    label: 'Created Date',
    render: (el) => <DateFormat date={el.created_at} />,
    style: [styles.cellBase, { justifyContent: 'center' }]
  },
  created_by: {
    id: 'created_by',
    label: 'Created By',
    render: () => <Text>User Admin</Text>,
    style: [styles.cellBase, { justifyContent: 'center' }]
  },
  interested_vehicle: {
    id: 'interested_vehicle',
    label: 'Interested Vehicle',
    render: (el) => <VehicleFormat interestedVehicle={el.interested_vehicle} />,
    style: [styles.cellBase, { justifyContent: 'center' }]
  }
};

const DETAIL_COLUMN_DEFINITIONS: ColumnDefinition = {
  customer_name: {
    id: 'customer_name',
    label: 'Customer Name',
    render: (el) => (
      <>
        <View style={styles.detailCol}>
          <Text style={styles.bold}>{`${el.first_name} ${el.last_name}`}</Text>
          <Text>Cell: <MobilePhone phone={el.mobile_phone || ''} /></Text>
          <Text>Home: <MobilePhone phone={el.mobile_phone || ''} /></Text>
          <Text>{`Email: ${el.email || 'N/A'}`}</Text>
          <Text>DOB: <DateFormat date={el.born_date} /></Text>
        </View>
        <View style={styles.detailCol}>
          <Text>{`City: ${el.client_address?.city || 'N/A'}`}</Text>
          <Text>{`State: ${el.client_address?.state?.state || 'N/A'}`}</Text>
          <Text>{`Zip: ${el.client_address?.zip || 'N/A'}`}</Text>
          <Text>{`Income: ${el.other_income || 'N/A'}`}</Text>
          <Text>{`Cash Down: ${el.cash_down || 'N/A'}`}</Text>
        </View>
      </>
    ),
    style: [styles.detailCellContainer, { width: '130%' }]
  },
  lead_info: {
    id: 'lead_info',
    label: 'Lead Info',
    render: (el) => (
      <>
        <View style={styles.detailCol}>
          <Text>Status: {el.client_status?.status || 'N/A'}</Text>
          <Text>Credit App: {el.credit_app_list_status_id ? 'Yes' : 'No'}</Text>
          <Text>{`Email: ${el.email || 'N/A'}`}</Text>
          <UserAssignedName labelText="Sales Rep:" userFullName={`${el.seller?.name || 'N/A'} ${el.seller?.last_name || ''}`} />
          <UserAssignedName labelText="BDC Rep:" userFullName={`${el.bdc?.name || 'N/A'} ${el.bdc?.last_name || ''}`} />
        </View>
        <View style={styles.detailCol}>
          <UserAssignedName labelText="Manager:" userFullName={`${el.sales_manager?.name || 'N/A'} ${el.sales_manager?.last_name || ''}`} />
          <Text>{`Source: ${el.lead_source?.source || 'N/A'}`}</Text>
          <Text>{`Type: ${el.lead_type?.type || 'N/A'}`}</Text>
        </View>
      </>
    ),
    style: styles.detailCellContainer
  },
  date: {
    id: 'date',
    label: 'Date',
    render: (el) => (
      <View style={styles.detailCol}>
        <Text>Created: <DateFormat date={el.created_at} /></Text>
        <Text>Last Contact: <DateFormat date={el.last_activity} /></Text>
        <Text>Visit Day: <DateFormat date={el.last_activity} /></Text>
      </View>
    ),
    style: styles.detailCellContainer
  },
  interested_vehicle: {
    id: 'interested_vehicle',
    label: 'Interested Vehicle',
    render: (el) => (
      <>
        <View style={styles.detailCol}>
          <VehicleFormat interestedVehicle={el.interested_vehicle} />
          <Text>Price: {`$ ${el.interested_vehicle?.title_license?.asking_price || 'N/A'}`}</Text>
          <Text>
            {`${el.interested_vehicle?.vehicle_mileages?.mileage ? el.interested_vehicle.vehicle_mileages?.mileage + 'mil' : 'N/A'}`}
            {el.interested_vehicle?.entry_stock ? ' ! ' + daysOld(el.interested_vehicle?.entry_stock) : ''}
          </Text>
          <Text>{el.interested_vehicle?.vehicle_identification_numbers.vin.toUpperCase() || 'N/A'}</Text>
          <Text>{`Stock: ${el.interested_vehicle?.general_info?.stock_no || 'N/A'}`}</Text>
        </View>
        <View style={{ flex: 1 }}>
          {el.interested_vehicle?.vehicle_image?.path && (
            <Image src={el.interested_vehicle.vehicle_image.path} style={{ width: 60, height: 'auto' }} />
          )}
        </View>
      </>
    ),
    style: styles.detailCellContainer
  }
};

export const ClientPdfTable = ({
  clients,
  name,
  colorView = true,
  viewType = ListViewTypes.ListView,
  visibleColumnIds = []
}: { clients: Clients; name: string; colorView?: boolean; visibleColumnIds?: string[]; viewType: ListViewTypes; }) => {
  const MAX_ROWS = viewType === ListViewTypes.ListView ? 7 : 6;
  const pages = [];
  const data = clients || [];

  for (let i = 0; i < data.length; i += MAX_ROWS) {
    pages.push(data.slice(i, i + MAX_ROWS));
  }

  const defs = viewType === ListViewTypes.ListView ? COLUMN_DEFINITIONS : DETAIL_COLUMN_DEFINITIONS;
  const allCols = Object.keys(defs);
  const visibleCols = visibleColumnIds.length > 0 ? allCols.filter(c => visibleColumnIds.includes(c)) : allCols;

  return (
    <Document title={`${name}_${Date.now()}`}>
      {pages.map((pageData, pageIdx) => (
        <Page key={pageIdx} style={styles.page} orientation="landscape">
          <Image src="/flowsups.png" style={{ width: '20vw', height: '3vh', marginBottom: '4vh' }} />
          
          <View style={[styles.table, { border: colorView ? '0.2vw solid #92CEC3' : '1px solid #000' }]}>
            {/* Header */}
            <View style={{
              width: '100%', height: '3.5vh', flexDirection: 'row', alignItems: 'center',
              backgroundColor: colorView ? '#92CEC3' : '#FFF',
              color: colorView ? '#FFF' : '#000',
              fontSize: '1.4vh', fontWeight: 'bold',
              borderBottom: colorView ? 'none' : '1px solid #000'
            }}>
              {visibleCols.map((id, idx) => (
                <View key={idx} style={{ 
                  width: viewType === ListViewTypes.ListView ? '100%' : (idx === 0 ? '130%' : '100%'),
                  textAlign: viewType === ListViewTypes.ListView ? 'center' : 'left',
                  paddingLeft: viewType === ListViewTypes.ListView ? 0 : 10
                }}>
                  <Text>{defs[id]?.label || ''}</Text>
                </View>
              ))}
            </View>

            {/* Body */}
            <View style={[styles.body, { color: colorView ? '#FFF' : '#000' }]}>
              {pageData.map((el, idx) => (
                <View key={el.id} style={{
                  flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
                  backgroundColor: idx % 2 ? (colorView ? '#92CEC3' : '#FFF') : (colorView ? '#00A78B' : '#FFF'),
                  fontSize: '1.2vh',
                  borderBottom: colorView ? 'none' : '1px solid #000'
                }}>
                  {visibleCols.map((id) => (
                    <View key={el.id + id} style={defs[id]?.style}>
                      {defs[id]?.render(el, colorView)}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};
