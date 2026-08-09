import { ConfirmNotification } from '&/notifications/Notification';
import { motion } from 'framer-motion';
import { Options } from '../options/Options';
import useUiHandler from '@/hooks/closeComponentsHandler';
import { adminDashboardStore } from '@/store/adminDashboard';
import { useEffect, useState } from 'react';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';

export function CreditAppDecisionButton({
  customerId,
  customerName,
}: {
  customerId: number;
  customerName: string;
}) {
  // ----- global states -----

  const { creditAppListStatus } = adminDashboardStore();
  const { getSpecificClients } = adminDashboardStore();

  // ----- local states -----

  const { isOpen, ref, toggleOpen } = useUiHandler();

  const [confirmMessage, setConfirmMessage] = useState('');

  const [showConfirm, setShowConfirm] = useState(false);

  const [creditAppListPicked, setCreditAppListPicked] = useState('');

  const { loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleDecision = async (decision: boolean) => {
    if (decision) {
      const formData = new FormData();

      formData.append('status_id', creditAppListPicked);

      const apiUrl = `/api/adminDashboard/creditAppListStatus/${customerId}`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'PUT',
        options: {
          async onSuccess() {
            await getSpecificClients('3');
          },
        },
      });

      setShowConfirm(false);
    } else {
      setShowConfirm(false);
    }
  };

  useEffect(() => {
    if (creditAppListPicked) {
      const statusPicked = creditAppListStatus.find(
        (status) => status.id.toString() === creditAppListPicked,
      );

      setConfirmMessage(
        `Are you sure you want to change ${customerName} to ${statusPicked?.status.toUpperCase()} table?`,
      );
    }
  }, [creditAppListPicked, creditAppListStatus, customerName]);

  const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { status } = e.currentTarget.dataset;

    if (status) setCreditAppListPicked(status);

    setShowConfirm(!showConfirm);
  };

  return (
    <aside className="w-fit mx-auto">
      <article ref={ref} className="relative">
        <motion.button
          onClick={toggleOpen}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-fit text-[2vh] text-[#41B4A0] px-[1.2vw] py-[0.7vh] bg-[#C9EBE6] rounded-[1.041666vw] shadow-crmFormShadow"
        >
          Decision
        </motion.button>
        {isOpen && <Options handleClick={handleButton} />}
      </article>
      {showConfirm && (
        <ConfirmNotification
          notiMessage={confirmMessage}
          onDecision={handleDecision}
          loading={loadingFetch}
        />
      )}
    </aside>
  );
}
