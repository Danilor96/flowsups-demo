import { SpecificClient } from '@/app/libs/definitions';
import { adminDashboardStore, modalWindowStore } from '@/store/adminDashboard';
import { useEffect, useMemo, useState } from 'react';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { DateFormats } from '&/miscellaneous/dateFormats/DateFormats';
import { CustomerContactFormat } from '&/miscellaneous/customerContactFormat/CustomerContactFormat';
import { CustomerName } from '&/miscellaneous/customerName/CustomerName';
import { NoteButton } from '&/miscellaneous/notesWindow/noteButton/NoteButton';
import { VehicleFormat } from '@/app/ui/miscellaneous/vehicleFormat/VehicleFormat';
import { useFilters } from './Filter/useFilters';
import CustomerListFilter from './Filter';
import { ButtonContainer } from '@/app/ui/buttons/ButtonContainer';
import { daysOld, formatVehicle, updateDataEvent } from './utils/utils';
import { AnimatePresence } from 'framer-motion';
import { DepositEditor } from '../clientDetail/middleButtonsOptions/deposit/DepositEditor';
import { DepositData, DepositReceipt } from './DepositComponents/DepositReceipt';
import { PrinterIcon } from '@/app/ui/icons/Icons';
import { useSocketStore } from '@/store/socketIo';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { ExtraTitleButtonsReports } from '@/app/ui/miscellaneous/extraTitleButtonsReports/ExtraTitleButtonsReports';

const currencyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function DepositCustomers() {
  // ------- global states -------
  const { closeDepositCustomersList, openDeposit } = modalWindowStore();

  const { specificClientsData } = adminDashboardStore();
  const socket = useSocketStore((store) => store.socket);

  const {
    getSpecificClients,
    getSpecificClientsNotes,
    clearSpecificClientsData,
    clearSpecificClientsNotes,
    setNoteFromIdSelected,
    setNoteCustomerStatusIdSelected,
  } = adminDashboardStore();

  useEffect(() => {
    getSpecificClientsNotes('9');
    setNoteFromIdSelected(5);
    setNoteCustomerStatusIdSelected(9);
  }, [getSpecificClientsNotes, setNoteFromIdSelected, setNoteCustomerStatusIdSelected]);

  useEffect(() => {
    if (socket) {
      socket.on('update_data', (dataToUpdate: string, extraData: any) => {
        if (dataToUpdate === updateDataEvent.depositCustomersList) {
          // setLoading(true);
          getSpecificClients('9').finally(() => {
            setLoading(false);
          });
          getSpecificClientsNotes('9');
        }
      });
    }
  }, [socket, getSpecificClients, getSpecificClientsNotes]);

  // ------- local states -------
  const [doFetch, setDoFetch] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { filters, filterCustomer, updateFilter, clearFilters } = useFilters();
  const [showDepositEditor, setShowDepositEditor] = useState<boolean>(false);
  const [depositId, setDepositId] = useState<number | null>(null);
  const [receiptToPrint, setReceiptToPrint] = useState<DepositData | null>(null);
  const [depositLoading, setDepositLoading] = useState<boolean>(false);
  const [showFilter, setShowFilter] = useState<boolean>(true);

  const handleCloseWindow = () => {
    setNoteFromIdSelected(null);
    clearSpecificClientsData();
    clearSpecificClientsNotes();
    closeDepositCustomersList();
  };

  const companyInfo = {
    name: 'Flowsups',
    // address: '123 Calle Principal, Ciudad Auto, 12345',
    // phone: '(555) 123-4567',
    // logoUrl: 'https://placehold.co/150x60/00A78B/FFFFFF?text=AutoVentas'
  };

  const handlePrint = async (depositId: number) => {
    try {
      setDepositLoading(true);
      const response = await fetch(`/api/adminDashboard/deposit/${depositId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const { data: deposit } = await response.json();
      if (!deposit) return;

      setReceiptToPrint({
        amount: Number(deposit.amount),
        customerName: `${deposit.client?.first_name} ${deposit.client?.last_name}`,
        depositDate: new Date(deposit.deposit_date),
        goodThroughDate: new Date(deposit.good_through_date),
        isNonRefundable: deposit.non_refundable,
        id: deposit.id,
        method: deposit.method.method,
        processingFee: deposit.pro_fee ? Number(deposit.pro_fee) : 0,
        receiptNumber: deposit.id,
        salesRep: '',
        total: Number(deposit.total),
        vehicleName: deposit.vehicle
          ? `${deposit.vehicle.vehicle_brands?.brand || ''} ${
              deposit.vehicle.vehicle_models?.model || ''
            } [${deposit.vehicle.vehicle_identification_numbers?.vin?.slice(-6) || ''}]`
          : '',
        reference: deposit.reference ? deposit.reference : '',
      });

      setDepositLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos del depósito:', error);
    }
  };

  useEffect(() => {
    if (receiptToPrint) {
      window.print();
    }
  }, [receiptToPrint]);

  // ------- computed values -------
  const filteredClients = useMemo(
    () => filterCustomer(specificClientsData),
    [specificClientsData, doFetch],
  );

  const initialColumnsDef = {
    customer_name: true,
    phone_number: true,
    assigned_to: true,
    deposit_date: true,
    last_contacted_day: true,
    days_old: true,
    days_in: true,
    interested_vehicle: true,
    deposit_amount: true,
    deposit_reference: true,
    refundable: true,
    note: true,
    _blank_button: true,
  };

  const columnRenderers: { [key in keyof typeof initialColumnsDef]: (el: SpecificClient) => any } = {
    customer_name: el => <CustomerName customer={`${el.first_name} ${el.last_name}`} customerId={el.id} />,
    phone_number: el => (
      <CustomerContactFormat contact={el.mobile_phone} color="#FFF" customerId={el.id} noIcon marginInlineAuto />
    ),
    assigned_to: el => `${el.seller?.id ? `${el.seller.name} ${el.seller.last_name}` : 'No Assignations'}`,
    deposit_date: el =>
      el.deposit_client && el.deposit_client.length > 0 ? (
        <DateFormats date={el.deposit_client[el.deposit_client.length - 1].deposit_date} format={2} />
      ) : (
        'N/A'
      ),
    last_contacted_day: el => el.last_activity && <DateFormats date={el.last_activity} format={5} />,
    days_old: el => el.created_at && daysOld(el.created_at),
    days_in: el =>
      el.client_status_changed_at ? (
        <>
          <DateFormats date={el.client_status_changed_at} format={2} /> {` (${daysOld(el.client_status_changed_at)})`}
        </>
      ) : (
        'N/A'
      ),
    interested_vehicle: el =>
      el.deposit_client && el.deposit_client.length > 0 ? (
        <VehicleFormat interestedVehicle={el.deposit_client[el.deposit_client.length - 1].vehicle} />
      ) : '',
    deposit_amount: el =>
      el.deposit_client && el.deposit_client.length > 0
        ? currencyFormat.format(Number(el.deposit_client[el.deposit_client.length - 1].amount) || 0)
        : 'N/A',
    deposit_reference: el =>
      el.deposit_client && el.deposit_client.length > 0
        ? el.deposit_client[el.deposit_client.length - 1].reference
        : 'N/A',
    refundable: el =>
      el.deposit_client && el.deposit_client.length > 0
        ? el.deposit_client[el.deposit_client.length - 1].non_refundable
          ? 'No'
          : 'Yes'
        : 'Yes',
    note: el => el.id && <NoteButton customerId={el.id} fromId={5} />,
    _blank_button: el =>
      el.id && (
        <div className="w-full flex items-center justify-center">
          <button
            onClick={e => {
              e.stopPropagation();
              handlePrint(el.deposit_client[el.deposit_client.length - 1].id);
            }}
            className="hover:scale-110 bg-[#00A78B]/ self-center w-fit font-semibold flex items-center justify-center gap-1 border-[0.052083vw]
               border-white rounded-[1.041667vw] px-[0.5vw] py-[0.8vh] text-[1.666667vh] text-white"
            disabled={depositLoading}
          >
            Print
            {depositLoading ? (
              <svg
                className="size-4 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <PrinterIcon />
            )}
          </button>
        </div>
      ),
  };

  const { columns } = useDynamicTableColumns<SpecificClient, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    columnStyles: {
      customer_name: { size: 180 },
      phone_number: { size: 170 },
      days_old: { size: 110 },
      days_in: { size: 110 },
      refundable: { size: 130 },
      deposit_date: { size: 140 },
      deposit_reference: { size: 180 },
      last_contacted_day: { size: 200 },
      note: { size: 130 },
      interested_vehicle: { size: 170 },
    },
    hideHeaderFor: ['_blank_button'],
    columnRenderers,
    accessorFnMapper: {
      customer_name: el => `${el.first_name || ''} ${el.last_name || ''}`,
      phone_number: el => el.mobile_phone,
      assigned_to: el => `${el.seller?.id ? `${el.seller.name} ${el.seller.last_name}` : ''}`,
      deposit_date: el =>
        el.deposit_client && el.deposit_client.length > 0
          ? el.deposit_client[el.deposit_client.length - 1].deposit_date
          : '',
      last_contacted_day: el => el.last_activity,
      days_old: el => el.created_at && daysOld(el.created_at),
      days_in: el => el.client_status_changed_at,
      interested_vehicle: el =>
        el.deposit_client && el.deposit_client.length > 0
          ? formatVehicle(el.deposit_client[el.deposit_client.length - 1].vehicle)
          : '',
      deposit_amount: el =>
        el.deposit_client && el.deposit_client.length > 0
          ? currencyFormat.format(Number(el.deposit_client[el.deposit_client.length - 1].amount) || 0)
          : '',
      deposit_reference: el =>
        el.deposit_client && el.deposit_client.length > 0
          ? el.deposit_client[el.deposit_client.length - 1].reference
          : '',
      refundable: el =>
        el.deposit_client && el.deposit_client.length > 0
          ? el.deposit_client[el.deposit_client.length - 1].non_refundable
            ? 'No'
            : 'Yes'
          : 'Yes',
    },
    disabledSortColumns: ['_blank_button', 'note'],
    filterableColumns: [
      'customer_name',
      'phone_number',
      'interested_vehicle',
      'last_contacted_day',
      'days_old',
      'days_in',
      'deposit_date',
      'deposit_amount',
      'deposit_reference',
      'refundable',
    ],
  });

  return (
    <>
      <ModalWindow top={-13.8}>
        <ModalContainer width={96.822917} marginTop={4}>
          <ModalContainerTitle
            title="Deposit"
            closeWindowFunction={handleCloseWindow}
            openNewTab
            extraTitleComponent={
              <ExtraTitleButtonsReports
                isFilterVisible={showFilter}
                filterableFields={[]}
                filterToggle={() => setShowFilter(!showFilter)}
                reloadData={async () => setDoFetch(!doFetch)}
                options={{ moreOptionsIsVisible: false }}
              />
            }
          />
          <ModalContent>
            {showFilter && (
              <CustomerListFilter
                filters={filters}
                updateFilter={updateFilter}
                clearFilters={clearFilters}
                setLoading={setLoading}
                setDoFetch={setDoFetch}
                doDataFetch={doFetch}
                specificCustomerStatusId={9}
                visibleFiltersOptions={{
                  interestedVehicle: true,
                  lastActivity: true,
                  daysIn: true,
                  depositDate: true,
                  depositAmount: true,
                }}
              />
            )}
            <ButtonContainer marginTop={1.5} block widthFull>
              <ColoredTableV2
                data={filteredClients}
                columns={columns}
                initialColumnsDef={initialColumnsDef}
                itemsPerPage={6}
                loading={loading}
                paginationIsActive
                textColor="#FFF"
                height={showFilter ? 54 : 65}
                rowSelectionIsActive={false}
                onRowClick={(orinalRow) => {
                  const rowId = orinalRow.id;
                  const customer = filteredClients.find((el) => el.id === rowId);
                  if (customer && customer.deposit_client && customer.deposit_client.length > 0) {
                    setDepositId(customer.deposit_client[customer.deposit_client.length - 1].id);
                    setShowDepositEditor(true);
                  }
                }}
              />
            </ButtonContainer>
          </ModalContent>
        </ModalContainer>
      </ModalWindow>
      <AnimatePresence>
        {showDepositEditor && depositId && (
          <DepositEditor
            depositId={depositId}
            openClose={() => setShowDepositEditor(!showDepositEditor)}
          />
        )}
      </AnimatePresence>
      {/* El área donde el recibo a imprimir se renderiza temporalmente */}
      {/* clases 'print:block' y 'hidden' para que solo sea visible durante la impresión */}
      <div className="hidden print:block">
        {receiptToPrint && (
          <DepositReceipt
            deposit={receiptToPrint}
            companyInfo={companyInfo}
            onAfterPrint={() => setReceiptToPrint(null)}
          />
        )}
      </div>
    </>
  );
}
