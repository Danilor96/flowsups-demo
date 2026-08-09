import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { Button } from '&/buttons/Button';
import { BdcComissionReportIcon, SalesRepComissionReportIcon } from '&/icons/Icons';
import { useState } from 'react';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { BdcReport } from './bdcReport/BdcReport';
import { SalesReport } from './salesReport/SalesReport';

export function ComissionReport({ closeFn }: { closeFn: () => void }) {
  // global states

  // local states

  const [openBdcComission, setOpenBdcComission] = useState(false);
  const [openSalesComission, setOpenSalesComission] = useState(false);

  return (
    <ModalWindow>
      <ModalContainer marginTop={12} width={40}>
        <ModalContainerTitle title="Commission Report" closeWindowFunction={closeFn} />
        <ModalContent>
          <ButtonContainer marginTop={0} widthFull justify="center" gap={2}>
            <Button
              backgroundColor="#FFF"
              identity=""
              textColor="#00A78B"
              buttonIcon={<BdcComissionReportIcon />}
              width={10.416667}
              height={18.518519}
              border={0.15625}
              borderColor="#C9EBE6"
              buttonTextSize={1.8}
              buttonText="Bdc"
              iconTextGap={1}
              iconAbove
              onClick={() => setOpenBdcComission(true)}
            />
            <Button
              backgroundColor="#FFF"
              identity=""
              textColor="#00A78B"
              buttonIcon={<SalesRepComissionReportIcon />}
              width={10.416667}
              height={18.518519}
              border={0.15625}
              borderColor="#C9EBE6"
              buttonTextSize={1.8}
              buttonText="Sales Rep"
              iconTextGap={1}
              iconAbove
              onClick={() => setOpenSalesComission(true)}
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
      {openBdcComission && <BdcReport closeFn={() => setOpenBdcComission(false)} />}
      {openSalesComission && <SalesReport closeFn={() => setOpenSalesComission(false)} />}
    </ModalWindow>
  );
}
