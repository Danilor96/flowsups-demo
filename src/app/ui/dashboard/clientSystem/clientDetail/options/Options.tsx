import { DropdownContent } from '&/modalWindowsStructure/dropdownContent/DropdownContent';
import { ConfirmNotification } from '&/notifications/Notification';
import {
  adminDashboardStore,
  messagesStore,
  modalWindowStore,
  singleCLientDataStore,
} from '@/store/adminDashboard';
import { useSocketStore } from '@/store/socketIo';
import { useCallback, useEffect, useState } from 'react';
import { StatusesList } from './statusesList/StatusesList';
import { EndVisitVehiclePicker } from '../../../endVisit/endVisitVehiclePicker/EndVisitVehiclePicker';
import { AddOtherVehicleModal } from '../../../reports/salesLog/salesLogStatistics/salesScore/addOther/AddVehicleModal';
import { Button } from '&/buttons/Button';
import UserAssignmentSelect from '@/app/ui/select/UserAssignmentSelector/UserAssignmentSelector';
import { User } from '@/app/libs/definitions';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { HorizontalLine } from '&/miscellaneous/separators/HorizontalLine';
import { OptionsButtons } from './optionsButtons/OptionsButtons';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { TextAreaInput } from '&/inputs/TextAreaInput';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { FieldErrorMessage } from '@/app/ui/miscellaneous/fieldErrorMessage/FieldErrorMessage';
import { useCan } from '@/hooks/permissions';
import { Input } from '@/app/ui/inputs/Input';
import inputTypeDateFormatStore from '@/store/inputTypeDateFormat';
import { CUSTOMER_STATUSES_LIST, CustomersStatuses } from '@/app/libs/customer/customersFunctions';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { SoldStatusContent, SoldDataPayload, appendSoldDataToForm } from './SoldStatusContent';
import { leadsStore } from '@/store/leads';
import { GenericSelector } from '@/app/ui/select/GenericSelector/GenericSelector';
import { CustomersForInfiniteScroll } from '@/app/api/customerSelect/types';
import { getCustomersForInfiniteScroll } from '@/app/libs/services/customers/customer.services';

