import { CustomerStatusIndicator } from '&/miscellaneous/customerStatusIndicator/CustomerStatusIndicator';
import { CustomerTemperatureIndicator } from '&/miscellaneous/customerTemperatureIndicator/CustomerTemperatureIndicator';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { messagesStore, modalWindowStore, singleCLientDataStore } from '@/store/adminDashboard';
import { CallInfo } from './callInfo/CallInfo';
import { Buttons } from './buttons/Buttons';
import { useTwilioStore } from '@/store/phoneDevice';
import { PhoneSelector } from './PhoneSelector/PhoneSelector';
import { useEffect, useState } from 'react';
import { leadsStore } from '@/store/leads';
import { CustomersStatuses, FundingStatuses } from '@/app/libs/customer/customersFunctions';
import { DraggableWrapper } from '&/miscellaneous/draggableWrapper/DraggableWrapper';

export function OutgoingCallComponent() {
  // ----- global states -----

  const { setShowCallModal } = modalWindowStore();

  const { singleCLientData } = singleCLientDataStore();

  const { messages } = messagesStore();

  const { call } = useTwilioStore();
  const { setShowDashboardCallHandler } = useTwilioStore();

  const { leads } = leadsStore();

  // ----- local states -----
  const [phone, setPhone] = useState<{ id: number; phoneType: string; phoneNumber: string } | null>(
    null,
  );

  useEffect(() => {
    if (singleCLientData) {
      setPhone({
        id: 1,
        phoneType: 'Cell',
        phoneNumber: singleCLientData?.mobile_phone,
      });
    }
  }, [singleCLientData]);

  const handleCloseWindow = () => {
    setShowCallModal(false);
    call && setShowDashboardCallHandler(true);
  };

  const listPhones = [
    {
      id: 1,
      phoneType: 'Cell',
      phoneNumber: singleCLientData?.mobile_phone || '',
    },
    {
      id: 2,
      phoneType: 'Home',
      phoneNumber: singleCLientData?.home_phone || '',
    },
    {
      id: 3,
      phoneType: 'Work',
      phoneNumber: singleCLientData?.work_phone || '',
    },
  ].filter(phone => phone.phoneNumber);

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
    <ModalWindow
      top={0}
      minSizeFull
      successMessage={messages.successMessage}
      failMessage={messages.serverError}
      positionFixed
    >
      <DraggableWrapper>
        <ModalContainer marginTop={12.685185} width={45.520833}>
          <ModalContainerTitle
          closeWindowFunction={handleCloseWindow}
          title={`${singleCLientData?.first_name} ${singleCLientData?.last_name}`}
          extraTitleComponent={
            <>
              <CustomerStatusIndicator
                status={getStatusName()}
              />
              <CustomerTemperatureIndicator
                temperatureId={
                  leads && leads.length > 0
                    ? leads.find((el) => el.is_active === true)?.lead_temperature?.id
                    : undefined
                }
              />
            </>
          }
        />
        <ModalContent paddingBottom={8} overflowVisible>
          {/* <CallInfo /> */}
          <div className="w-full flex items-center justify-center mt-6">
            <PhoneSelector
              name="Phone"
              onChange={(phone) => setPhone(phone)}
              options={listPhones}
              value={phone}
              width={16}
            />
          </div>
          <Buttons
            phoneNumberSelected={phone?.phoneNumber || singleCLientData?.mobile_phone || ''}
          />
        </ModalContent>
      </ModalContainer>
      </DraggableWrapper>
    </ModalWindow>
  );
}
