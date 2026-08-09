import { Loader } from '&/miscellaneous/loader/Loader';
import { ConfirmNotification } from '@/app/ui/notifications/Notification';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { adminDashboardStore, messagesStore } from '@/store/adminDashboard';
import { useCallback, useState } from 'react';

export function Options() {
  // ----- global states -----

  const { clientsData, clientStatusesData } = adminDashboardStore();
  const { getClients, getClientStatuses, setSelectedCustomersIds } = adminDashboardStore();

  const { setMessages } = messagesStore();

  const getPromieseData = useCallback(() => {
    return [getClients(), getClientStatuses()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loading, error } = useLoadingGetData(getPromieseData);

  // ----- local states -----

  const [warningMessage, setWarningMessage] = useState('');

  const [statusIdSelected, setStatusIdSelected] = useState('');

  const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;

    setStatusIdSelected(value);

    setWarningMessage('This will reset the selected customers. Do you want to proceed?');
  };

  const handleDecision = (decision: boolean) => {
    if (decision) {
      if (clientsData && clientsData.length > 0 && statusIdSelected) {
        const clientsCopy = [...clientsData];

        const clientsBySelectedStatus = clientsCopy.filter(
          (el) => el.client_status?.id === parseInt(statusIdSelected),
        );

        if (clientsBySelectedStatus && clientsBySelectedStatus.length > 0) {
          let newCustomerIds: number[] = [];

          for (let i = 0; i < clientsBySelectedStatus.length; i++) {
            const customer = clientsBySelectedStatus[i];

            newCustomerIds.push(customer.id);
          }

          setSelectedCustomersIds(newCustomerIds);
        } else {
          setMessages('There is no customers with this status');
        }
      }

      setWarningMessage('');
    } else {
      setWarningMessage('');
    }

    setStatusIdSelected('');
  };

  return (
    <ul className="absolute top-0 left-[110%] z-10 w-[19vw] rounded-[0.520833vw] bg-white shadow-addNewReportHeadShadow overflow-hidden">
      {clientStatusesData?.map((el, index) => (
        <button
          key={`${index + 11}bulkbtn${index * index}__`}
          onClick={handleButton}
          value={el.id}
          className="w-full h-fit px-[1.5625vw] py-[1.37037vh] text-left text-[2vh] text-[#00A78B] hover:bg-[#C9EBE6] transition-colors"
        >
          {`${el.status.replace(el.status[0], el.status[0].toUpperCase())} Customers`}
        </button>
      ))}
      {loading && <Loader />}
      {warningMessage && (
        <ConfirmNotification notiMessage={warningMessage} onDecision={handleDecision} />
      )}
    </ul>
  );
}
