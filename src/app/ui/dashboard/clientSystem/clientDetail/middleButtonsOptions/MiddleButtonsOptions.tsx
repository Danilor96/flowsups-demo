import { Button } from '&/buttons/Button';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { messagesStore, modalWindowStore, singleCLientDataStore } from '@/store/adminDashboard';
import { Deposit } from './deposit/Deposit';
import { SetUpADeal } from './setUpADeal/SetUpADeal';
import { SetLeadTemperature } from './setLeadTemperature/SetLeadTemperature';
import { AnimatePresence } from 'framer-motion';
import { useSocketStore } from '@/store/socketIo';
import { Consent } from './consent/Consent';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { CreditApp } from './creditApp/CreditApp';
import { useState } from 'react';
import { ConfirmNotification } from '&/notifications/Notification';
import DailyAppointmentSchedule, { DailyActivityTable } from './DailyAppointmentSchedule';
import { leadsStore } from '@/store/leads';
import useUiHandler from '@/hooks/closeComponentsHandler';
import { EndVisit } from '&/dashboard/endVisit/EndVisit';
import { Can } from '@/app/ui/auth/Can';
import { CustomersStatuses } from '@/app/libs/customer/customersFunctions';

export function MiddleButtonsOptions() {
  // ----- global states -----

  const { leads, currentLead } = leadsStore();

  const { singleCLientData } = singleCLientDataStore();
  const { getSingleClientData } = singleCLientDataStore();

  const { deposit, setUpADeal, leadTemperature, consentModal, sendCreditApp } = modalWindowStore();
  const {
    openDeposit,
    openLeadTemperature,
    openSetUpADeal,
    setShowConsentModal,
    openCloseSendCreditApp,
    openAppointmentCustomersList,
    setLoadingCustomerDetail,
  } = modalWindowStore();

  const { setMessages } = messagesStore();

  const { updateDataWithSocket } = useSocketStore();

  // ----- local states -----

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const [warningRemoveConsent, setWarningRemoveConsent] = useState('');
  const [warningNewLead, setWarningNewLead] = useState('');
  const [showReschedule, setShowReschedule] = useState(false);
  const [showErrorReschedule, setShowErrorReschedule] = useState(false);

  const [warningVisitMssg, setWarningVisitMssg] = useState('');

  const handleVisit = async () => {
    if (
      singleCLientData &&
      singleCLientData?.appointment &&
      singleCLientData?.appointment.length > 0
    ) {
      const formData = new FormData();

      formData.append('action', '2');

      const apiUrl = `/api/adminDashboard/dailyActvityAppointments/${singleCLientData?.appointment[0].id}`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'PUT',
        permissionForFetch: 8,
        options: {
          onSuccess: () => {
            updateDataWithSocket('dailyAppointmentsList');

            getSingleClientData(singleCLientData?.id.toString());
          },
        },
      });
    } else {
      const formData = new FormData();

      const now = new Date();

      formData.append('now', now.toISOString());

      const apiUrl = `/api/adminDashboard/dailyActvityAppointments/${singleCLientData?.id}`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'POST',
        options: {
          onSuccess: () => {
            updateDataWithSocket('dailyAppointmentsList');

            if (singleCLientData) getSingleClientData(singleCLientData?.id.toString());
          },
        },
      });
    }

    setWarningVisitMssg('');
  };

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (identity === 'deposit') {
      openDeposit();
    }

    if (identity === 'setLeadTemperature') {
      openLeadTemperature();
    }

    if (identity === 'visit') {
      if (!singleCLientData?.appointment?.find((app) => app.status_id === 5)?.id) {
        setWarningVisitMssg('Are you sure you want to schedule a visit for today?');
      } else {
        toggleOpen();
      }
    }

    if (identity === 'consent') {
      if (!singleCLientData?.consent_approved) {
        setShowConsentModal(true);
      } else {
        setWarningRemoveConsent('Proceed to remove consent?');
      }
    }

    if (identity === 'setUpADeal') {
      const requiredStatus = [CustomersStatuses.Sold, CustomersStatuses.Funded];

      const customerStatusId = leads?.find(
        (el) => el.id.toString() === currentLead,
      )?.customer_status_id;

      if (!customerStatusId) return;

      if (requiredStatus.includes(customerStatusId)) {
        openSetUpADeal();
      } else {
        setMessages('This customer does not have a Sold status yet');
      }
    }

    if (identity === 'sendCreditApp') {
      openCloseSendCreditApp();
    }

    if (identity === 'appointmentSchedule') {
      if (singleCLientData?.appointment && singleCLientData?.appointment.length > 0) {
        setShowErrorReschedule(true);
        return;
      }
      openAppointmentCustomersList();
    }

    if (identity === 'newLead') {
      setWarningNewLead(
        `Are you sure you want to start a new lead? This will allow you to set the customer status to New and starts a new process separate of the current one.`,
      );
    }
  };

  const buttonsData = [
    {
      id: 1,
      text: 'Deposit',
      backgroundColor: '#FFF',
      textColor: '#00A78B',
      border: 0.104167,
      borderColor: '#00A78B',
      identity: 'deposit',
      buttonTextSize: 2,
      width: 6.25,
      onClick: handleButton,
      can: 70,
    },
    {
      id: 2,
      text: 'Set Lead Temperature',
      backgroundColor: '#FFF',
      textColor: '#00A78B',
      border: 0.104167,
      borderColor: '#00A78B',
      identity: 'setLeadTemperature',
      buttonTextSize: 2,
      width: 13.020833,
      onClick: handleButton,
      can: 71,
    },
    {
      id: 3,
      text: loadingFetch
        ? 'Loading'
        : !singleCLientData?.appointment?.find((app) => app.status_id === 5)?.id
          ? 'Visit'
          : 'End Visit',
      backgroundColor: '#FFF',
      textColor: '#00A78B',
      border: 0.104167,
      borderColor: '#00A78B',
      identity: 'visit',
      buttonTextSize: 2,
      width: 4.0625,
      disabled: loadingFetch
        ? true
        : // : singleCLientData?.appointment.find((app) => app.status_id === 5)?.id
          // ? true
          false,
      onClick: handleButton,
      can: 8,
    },
    {
      id: 4,
      text: singleCLientData?.consent_approved ? 'Cancel Consent' : 'Consent',
      backgroundColor: '#FFF',
      textColor: '#00A78B',
      border: 0.104167,
      borderColor: '#00A78B',
      identity: 'consent',
      buttonTextSize: 2,
      width: 6.197917,
      disabled: false,
      onClick: handleButton,
      can: [72, 63],
    },
    {
      id: 5,
      text: 'Set up a deal',
      backgroundColor: '#FFF',
      textColor: '#00A78B',
      border: 0.104167,
      borderColor: '#00A78B',
      identity: 'setUpADeal',
      buttonTextSize: 2,
      width: 8,
      onClick: handleButton,
      can: [73, 57],
    },
    {
      id: 6,
      text: 'Send Credit App',
      backgroundColor: '#FFF',
      textColor: '#00A78B',
      border: 0.104167,
      borderColor: '#00A78B',
      identity: 'sendCreditApp',
      buttonTextSize: 2,
      width: 10,
      disabled: loadingFetch,
      onClick: handleButton,
      can: 74,
    },
    {
      id: 7,
      text: 'Appointment Schedule',
      backgroundColor: '#FFF',
      textColor: '#00A78B',
      border: 0.104167,
      borderColor: '#00A78B',
      identity: 'appointmentSchedule',
      buttonTextSize: 2,
      width: 13.5,
      disabled: loadingFetch,
      onClick: handleButton,
      can: [75, 76, 77],
    },
    {
      id: 8,
      text: 'New Lead',
      backgroundColor: '#FFF',
      textColor: '#00A78B',
      border: 0.104167,
      borderColor: '#00A78B',
      identity: 'newLead',
      buttonTextSize: 2,
      width: 4.0625,
      widthFitContent: true,
      disabled: loadingFetch,
      show: true,
      onClick: handleButton,
      can: 78,
    },
  ];

  const handleDecision = async (decision: boolean) => {
    if (decision) {
      if (warningVisitMssg) {
        handleVisit();
      } else if (warningNewLead) {
        setLoadingCustomerDetail(true);

        const formData = new FormData();

        const apiUrl = `/api/lead/${singleCLientData?.id}`;

        await makeAsyncFetch({
          formData,
          apiUrl,
          method: 'POST',
          permissionForFetch: 78,
          options: {
            onSuccess: () => {
              updateDataWithSocket('singleClient', undefined, {
                customerId: singleCLientData?.id,
                getLeads: true,
              });
            },
          },
        });

        setLoadingCustomerDetail(false);
      } else {
        const formData = new FormData();

        const apiUrl = `/api/bulkActions/consentSms`;

        formData.append('customers', JSON.stringify([singleCLientData?.id]));
        formData.append('off', '1');

        await makeAsyncFetch({
          formData,
          apiUrl,
          method: 'POST',
          options: {
            onSuccess: () => {
              updateDataWithSocket('singleClient', undefined, {
                customerId: singleCLientData?.id,
              });
            },
          },
        });

        setWarningRemoveConsent('');
      }
    } else {
      setWarningRemoveConsent('');
      setWarningNewLead('');
      setWarningVisitMssg('');
    }
  };

  const handleErrorAppointmentDecision = (decision: boolean) => {
    if (decision) {
      setShowReschedule(false);
      setShowErrorReschedule(false);
    } else {
      setShowErrorReschedule(false);
      setShowReschedule(true);
    }
  };

  const { isOpen, ref, toggleOpen } = useUiHandler('floating-portal-container');

  return (
    <Can requiredPermission={[70, 71, 8, 72, 63, 73, 57, 74, 75, 76, 77, 78]}>
      <ButtonContainer marginTop={0} gap={0.729167} positionRelative>
        {buttonsData.map((el, index) =>
          el.show ? (
            leads && leads.length > 0 && leads?.find((el) => el.has_ended === false) ? null : (
              <Can
                key={`${el.id + index - 23}middlebuttonsopts${index}`}
                requiredPermission={el.can}
              >
                <Button
                  backgroundColor={el.backgroundColor}
                  identity={el.identity}
                  textColor={el.textColor}
                  buttonText={el.text}
                  border={el.border}
                  borderColor={el.borderColor}
                  buttonTextSize={el.buttonTextSize}
                  width={el.width}
                  disabled={el.disabled}
                  onClick={el.onClick}
                  widthFitContent={el.widthFitContent}
                />
              </Can>
            )
          ) : (
            <Can key={`${el.id + index - 23}middlebuttonsopts${index}`} requiredPermission={el.can}>
              <Button
                backgroundColor={el.backgroundColor}
                identity={el.identity}
                textColor={el.textColor}
                buttonText={el.text}
                border={el.border}
                borderColor={el.borderColor}
                buttonTextSize={el.buttonTextSize}
                width={el.width}
                disabled={el.disabled}
                onClick={el.onClick}
              />
            </Can>
          ),
        )}
        <AnimatePresence>
          {deposit && (
            <Can requiredPermission={70}>
              <Deposit />
            </Can>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {setUpADeal && (
            <Can requiredPermission={[73, 57]}>
              <SetUpADeal />
            </Can>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {leadTemperature && (
            <Can requiredPermission={71}>
              <SetLeadTemperature />
            </Can>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {consentModal && (
            <Can requiredPermission={[72, 63]}>
              <Consent />
            </Can>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {sendCreditApp && (
            <Can requiredPermission={74}>
              <CreditApp />
            </Can>
          )}
        </AnimatePresence>
        <ConfirmNotification
          notiMessage={warningRemoveConsent || warningVisitMssg || warningNewLead}
          onDecision={handleDecision}
          loading={loadingFetch}
          textWidth={warningNewLead ? 60 : undefined}
        />
        {showErrorReschedule && (
          <DailyAppointmentSchedule
            onDecision={handleErrorAppointmentDecision}
            notiMessage="This customer already has an appointment scheduled"
          />
        )}
        {showReschedule && (
          <DailyActivityTable closeWindowFunction={() => setShowReschedule(false)} />
        )}
        <div ref={ref}>
          {singleCLientData && isOpen && (
            <EndVisit
              address={singleCLientData?.current_address || ''}
              customer={`${singleCLientData?.first_name || ''} ${
                singleCLientData?.last_name || ''
              }`}
              customerId={singleCLientData?.id}
              email={singleCLientData.email}
              homePhone={singleCLientData.home_phone}
              leadType={singleCLientData.lead_type?.type || ''}
              mobilePhone={singleCLientData.mobile_phone}
              salesRep={`${singleCLientData.seller?.name || ''} ${
                singleCLientData.seller?.last_name || ''
              }`}
              toggleOpen={toggleOpen}
              workPhone={singleCLientData.work_phone}
              appointmentId={singleCLientData?.appointment
                ?.find((app) => app.status_id === 5)
                ?.id.toString()}
              salesManagerId={singleCLientData.sales_manager?.id}
              vehicleId={singleCLientData.interested_vehicle?.id}
              fromCustomerDetail
            />
          )}
        </div>
      </ButtonContainer>
    </Can>
  );
}