export function Options() {
  // ----- global states -----

  const { singleCLientData } = singleCLientDataStore();
  const { getSingleClientData } = singleCLientDataStore();
  const { leads, currentLead } = leadsStore();

  const { setMessages } = messagesStore();

  const { updateDataWithSocket } = useSocketStore();

  const { openClientCreditApp, openAppointmentCustomersList, openDeposit } = modalWindowStore();

  const { clientStatusesData, lostReasons, sellersData } = adminDashboardStore();

  const { can } = useCan();

  const { formatIncomingObjectDate } = inputTypeDateFormatStore();
  const { formatPhoneNumber, extractDigits } = phoneNumbersFormatStore();

  // ----- local states -----

  const [soldData, setSoldData] = useState<SoldDataPayload | null>(null);

  const [confirmSetStatusMessage, setConfirmSetStatusMessage] = useState('');
  const [confirmationLostStatusMessage, setConfirmationLostStatusMessage] = useState('');
  const [statusId, setStatusId] = useState('');
  const [note, setNote] = useState('');
  const [lostReason, setLostReason] = useState('');
  const [lostReasonDescription, setLostReasonDescription] = useState('');
  const [fieldErrorNameSoldStatus, setFieldErrorNameSoldStatus] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [showInfoSold, setShowInfoSold] = useState(false);
  const [selectedDeliveryVehicle, setSelectedDeliveryVehicle] = useState<{
    id: string | number;
  } | null>(null);
  const [showAddDeliveryVehicleModal, setShowAddDeliveryVehicleModal] = useState(false);
  const [selectedDeliverySellerIds, setSelectedDeliverySellerIds] = useState<string[]>([]);

  useEffect(() => {
    if (singleCLientData?.interested_vehicle) {
      setSelectedDeliveryVehicle({ id: singleCLientData.interested_vehicle.id });
    } else {
      setSelectedDeliveryVehicle(null);
    }
    if (singleCLientData?.seller) {
      setSelectedDeliverySellerIds([singleCLientData.seller.id.toString()]);
    } else {
      setSelectedDeliverySellerIds([]);
    }
  }, [singleCLientData]);


  const handleOpenCreditappWindow = () => {
    if (singleCLientData?.consent_approved) {
      if (singleCLientData.mobile_phone && singleCLientData.email) {
        openClientCreditApp();
      } else {
        setMessages('This customer must have both a mobile phone number and email established');
      }
    } else {
      setMessages('This customer has not given consent yet');
    }
  };

  const { fieldErrors, loadingFetch, makeAsyncFetch, setManualFieldErrors } = useAsyncFetching();

  const handleSetCustomerStatus = (e: React.MouseEvent<HTMLButtonElement>) => {
    const status = e.currentTarget.value ? Number(e.currentTarget.value) : null;

    if (can([79, 81, 82]) && CUSTOMER_STATUSES_LIST && CUSTOMER_STATUSES_LIST.length > 0) {
      if (can(79) && status === CustomersStatuses.Appointment) {
        openAppointmentCustomersList();
        return;
      }

      const activeLeadStatus =
        (leads &&
          leads.length > 0 &&
          leads.find((el) => el.id.toString() === currentLead)?.customer_status?.id) ||
        undefined;

      if (can(79) && status === CustomersStatuses.Funded) {
        const isCurrentStatusSold = activeLeadStatus
          ? activeLeadStatus === CustomersStatuses.Sold
          : false;

        if (!isCurrentStatusSold) {
          setMessages('The customer must currently have the status of Sold');

          return;
        }
      }

      const { value } = e.currentTarget;

      value && setStatusId(value);

      const statusFrom = clientStatusesData?.find((el) => el.id === activeLeadStatus)?.status;

      const statusTo = clientStatusesData?.find((el) => value && el.id === parseInt(value))?.status;
      const confirmationMessage = `Are you sure you want to change the status from ${statusFrom?.toUpperCase()} to ${statusTo?.toUpperCase()}?`;
      if (can([79, 81]) && status === CustomersStatuses.Lost) {
        setConfirmationLostStatusMessage(confirmationMessage);
        return;
      }

      if (can([79, 82]) && status === CustomersStatuses.Sold) {
        setFieldErrorNameSoldStatus('customerStatus');
      }

      if (can([79, 82])) setConfirmSetStatusMessage(confirmationMessage);
    }
  };

  const handleDecision = async (decision: boolean) => {
    if (decision) {
      if (parseInt(statusId) === CustomersStatuses.Deposit) {
        openDeposit();

        setFieldErrorNameSoldStatus('');
        setStatusId('');
        setConfirmSetStatusMessage('');
        setConfirmationLostStatusMessage('');

        return;
      }

      const deliveryAssigned =
        selectedDeliverySellerIds.length > 0 || singleCLientData?.sales_manager;
      const deliveryVehicleId =
        selectedDeliveryVehicle?.id || singleCLientData?.interested_vehicle?.id;

      if (
        statusId === CustomersStatuses.Delivery.toString() &&
        (!deliveryDate || !deliveryAssigned || !deliveryVehicleId)
      ) {
        setFieldErrorNameSoldStatus('delivery');

        const errMssg = !deliveryDate
          ? 'Date require'
          : !deliveryAssigned
            ? 'User assigned require'
            : 'Vehicle require';

        setManualFieldErrors({
          delivery: [errMssg],
        });

        return;
      }

      const formData = new FormData();

      statusId && formData.append('statusSelected', statusId);
      if (lostReason && statusId === CustomersStatuses.Lost.toString()) {
        formData.append('note', note);
        formData.append('lostReason', lostReason);
        formData.append('lostReasonDescription', lostReasonDescription);
        formData.append('leadId', currentLead);
      }

      if (deliveryDate) formData.append('deliveryDate', deliveryDate);

      if (Number(statusId) === CustomersStatuses.Delivery) {
        if (deliveryVehicleId) formData.append('vehicleId', deliveryVehicleId.toString());
        if (selectedDeliverySellerIds.length > 0)
          formData.append('sellerIds', selectedDeliverySellerIds.join(','));
      }

      if (Number(statusId) === CustomersStatuses.Sold) {
        appendSoldDataToForm(formData, soldData);
      }

      let apiUrl = ``;

      if (Number(statusId) === CustomersStatuses.Lost) {
        apiUrl = `/api/adminDashboard/setCustomerStatus/markAsLost/${singleCLientData?.id}${currentLead ? `?leadId=${currentLead}` : ''}`;
      } else {
        apiUrl = `/api/adminDashboard/setCustomerStatus/${singleCLientData?.id}${currentLead ? `?leadId=${currentLead}` : ''}`;
      }

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'PUT',
        options: {
          onSuccess: () => {
            singleCLientData?.id && getSingleClientData(singleCLientData.id.toString());

            updateDataWithSocket('customersList');

            if (parseInt(statusId) === 10) {
              updateDataWithSocket('dailyTotals');
            }

            setStatusId('');

            setConfirmSetStatusMessage('');
            setConfirmationLostStatusMessage('');
          },
        },
      });
    } else {
      setFieldErrorNameSoldStatus('');
      setStatusId('');
      setConfirmSetStatusMessage('');
      setConfirmationLostStatusMessage('');
      setSoldData(null);
      setDeliveryDate('');
      if (singleCLientData?.interested_vehicle) {
        setSelectedDeliveryVehicle({ id: singleCLientData.interested_vehicle.id });
      } else {
        setSelectedDeliveryVehicle(null);
      }
      if (singleCLientData?.seller) {
        setSelectedDeliverySellerIds([singleCLientData.seller.id.toString()]);
      } else {
        setSelectedDeliverySellerIds([]);
      }
    }
  };

  const salesRepName = `${singleCLientData?.seller?.name || ''} ${
    singleCLientData?.seller?.last_name || ''
  }`;
  const customerName = `${singleCLientData?.first_name || ''} ${singleCLientData?.last_name || ''}`;
  const street = singleCLientData?.client_address?.street || '';
  const city = singleCLientData?.client_address?.city || '';
  const state = singleCLientData?.client_address?.state?.state || '';
  const zip = singleCLientData?.client_address?.zip || '';
  const customerAddress = `${street}, ${city}, ${state}${zip ? `, ${zip}` : ''}`;

  return (
    <DropdownContent title="Options">
      <ConfirmNotification
        notiMessage={confirmSetStatusMessage}
        loading={loadingFetch}
        onDecision={handleDecision}
        childrenBottom={statusId !== '4' && statusId !== '10'}
        overflowVisible={loadingFetch ? false : statusId === '4'}
      >
        {statusId === CustomersStatuses.Delivery.toString() && (
          <section className="relative w-full px-[1vw] flex justify-center">
            <div className="flex flex-col justify-center items-center gap-3 w-[90%]">
              <div className="w-full text-left">
                <Paragraph color="#41B4A0" fontSize={2} marginTop={2} fontWeight={600}>
                  Is this the correct vehicle they are interested in?
                </Paragraph>
              </div>
              <div className="flex w-full items-center gap-4 mt-2 max-lg:flex-col max-lg:items-stretch">
                <div className="w-full">
                  <EndVisitVehiclePicker
                    vehicleId={selectedDeliveryVehicle?.id?.toString()}
                    onClick={(e) => setSelectedDeliveryVehicle({ id: e })}
                  />
                </div>
                {selectedDeliveryVehicle ? (
                  <Button
                    backgroundColor="#FF5555"
                    identity="remove-delivery-vehicle"
                    textColor="#FFF"
                    buttonText="Remove"
                    onClick={() => setSelectedDeliveryVehicle(null)}
                    height={3}
                    width={5}
                  />
                ) : (
                  <Button
                    backgroundColor="#00A78B"
                    identity="add-delivery-vehicle"
                    textColor="#FFF"
                    buttonText="Add Vehicle"
                    onClick={() => setShowAddDeliveryVehicleModal(true)}
                    width={9}
                  />
                )}
              </div>
              <HorizontalLine marginTop={1.5} marginBottom={1.5} />
              <div className=" w-full flex flex-row justify-between items-center gap-3 max-lg:flex-col max-lg:items-stretch">
                <Paragraph color="#41B4A0" fontSize={1.8}>
                  <b>Delivery Date</b>
                </Paragraph>
                <div className="w-[20vw] max-lg:w-full">
                  <Input
                    label=""
                    name="deliveryStartDate"
                    maxDateAge
                    onChange={(e) => {}}
                    type="DottedDate"
                    selectBtnWidth={15}
                    dayPickerDisabledbefore={new Date()}
                    disabled
                    onDayPickerClick={(e) => {
                      setDeliveryDate(formatIncomingObjectDate(e));
                    }}
                    noDisabledBgColor
                    value={deliveryDate}
                    width={0}
                    widthFull
                    dayPickerLeft="102%"
                    dayPickerTop="0"
                  />
                </div>
              </div>
              <div className=" w-full flex flex-row justify-between items-center gap-3 mb-4 max-lg:flex-col max-lg:items-stretch">
                <Paragraph color="#41B4A0" fontSize={1.8}>
                  <b>Seller Asigned</b>
                </Paragraph>
                <div className="w-[20vw] max-lg:w-full">
                  <UserAssignmentSelect
                    users={(sellersData as unknown as User[]) || []}
                    defaultValue={selectedDeliverySellerIds}
                    onChange={(ids) => {
                      setSelectedDeliverySellerIds(ids);
                    }}
                    isMultiSelect={false}
                    bgColor="#FFF"
                    enableFloating
                  />
                </div>
              </div>
            </div>
          </section>
        )}
        {statusId === CustomersStatuses.Sold.toString() && singleCLientData && (
          <SoldStatusContent
            singleCLientData={singleCLientData}
            onChange={(data) => setSoldData(data)}
          />
        )}
        <FieldErrorMessage
          fieldErrors={fieldErrors}
          fontSize={2}
          positionStatic
          textCenter
          name={fieldErrorNameSoldStatus}
        />
      </ConfirmNotification>
      <ConfirmNotification
        notiMessage={confirmationLostStatusMessage}
        loading={loadingFetch}
        onDecision={handleDecision}
      >
        <GenericSelector
          label="Lost Reason"
          options={lostReasons || []}
          selectedIds={lostReason ? [lostReason] : []}
          onChange={(ids) => {
            const id = ids[0] || '';
            const selectedReason = lostReasons?.find((r) => r.id.toString() === id);
            setLostReason(id);
            setLostReasonDescription(selectedReason?.reason || '');
          }}
          getOptionId={(reason) => reason.id.toString()}
          getOptionLabel={(reason) => reason.reason}
          isMultiSelect={false}
          width="w-full"
          enableFloating={true}
          capitalWords
        />
        <TextAreaInput
          label=""
          name="note"
          value={note}
          width={0}
          height={8.425926}
          onChange={(e) => setNote(e.target.value)}
          widthFull
          fieldErrors={fieldErrors}
          placeholder=""
        />
      </ConfirmNotification>
      <ContentRow cols={2} gap={0} widthFull justifyContent="space-around" alignItems="center">
        <OptionsButtons handleOpenCreditApp={handleOpenCreditappWindow} />
        <StatusesList onClick={handleSetCustomerStatus} />
      </ContentRow>
      {showAddDeliveryVehicleModal && (
        <AddOtherVehicleModal
          onClose={() => setShowAddDeliveryVehicleModal(false)}
          onSave={(vehicle) => {
            setSelectedDeliveryVehicle({ id: vehicle.id });
            setShowAddDeliveryVehicleModal(false);
          }}
        />
      )}
    </DropdownContent>
  );
}
