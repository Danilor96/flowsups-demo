import { ThreeDotsIcon } from '&/icons/Icons';
import useUiHandler from '@/hooks/closeComponentsHandler';
import { motion } from 'framer-motion';
import { DeliveryOptions } from './options/Options';
import { ConfirmNotification } from '@/app/ui/notifications/Notification';
import { useState } from 'react';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { useSocketStore } from '@/store/socketIo';
import { adminDashboardStore, singleCLientDataStore } from '@/store/adminDashboard';
import { SoldDataPayload, SoldStatusContent, appendSoldDataToForm } from '../../../clientDetail/options/SoldStatusContent';
import { CustomersStatuses } from '@/app/libs/customer/customersFunctions';
import { FieldErrorMessage } from '@/app/ui/miscellaneous/fieldErrorMessage/FieldErrorMessage';
import { useSession } from 'next-auth/react';

export function StateButton({ customerId }: { customerId: number }) {
  // ----- global states -----

  const { updateDataWithSocket } = useSocketStore();
  const { singleCLientData, getSingleClientData, clearSingleClientData } = singleCLientDataStore();
  const { getSpecificClients, getTodayTotals } = adminDashboardStore();
  const { data: session } = useSession();

  const userId = session?.user.id;
  // ----- local states -----

  const [notiMssg, setNotiMssg] = useState('');
  const [statusIdSelected, setStatusIdSelected] = useState('');
  const [statusNameSelected, setStatusNameSelected] = useState('');
  const [soldData, setSoldData] = useState<SoldDataPayload | null>(null);
  const [loadingInfoSingleClient, setLoadingInfoSingleClient] = useState(false);

  const getInfoClient = async (customerId: number) => {
    setLoadingInfoSingleClient(true);
    await getSingleClientData(customerId.toString());
    setLoadingInfoSingleClient(false);
  };

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value, name } = e.currentTarget;

    setStatusIdSelected(value);
    setStatusNameSelected(name);
    setNotiMssg(`Are you sure you want to change the customer status to: `);
    setManualFieldErrors({});
    if (value === CustomersStatuses.Sold.toString()) {
      await getInfoClient(customerId);
    }
  };

  const { isOpen, ref, toggleOpen } = useUiHandler();

  const { loadingFetch, fieldErrors, setManualFieldErrors, makeAsyncFetch } = useAsyncFetching();

  const handleDecision = async (decision: boolean) => {
    if (!decision) {
      setNotiMssg('');
      setStatusIdSelected('');
      setSoldData(null);
      setManualFieldErrors({});
      clearSingleClientData();
      return;
    }

    const formData = new FormData();
    let apiUrl = `/api/deliveryStatus/${customerId}`;

    if (statusIdSelected === CustomersStatuses.Sold.toString()) {
      formData.append('statusSelected', statusIdSelected);
      appendSoldDataToForm(formData, soldData);
      apiUrl = `/api/adminDashboard/setCustomerStatus/${customerId}`;
    } else {
      formData.append('statusId', statusIdSelected);
    }

    await makeAsyncFetch({
      formData,
      apiUrl,
      method: 'PUT',
      options: {
        onSuccess() {
          if (statusIdSelected === CustomersStatuses.Sold.toString()) {
            if (userId) getTodayTotals(userId);
            updateDataWithSocket('dailyTotals');
            updateDataWithSocket('customersList');
            clearSingleClientData();
            setSoldData(null);
          }
          getSpecificClients(CustomersStatuses.Delivery);

          updateDataWithSocket('customersLists', undefined, {
            specificCustomers: [CustomersStatuses.Delivery, parseInt(statusIdSelected)],
          });
          setStatusIdSelected('');
          setStatusNameSelected('');
          setNotiMssg('')
        },
      },
    });
  };

  return (
    <>
      <ConfirmNotification
        notiMessage={notiMssg}
        alterNotiMessage={statusNameSelected?.toUpperCase()}
        alterNotiMessageColor="#00a78b"
        onDecision={handleDecision}
        loading={loadingFetch || loadingInfoSingleClient}
        childrenBottom={statusIdSelected !== CustomersStatuses.Sold.toString()}
        overflowVisible={!loadingFetch && statusIdSelected === CustomersStatuses.Sold.toString()}
      >
        {statusIdSelected === CustomersStatuses.Sold.toString() && singleCLientData?.id === customerId && (
          <SoldStatusContent singleCLientData={singleCLientData} onChange={setSoldData} />
        )}
        <FieldErrorMessage fieldErrors={fieldErrors} fontSize={2} positionStatic textCenter name={'customerStatus'} />
      </ConfirmNotification>
      <div ref={ref} className="relative">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={toggleOpen}
          className="w-[2.03125vw] h-[2.03125vw] bg-[#FFFFFF40] shadow-crmFormShadow rounded-[0.7vw] my-auto mx-auto flex justify-center items-center"
        >
          <ThreeDotsIcon />
        </motion.button>
        {isOpen && <DeliveryOptions onClick={handleButton} />}
      </div>
    </>
  );
}
