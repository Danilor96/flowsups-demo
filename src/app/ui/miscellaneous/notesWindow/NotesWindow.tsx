import { adminDashboardStore, messagesStore, modalWindowStore } from '@/store/adminDashboard';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { NotesInbox } from '&/miscellaneous/notesWindow/notesInbox/NotesInbox';

export function NotesWindow() {
  // ----- global states -----

  const { openCloseNoteWindow } = modalWindowStore();

  const { setNoteCustomerIdSelected } = adminDashboardStore();

  const { messages } = messagesStore();

  // ----- local states -----

  const handleCloseWindow = () => {
    setNoteCustomerIdSelected(null);
    openCloseNoteWindow();
  };

  return (
    <ModalWindow
      top={0}
      successMessage={messages.successMessage}
      failMessage={messages.serverError}
      positionFixed
    >
      <ModalContainer width={45.520833} marginTop={6}>
        <ModalContainerTitle title="Note" closeWindowFunction={handleCloseWindow} />
        <ModalContent>
          <NotesInbox />
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
