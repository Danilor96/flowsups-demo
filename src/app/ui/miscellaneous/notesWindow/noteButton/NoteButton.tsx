import { motion } from 'framer-motion';
import { CustomersListsPlusIcon } from '&/icons/Icons';
import { adminDashboardStore, modalWindowStore } from '@/store/adminDashboard';

export const lostReasons = [
  'Bad Prospect',
  'Duplicate',
  'English Speaker',
  'Incomplete Details',
  'Lost for Other Reason',
  'No answer',
  'No Interested',
  'No Longer Car Shopping',
  'No Longer Wants To Do Business With Us (Permanently Lost)',
  'No Qualify',
  'Out of range',
  'Prospect Requested Complete DNC',
  'Referral',
  'RTS',
  'Sales Interaction in a Deal',
  'Sold under diferent name',
  'Spam',
  'Transfer to another location',
  'Manual Deleted',
];

export function NoteButton({
  customerId,
  lostReasonId,
  fromId,
}: {
  customerId: number;
  lostReasonId?: number | null;
  fromId?: number | null;
}) {
  // ----- global states -----

  const { openCloseNoteWindow } = modalWindowStore();

  const { setNoteCustomerIdSelected, specificClientsNotesData, setNoteFromIdSelected } =
    adminDashboardStore();

  // ----- local states -----

  const handleNotes = () => {
    const lostNote = lostReasonId ? lostReasons[lostReasonId - 1] : '';

    const regularNotesArray = specificClientsNotesData
      ?.filter((note) => {
        if (note.client_id !== customerId) return false;
        if (fromId) return note.from?.id === fromId;
        return true;
      })
      ?.sort((a, b) => {
        return (
          new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()
        );
      });

    const regularNote =
      regularNotesArray && regularNotesArray.length > 0
        ? regularNotesArray[regularNotesArray.length - 1]?.note || ''
        : '';

    const returnedValue = lostNote
      ? `${lostNote.slice(0, 17)}...`
      : regularNote
        ? `${regularNote.slice(0, 17)}...`
        : '';

    return returnedValue;
  };

  const handleOpenNoteWindow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setNoteCustomerIdSelected(customerId);
    if(fromId) {
      setNoteFromIdSelected(fromId);
    }
    openCloseNoteWindow();
  };

  return (
    <motion.button
      onClick={handleOpenNoteWindow}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="flex flex-row justify-center items-center gap-[0.3vw] mx-auto px-[0.4vw] py-[0.6vh] rounded-[1.041666vw] shadow-crmFormShadow"
      style={{
        backgroundColor: handleNotes() ? '#FFFFFF21' : '#C9EBE6',
        color: handleNotes() ? '#FFF' : '#41B4A0',
      }}
    >
      {handleNotes() ? (
        <p>{handleNotes()}</p>
      ) : (
        <>
          <CustomersListsPlusIcon />
          <p>Add note</p>
        </>
      )}
    </motion.button>
  );
}
