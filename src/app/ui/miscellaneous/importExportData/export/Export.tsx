import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { modalWindowStore } from '@/store/adminDashboard';
import { exportStore } from '@/store/importExportData';

export function Export() {
  // ----- global states -----

  const { closeExportData } = modalWindowStore();

  const { handleButton } = exportStore();

  // ----- local states -----

  return (
    <ModalWindow top={-13.8}>
      <ModalContainer marginTop={24.537037} width={35.208333}>
        <ModalContainerTitle title="Export CSV" closeWindowFunction={closeExportData} />
        <ModalContent flexbox flexCol justify="center" alignItems="center">
          <Paragraph color="#00A78B" fontSize={3.5} fontWeight={600}>
            Export data
          </Paragraph>
          <Paragraph fontSize={2.5}>Data will export by excel</Paragraph>
          <ButtonContainer marginTop={2} alignContentCenter gap={3}>
            <Button
              width={9.583333}
              buttonText="Cancel"
              backgroundColor="#FFF"
              identity="cancel"
              textColor="#00A78B"
              border={0.104167}
              borderColor="#00A78B"
              onClick={closeExportData}
            />
            <Button
              width={9.583333}
              buttonText="Export"
              backgroundColor="#00A78B"
              identity="export"
              textColor="#FFF"
              onClick={handleButton}
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
