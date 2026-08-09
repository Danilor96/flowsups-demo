import { useState } from 'react';
import { modalWindowStore } from '@/store/adminDashboard';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import {
  BdcLogIcon,
  DifferedReportIcon,
  FundingLogIcon,
  PlusIcon2,
  SalesLogIcon,
  StoreReportIcon,
} from '&/icons/Icons';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { AnimatePresence } from 'framer-motion';
import { SalesLog } from '&/dashboard/reports/salesLog/SalesLog';
import { BdcLog } from '&/dashboard/reports/bdcLog/BdcLog';
import { FundingLog } from '&/dashboard/reports/fundingLog/FundingLog';
import { DifferedReport } from '&/dashboard/reports/differedReport/DifferedReport';
import { StoreReport } from '&/dashboard/reports/storeReport/StoreReport';

export function Reports() {
  // ----- global states -----

  const { closeReports } = modalWindowStore();

  // ----- local states -----
  const [openSalesLog, setOpenSalesLog] = useState<boolean>(false);
  const [openBdcLog, setOpenBdcLog] = useState<boolean>(false);
  const [openFundingLog, setOpenFundingLog] = useState<boolean>(false);
  const [openDifferedReport, setOpenDifferedReport] = useState<boolean>(false);
  const [openStoreReport, setOpenStoreReport] = useState<boolean>(false);

  const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    // open sales log view
    identity === 'salesLog' && setOpenSalesLog(true);

    // open bdc log view
    identity === 'bdcLog' && setOpenBdcLog(true);

    // open funding log view
    identity === 'fundingLog' && setOpenFundingLog(true);

    // open differed report view
    identity === 'differedReport' && setOpenDifferedReport(true);

    // open store report view
    identity === 'storeReport' && setOpenStoreReport(true);
  };

  // button info
  const buttonInfo = [
    {
      key: 1,
      backgroundColor: '#FFF',
      buttonText: 'Store Report',
      buttonTextSize: 1.8,
      buttonIcon: <StoreReportIcon />,
      iconTextGap: 1,
      iconAbove: true,
      width: 10.416667,
      height: 18.518519,
      identity: 'storeReport',
      textColor: '#00A78B',
      border: 0.15625,
      borderColor: '#C9EBE6',
      onClick: handleButton,
    },
    {
      key: 2,
      backgroundColor: '#FFF',
      buttonText: 'Sales Log',
      buttonTextSize: 1.8,
      buttonIcon: <SalesLogIcon />,
      iconTextGap: 1,
      iconAbove: true,
      width: 10.416667,
      height: 18.518519,
      identity: 'salesLog',
      textColor: '#00A78B',
      border: 0.15625,
      borderColor: '#C9EBE6',
      onClick: handleButton,
    },
    {
      key: 3,
      backgroundColor: '#FFF',
      buttonText: 'BDC Log',
      buttonTextSize: 1.8,
      buttonIcon: <BdcLogIcon />,
      iconTextGap: 1,
      iconAbove: true,
      width: 10.416667,
      height: 18.518519,
      identity: 'bdcLog',
      textColor: '#00A78B',
      border: 0.15625,
      borderColor: '#C9EBE6',
      onClick: handleButton,
    },
    {
      key: 4,
      backgroundColor: '#FFF',
      buttonText: 'Funding Log',
      buttonTextSize: 1.8,
      buttonIcon: <FundingLogIcon />,
      iconTextGap: 1,
      iconAbove: true,
      width: 10.416667,
      height: 18.518519,
      identity: 'fundingLog',
      textColor: '#00A78B',
      border: 0.15625,
      borderColor: '#C9EBE6',
      onClick: handleButton,
    },
    {
      key: 5,
      backgroundColor: '#FFF',
      buttonText: 'Differed Report',
      buttonTextSize: 1.8,
      buttonIcon: <DifferedReportIcon />,
      iconTextGap: 1,
      iconAbove: true,
      width: 10.416667,
      height: 18.518519,
      identity: 'differedReport',
      textColor: '#00A78B',
      border: 0.15625,
      borderColor: '#C9EBE6',
      onClick: handleButton,
    },
  ];

  return (
    <ModalWindow top={-13.8} bottom={0}>
      <ModalContainer width={65.416667} marginTop={25.462963} height={46.666667}>
        <ModalContainerTitle title="Reports" closeWindowFunction={closeReports} />
        <ModalContent>
          {/* <ButtonContainer marginTop={0} widthFull justify="right">
            <Button
              backgroundColor="#00A78B"
              buttonText="Add own report"
              buttonTextSize={1.85}
              buttonIcon={<PlusIcon2 />}
              iconTextGap={1}
              height={5.462963}
              identity="addOwnReport"
              width={11.354167}
              textColor="#FFF"
              onClick={handleButton}
            />
          </ButtonContainer> */}
          <ContentRow cols={5} gap={3} marginTop={4.074074} centerContent>
            {buttonInfo.map((el) => (
              <Button
                key={el.key}
                buttonText={el.buttonText}
                backgroundColor={el.backgroundColor}
                height={el.height}
                identity={el.identity}
                textColor={el.textColor}
                width={el.width}
                buttonIcon={el.buttonIcon}
                onClick={el.onClick}
                border={el.border}
                borderColor={el.borderColor}
                buttonTextSize={el.buttonTextSize}
                iconAbove={el.iconAbove}
                iconTextGap={el.iconTextGap}
              />
            ))}
          </ContentRow>
        </ModalContent>
      </ModalContainer>
      <AnimatePresence>
        {openSalesLog && <SalesLog closeWindow={setOpenSalesLog} />}
        {openBdcLog && <BdcLog closeWindow={setOpenBdcLog} />}
        {openFundingLog && <FundingLog closeWindow={setOpenFundingLog} />}
        {openDifferedReport && <DifferedReport closeWindow={setOpenDifferedReport} />}
        {openStoreReport && <StoreReport closeWindow={setOpenStoreReport} />}
      </AnimatePresence>
    </ModalWindow>
  );
}
