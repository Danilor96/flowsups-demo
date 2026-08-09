import { ConfirmNotification } from '&/notifications/Notification';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { useCan } from '@/hooks/permissions';
import { adminDashboardStore, messagesStore, modalWindowStore } from '@/store/adminDashboard';
import { useSocketStore } from '@/store/socketIo';
import { useState } from 'react';

export function Options({ toggleOpen }: { toggleOpen: () => void }) {
  // ----- global states -----

  const {
    openCloseBulkSetUpADeal,
    openCloseMassiveSms,
    openCloseReassignLeads,
    openCloseCustomerStatus,
    openCloseBulkTemperature,
    openCloseBulkConsentSms,
    openCloseMassiveEmails,
  } = modalWindowStore();

  const { selectedCustomersIds, clients } = adminDashboardStore();

  const { setMessages } = messagesStore();

  const { updateDataWithSocket } = useSocketStore();

  const { can } = useCan();

  // ----- local states -----

  const [setUpDealMssg, setSetUpDealMssg] = useState('');

  const options = [
    can(57) ? 'Set Up A Deal' : '',
    can(58) ? 'Send SMS' : '',
    can(59) ? 'Send Email' : '',
    can(60) ? 'Reassign leads' : '',
    can(61) ? 'Change customer status' : '',
    can(62) ? 'Set lead temperature' : '',
    can(63) ? 'Set / Remove consent to send sms' : '',
    // 'Set / Remove customer workflow',
    // 'Request customer review',
  ];

  const areAllSoldCustomers = () => {
    if (clients && clients.length > 0) {
      const noSoldCustomers = clients.filter(
        (customer) =>
          customer.client_status?.id !== 10 && selectedCustomersIds.includes(customer.id),
      );

      if (noSoldCustomers && noSoldCustomers.length > 0) {
        return false;
      } else {
        return true;
      }
    }

    return true;
  };

  const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    switch (identity) {
      case '0':
        if (selectedCustomersIds.length > 0) {
          if (areAllSoldCustomers()) {
            openCloseBulkSetUpADeal();
          } else {
            setSetUpDealMssg(
              'All customers must have a sold status to proceed. Do you want to assign them a sold status?',
            );

            return;
          }
        } else {
          setMessages('You must select at least one customer from the list');
        }
        break;

      case '1':
        openCloseMassiveSms();
        break;

      case '2':
        openCloseMassiveEmails();
        break;

      case '3':
        openCloseReassignLeads();
        break;

      case '4':
        openCloseCustomerStatus();
        break;

      case '5':
        openCloseBulkTemperature();
        break;

      case '6':
        openCloseBulkConsentSms();
        break;
    }

    toggleOpen();
  };

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleAcceptChangeStatus = async () => {
    const formData = new FormData();

    formData.append('customers', JSON.stringify(selectedCustomersIds));

    formData.append('status', '10');

    const apiUrl = `/api/bulkActions/status`;

    await makeAsyncFetch({
      formData,
      apiUrl,
      method: 'POST',
      options: {
        onSuccess: () => {
          setSetUpDealMssg('');

          openCloseBulkSetUpADeal();

          updateDataWithSocket('customersList');

          for (let i = 0; i < selectedCustomersIds.length; i++) {
            const id = selectedCustomersIds[i];

            updateDataWithSocket('singleClient', undefined, {
              customerId: id,
            });
          }
        },
      },
    });
  };

  const handleDecision = async (decision: boolean) => {
    if (decision) {
      await handleAcceptChangeStatus();
    } else {
      setSetUpDealMssg('');
    }
  };

  return (
    <>
      <ul className="absolute top-[100%] mt-1 right-[50%] translate-x-[50%] z-10 w-[19vw] rounded-[0.520833vw] bg-white shadow-addNewReportHeadShadow overflow-hidden">
        {options.map((el, index) =>
          el ? (
            <button
              key={`${index + 11}bulkbtn${index * index}__`}
              onClick={handleButton}
              data-identity={index}
              className="w-full h-fit px-[1.5625vw] py-[1.37037vh] text-left text-[2vh] text-[#00A78B] hover:bg-[#C9EBE6] transition-colors"
            >
              {el}
            </button>
          ) : null,
        )}
      </ul>
      {setUpDealMssg && (
        <ConfirmNotification
          notiMessage={setUpDealMssg}
          onDecision={handleDecision}
          loading={loadingFetch}
        />
      )}
    </>
  );
}
