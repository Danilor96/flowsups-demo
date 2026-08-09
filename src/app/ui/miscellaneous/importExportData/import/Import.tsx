import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { messagesStore, modalWindowStore } from '@/store/adminDashboard';
import { ImportInput } from '&/miscellaneous/importExportData/import/ImportInput';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { importStore } from '@/store/importExportData';

export function Import() {
  // ----- global state -----

  const { closeImportData } = modalWindowStore();

  const { messages } = messagesStore();

  const { buttonIdentity, filename, disabledBtn } = importStore();
  const { handleImport, handleImportButton, clearDataToImport } = importStore();

  // ----- local state -----

  return (
    <ModalWindow
      top={-13.8}
      zIndex={200}
      successMessage={messages.successMessage}
      failMessage={messages.serverError}
    >
      <ModalContainer width={63.645833} marginTop={24.351852}>
        <ModalContainerTitle
          title="Upload CSV"
          closeWindowFunction={() => {
            clearDataToImport();
            closeImportData();
          }}
        />
        <ModalContent>
          <ImportInput handleChange={handleImport} filename={filename} />
          {filename && (
            <ButtonContainer marginTop={2} widthFull justify="right">
              <Button
                backgroundColor="#00A78B"
                identity={buttonIdentity}
                textColor="#FFF"
                buttonText="Import"
                disabled={disabledBtn}
                onClick={handleImportButton}
              />
            </ButtonContainer>
          )}
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
