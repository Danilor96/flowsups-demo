import {
  adminDashboardStore,
  clientMessagesStore,
  creditAppInputsStore,
  deleteClientStore,
  messagesStore,
  modalWindowStore,
  newProspectStore,
  singleCLientDataStore,
} from '@/store/adminDashboard';
import React, { useEffect, useRef, useState } from 'react';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { CustomerStatusIndicator } from '&/miscellaneous/customerStatusIndicator/CustomerStatusIndicator';
import { CustomerTemperatureIndicator } from '&/miscellaneous/customerTemperatureIndicator/CustomerTemperatureIndicator';
import { useSocketStore } from '@/store/socketIo';
import { useTwilioStore } from '@/store/phoneDevice';
import { creditAppStore } from '@/store/creditApp';
import { Contact } from './contact/Contact';
import { Calls } from './calls/Calls';
import { GeneralInfo } from './generalInfo/GeneralInfo';
import { MiddleButtonsOptions } from './middleButtonsOptions/MiddleButtonsOptions';
import { Options } from './options/Options';
import { LeadHistory } from './leadHistory/LeadHistory';
import { BottomButtons } from './bottomButtons/BottomButtons';
import { leadsStore } from '@/store/leads';
import { CustomerLeadIndicator } from '&/miscellaneous/customerLeadIndicator/CustomerLeadIndicator';
import { useRouter } from 'next/navigation';
import { CustomersStatuses, FundingStatuses } from '@/app/libs/customer/customersFunctions';
import { DropdownContent } from '@/app/ui/modalWindowsStructure/dropdownContent/DropdownContent';

export function CustomerDetail({
  fullScreen = false,
  newTab = false,
}: {
  fullScreen?: boolean;
  newTab?: boolean;
}) {
  // ----- global states -----
  const router = useRouter();

  const { call, callInProgress } = useTwilioStore();

  const { updateDataWithSocket } = useSocketStore();

  const { messages } = messagesStore();

  const { taskDetail, clientDetailTasks, loadingCustomerDetail, setUpADeal } = modalWindowStore();
  const {
    closeClientDetail,
    openSetUpADeal,
    openCloseClientDetailTasks,
    closeSetUpADeal,
    setLoadingCustomerDetail,
  } = modalWindowStore();

  const { currentNewProspect } = newProspectStore();

  const { getClients } = adminDashboardStore();

  const { getCreditAppStart } = creditAppStore();

  const { singleCLientData } = singleCLientDataStore();
  const { getSingleClientData } = singleCLientDataStore();

  const email = useRef(currentNewProspect.email || '');

  const { clientMessages } = clientMessagesStore();

  const { deleteResponse } = deleteClientStore();

  const { clearDeleteResponse } = deleteClientStore();

  const { clearCreditAppInputs } = creditAppInputsStore();

  const { leads, currentLead, setCurrentLead } = leadsStore();
  const { getLeads } = leadsStore();

  // ----- local states -----

  useEffect(() => {
    if (singleCLientData && singleCLientData.id) {
      const handleLoading = async () => {
        await getLeads(singleCLientData.id);

        setLoadingCustomerDetail(false);
      };

      handleLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleCLientData]);

  const [clearStates, setClearStates] = useState(false);

  useEffect(() => {
    if (deleteResponse) {
      clearDeleteResponse();
      closeClientDetail();
      updateDataWithSocket('customersList');
    }
  }, [deleteResponse, getClients, closeClientDetail, clearDeleteResponse, updateDataWithSocket]);

  const handleCloseWindow = () => {
    setLoadingCustomerDetail(true);

    getLeads(null);
    setCurrentLead(null);

    if (!taskDetail || !call || !callInProgress) getSingleClientData('clear');
    clearCreditAppInputs();
    clearCreditAppInputs();
    getCreditAppStart(null);
    setTimeout(() => {
      setClearStates(true);
    }, 1);

    if (clientDetailTasks) {
      openCloseClientDetailTasks(false);
    }

    closeSetUpADeal();

    // if (fullScreen) window.close();
    if (newTab) {
      router.replace('/dashboard', { scroll: false });
      return;
    }
  };

  useEffect(() => {
    if (clearStates) {
      setTimeout(() => {
        closeClientDetail();
      }, 1);
      return;
    }
  }, [clearStates, clientMessages, closeClientDetail]);

  const [confirmSetADealMessage, setConfirmSetADealMessage] = useState('');

  useEffect(() => {
    if (singleCLientData) {
      if (
        singleCLientData.client_status?.id === 10 &&
        !setUpADeal &&
        (!singleCLientData.deal || singleCLientData.deal.length < 1)
      ) {
        setConfirmSetADealMessage('Do you want to make a deal with this customer?');
      }
    }
  }, [singleCLientData]);

  const handleDecision = async (decision: boolean) => {
    if (decision) {
      if (confirmSetADealMessage) {
        openSetUpADeal();
        setConfirmSetADealMessage('');
      }
    } else {
      setConfirmSetADealMessage('');
    }
  };

  const getStatusName = () => {
    const lead =
      singleCLientData?.lead && singleCLientData?.lead.length > 0
        ? singleCLientData?.lead[0]
        : null;

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
      ? leads.find((el) => el.id.toString() === currentLead)?.customer_status?.status
      : singleCLientData
        ? singleCLientData?.client_status?.status
        : 'Loading';
  };

  return (
    <ModalWindow
      top={0}
      zIndex={55}
      successMessage={messages.successMessage}
      failMessage={messages.serverError}
      positionFixed
      overflowYScroll
      height={101}
      fullScreen={fullScreen}
      minSizeFull
    >
      <ModalContainer width={fullScreen ? 100 : 83.385417} marginTop={4.5}>
        <ModalContainerTitle
          title={
            singleCLientData?.first_name
              ? `Customer Detail - ${singleCLientData?.first_name}${singleCLientData?.last_name ? ` ${singleCLientData?.last_name}` : ''}`
              : 'Loading...'
          }
          extraTitleComponent={
            <section className="flex flex-row justify-center items-center gap-[1vw]">
              <CustomerLeadIndicator />
              <CustomerStatusIndicator status={getStatusName()} />
              <CustomerTemperatureIndicator
                temperatureId={
                  leads && leads.length > 0
                    ? leads.find((el) => el.id.toString() === currentLead)?.lead_temperature?.id
                    : undefined
                }
              />
            </section>
          }
          closeWindowFunction={handleCloseWindow}
          openNewTab={singleCLientData ? true : false}
          directOpenUrl={singleCLientData ? `/dashboard/customer/${singleCLientData?.id}` : ''}
        />
        <ModalContent
          overflowVisible
          decisionMessage={confirmSetADealMessage}
          onDecision={handleDecision}
          loading={loadingCustomerDetail}
        >
          <ContentRow cols={1} gap={5} widthFull>
            <Contact />
            <Calls />
            <GeneralInfo />
            {!loadingCustomerDetail && <MiddleButtonsOptions />}
            <Options />
            <DropdownContent title="Lead History" overflowScroll>
              <LeadHistory />
            </DropdownContent>
          </ContentRow>
          <BottomButtons />
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
