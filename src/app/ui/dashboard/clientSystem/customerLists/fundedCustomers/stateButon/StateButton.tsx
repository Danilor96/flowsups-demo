import { ThreeDotsIcon } from '@/app/ui/icons/Icons';
import { ConfirmNotification } from '@/app/ui/notifications/Notification';
import useUiHandler from '@/hooks/closeComponentsHandler';
import { motion } from 'framer-motion';
import { FundedOptions } from './fundedOptions/FundedOptions';
import { useState } from 'react';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { useSocketStore } from '@/store/socketIo';
import { CustomersStatuses } from '@/app/libs/customer/customersFunctions';
import { adminDashboardStore } from '@/store/adminDashboard';
import { TextAreaInput } from '@/app/ui/inputs/TextAreaInput';

export function StateButton({
  customerId,
  currentState,
  dealExists,
}: {
  customerId: number;
  currentState?: number | null;
  dealExists?: boolean;
}) {
  // ----- global states -----

  const { updateDataWithSocket } = useSocketStore();

  const getSpecificClients = adminDashboardStore((state) => state.getSpecificClients);
  const getSpecificClientsTwo = adminDashboardStore((state) => state.getSpecificClientsTwo);
  const getSpecificClientsThree = adminDashboardStore((state) => state.getSpecificClientsThree);

  // ----- local states -----

  const [notiMssg, setNotiMssg] = useState('');
  const [statusNameSelected, setStatusNameSelected] = useState('');
  const [statusId, setStatusId] = useState('');
  const [note, setNote] = useState('');
  const [noteWarning, setNoteWarning] = useState('');

  const { loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value, name } = e.currentTarget;

    if (value === '2' && !dealExists) {
      setNotiMssg('This deal needs to have "Set Up a Deal" before reaching "Funded"');
      setStatusNameSelected('');
      setStatusId('MISSING_DEAL');
      return;
    }

    setNotiMssg('Are you sure you want to change the status to: ');

    setStatusNameSelected(name?.toUpperCase());

    setStatusId(value);
  };

  const handleDecision = async (decision: boolean) => {
    if (statusId === 'MISSING_DEAL' || !decision) {
      setNotiMssg('');

      setStatusNameSelected('');

      setStatusId('');

      setNoteWarning('');

      return;
    }

    setNoteWarning('');

    if (statusId === '3' && !note) {
      setNoteWarning('Please enter a note');

      return;
    }

    const formData = new FormData();

    formData.append('statusId', statusId);
    formData.append('note', note);

    const apiUrl = `/api/fundedList/${customerId}`;

    await makeAsyncFetch({
      formData,
      apiUrl,
      method: 'PUT',
      options: {
        onSuccess() {
          getSpecificClients(CustomersStatuses.Sold);
          getSpecificClientsTwo(CustomersStatuses.Sold);
          getSpecificClientsThree(CustomersStatuses.Sold);

          updateDataWithSocket('customersLists', undefined, {
            specificCustomers: [CustomersStatuses.Funded],
          });

          setNotiMssg('');

          setStatusNameSelected('');

          setStatusId('');
        },
      },
    });
  };

  const { isOpen, ref, toggleOpen } = useUiHandler();

  return (
    <>
      <ConfirmNotification
        notiMessage={notiMssg}
        alterNotiMessage={statusNameSelected}
        alterNotiMessageColor="#00a78b"
        onDecision={handleDecision}
        loading={loadingFetch}
        yesAlterText={statusId === 'MISSING_DEAL' ? 'Got it' : 'Yes'}
        noAlterText={statusId === 'MISSING_DEAL' ? 'Close' : 'No'}
      >
        {statusId === '3' && (
          <TextAreaInput
            label="Note"
            name="note"
            onChange={(e) => setNote(e.currentTarget.value)}
            value={note}
            width={0}
            height={12}
            widthFull
          />
        )}
        {noteWarning && <p className="text-red-500 text-sm">{noteWarning}</p>}
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
        {isOpen && <FundedOptions currentState={currentState} onClick={handleButton} />}
      </div>
    </>
  );
}
