import { useState } from 'react';
import { CloseWindow } from '@/app/libs/definitions';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ColoredTable } from '&/table/coloredTable/ColoredTable';
import { PlusIcon } from '&/icons/Icons';

export function AddRts({ closeWindow }: CloseWindow) {
  // handling close current window
  const handleCloseWindow = () => {
    closeWindow(false);
  };

  // table data
  const [tableData, setTableDate] = useState<any[]>([
    {
      id: '',
      customer: '',
      sales_assigned: '',
      vehicle: '',
      date: '',
    },
  ]);

  // handling add other button
  const handleAddOther = (e: React.MouseEvent<HTMLButtonElement>) => {};

  return (
    <ModalWindow top={0}>
      <ModalContainer marginTop={4.166667} width={82.916667}>
        <ModalContainerTitle title="Add RTS" closeWindowFunction={handleCloseWindow} />
        <ModalContent>
          <ColoredTable
            height={61.574074}
            textColor="#FFF"
            tableData={tableData}
            specialButton={handleAddOther}
            specialButtonBackgroundColor="#92CEC375"
            specialButtonHeight={5.740741}
            specialButtonTextColor="#00A78B"
            specialButtonTextSize={1.851852}
            specialButtonText="Add RTS"
            specialButtonIcon={<PlusIcon />}
          />
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
