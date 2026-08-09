import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { CustomerStatusIndicator } from '&/miscellaneous/customerStatusIndicator/CustomerStatusIndicator';
import {
  clientMessagesStore,
  modalWindowStore,
  singleCLientDataStore,
} from '@/store/adminDashboard';
import { CustomerTemperatureIndicator } from '&/miscellaneous/customerTemperatureIndicator/CustomerTemperatureIndicator';
import { useEffect, useState } from 'react';
import { SmsChat } from '&/dashboard/clientSystem/clientDetail/smsModal/smsChat/SmsChat';
import { Loader } from '&/miscellaneous/loader/Loader';
import { SmsInput } from '&/dashboard/clientSystem/clientDetail/smsModal/smsInput/SmsInput';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { useSession } from 'next-auth/react';
import { leadsStore } from '@/store/leads';
import { CustomersStatuses, FundingStatuses } from '@/app/libs/customer/customersFunctions';

export function SmsModal() {
  // ----- global states -----
  const { data: session } = useSession();

  const userId = session?.user.id;

  const { dashboardSmsModal, clientDetail } = modalWindowStore();
  const { closeSmsModal, closeDashboardSmsModal } = modalWindowStore();

  const { singleCLientData } = singleCLientDataStore();
  const { clearSingleClientData } = singleCLientDataStore();

  const { clientMessages } = clientMessagesStore();

  const { formatPhoneNumber } = phoneNumbersFormatStore();

  const { leads } = leadsStore();

  const {
    getClientMessages,
    clearWaitingSendCurrentMessage,
    clearClientMessages,
    setMessagesStatusToRead,
    getAllClientsMessages,
  } = clientMessagesStore();

  useEffect(() => {
    if (singleCLientData && singleCLientData?.mobile_phone && userId) {
      getClientMessages(singleCLientData.id).finally(() => {
        setLoader(false);
      });
      setMessagesStatusToRead(singleCLientData.id, userId).finally(() => {
        getAllClientsMessages();
      });
    }
  }, [getClientMessages, setMessagesStatusToRead, getAllClientsMessages, singleCLientData, userId]);

  useEffect(() => {
    if (
      clientMessages &&
      clientMessages.length > 0 &&
      !singleCLientData &&
      userId &&
      clientMessages[0]?.unregistered_customer[0]?.id
    ) {
      setLoader(false);
      setMessagesStatusToRead(clientMessages[0]?.unregistered_customer[0]?.id, userId);
      getAllClientsMessages();
    }
  }, [clientMessages, singleCLientData, userId, getAllClientsMessages, setMessagesStatusToRead]);

  const [loader, setLoader] = useState<boolean>(true);

  const unregisteredCustomerMobilePhoneNumber = () => {
    if (clientMessages && clientMessages.length > 0) {
      return clientMessages[0]?.unregistered_customer[0]?.mobile_phone_number;
    }
  };

  const getStatusName = () => {
    const lead = singleCLientData?.lead && singleCLientData?.lead.length > 0 ? singleCLientData?.lead[0] : null;

    if (lead) {
      const customerIsFundedStatus =
        lead.customer_status_id === CustomersStatuses.Sold &&
        lead.customer_funding_list_status_id === FundingStatuses.Funded;

      if (customerIsFundedStatus) return 'Funded';

      const customerIsReturnedStatus =
        lead.customer_status_id === CustomersStatuses.Sold &&
        lead.customer_funding_list_status_id === FundingStatuses.Returned;

      if (customerIsReturnedStatus) return 'Returned';
    }

    return leads && leads.length > 0
      ? leads.find(el => el.is_selected === true)?.customer_status?.status
      : singleCLientData
        ? singleCLientData?.client_status?.status
        : 'Loading';
  };
  return (
    <ModalWindow top={0} minSizeFull={dashboardSmsModal ? false : true} positionFixed>
      <ModalContainer width={47.520833} marginTop={5}>
        <ModalContainerTitle
          title={`${
            singleCLientData?.first_name ||
            formatPhoneNumber(unregisteredCustomerMobilePhoneNumber() || '') ||
            'Loading...'
          } ${singleCLientData?.last_name || ''}`}
          extraTitleComponent={
            <section className="flex flex-row justify-center items-center gap-[1vw]">
              <CustomerStatusIndicator status={getStatusName()} />
              <CustomerTemperatureIndicator
                temperatureId={singleCLientData?.client_lead_temperature?.id}
              />
            </section>
          }
          closeWindowFunction={() => {
            clearClientMessages();
            clearWaitingSendCurrentMessage();
            if (!clientDetail) clearSingleClientData();
            closeSmsModal();
            if (dashboardSmsModal) {
              closeDashboardSmsModal();
            }
          }}
        />
        <ModalContent paddingRight={0.5} height={70} flexbox flexCol>
          {loader && <Loader zIndex={200} />}
          <SmsChat />
          <SmsInput />
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
