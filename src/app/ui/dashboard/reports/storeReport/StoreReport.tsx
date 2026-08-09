import { useState } from 'react';
import { CloseWindow } from '@/app/libs/definitions';
import { AnimatePresence } from 'framer-motion';
import { Button } from '&/buttons/Button';
import {
  ActivitiesReportIcon,
  ApprovedNotSoldIcon,
  ApptActivityIcon,
  BirthdayReportIcon,
  BulkSmsReportIcon,
  CallActivityIcon,
  CommissionReportIcon,
  CreditAppReportIcon,
  ReferrerReportIcon,
  RoiSourcesIcon,
  SalesActivityIcon,
  SalesConversionIcon,
  SalesLeaderboardIcon,
  SalesRepScoreCardIcon,
  SmsReportIcon,
  SoldCustomerIcon,
  TasksActivityIcon,
  VisitReportSmsIcon,
} from '&/icons/Icons';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { SalesActivity } from '&/dashboard/reports/storeReport/salesActivity/SalesActivity';
import { CallActivity } from '&/dashboard/reports/storeReport/callActivity/CallActivity';
import { ApptActivity } from '&/dashboard/reports/storeReport/apptActivity/ApptActivity';
import { SalesConversion } from '&/dashboard/reports/storeReport/salesConversion/SalesConversion';
import { SalesRepScoreCard } from '&/dashboard/reports/storeReport/salesRepScoreCard/SalesRepScoreCard';
import { SoldCustomer } from '&/dashboard/reports/storeReport/soldCustomer/SoldCustomer';
import { VisitReport } from '&/dashboard/reports/storeReport/visitReport/VisitReport';
import { SmsReport } from '&/dashboard/reports/storeReport/smsReport/SmsReport';
import { CreditAppReport } from '&/dashboard/reports/storeReport/creditAppReport/CreditAppReport';
import { ActivitiesReport } from '&/dashboard/reports/storeReport/activitiesReport/ActivitiesReport';
import { BirthdayReport } from '&/dashboard/reports/storeReport/birthdayReport/BirthdayReport';
import { TaskActivity } from './taskActivity/TaskActivity';
import { SmsBulkReport } from './smsBulkReport/SmsBulkReport';
import { ReferrerReport } from './referrerReport/ReferrerReport';
import { ComissionReport } from './commisionReport/ComissionReport';
import { SalesLeaderBoard } from './salesLeaderBoard/SalesLeaderBoard';

export function StoreReport({ closeWindow }: CloseWindow) {
  // ----- global states -----

  // ----- local states -----

  const [openSalesActivity, setOpenSalesActivity] = useState<boolean>(false);
  const [openCallActivity, setOpenCallActivity] = useState<boolean>(false);
  const [openApptActivity, setOpenApptActivity] = useState<boolean>(false);
  const [openSalesConversion, setOpenSalesConversion] = useState<boolean>(false);
  const [openSalesLeaderBoard, setOpenSalesLeaderBoard] = useState<boolean>(false);
  const [openSalesRepScoreCard, setOpenSalesRepScoreCard] = useState<boolean>(false);
  const [openSoldCustomer, setOpenSoldCustomer] = useState<boolean>(false);
  const [openVisitReport, setOpenVisitReport] = useState<boolean>(false);
  const [openSmsReport, setOpenSmsReport] = useState<boolean>(false);
  const [openSmsBulkReport, setOpenSmsBulkReport] = useState<boolean>(false);
  const [openCreditAppReport, setOpenCreditAppReport] = useState<boolean>(false);
  const [openActivitiesReport, setOpenActivitiesReport] = useState<boolean>(false);
  const [openBirthdayReport, setOpenBirthdayReport] = useState<boolean>(false);
  const [openTaskActivity, setOpenTaskActivity] = useState<boolean>(false);
  const [openReferrerReport, setOpenReferrerReport] = useState<boolean>(false);
  const [openComissionReport, setOpenComissionReport] = useState<boolean>(false);

  // handling close current window
  const handleCloseWindow = () => {
    closeWindow(false);
  };

  const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    identity === 'salesActivity' && setOpenSalesActivity(true);

    identity === 'callActivity' && setOpenCallActivity(true);

    identity === 'apptActivity' && setOpenApptActivity(true);

    identity === 'salesConversion' && setOpenSalesConversion(true);

    identity === 'salesLeaderBoard' && setOpenSalesLeaderBoard(true);

    identity === 'salesRepScoreCard' && setOpenSalesRepScoreCard(true);

    identity === 'soldCustomer' && setOpenSoldCustomer(true);

    identity === 'visitReportSms' && setOpenVisitReport(true);

    identity === 'smsReport' && setOpenSmsReport(true);

    identity === 'smsBulkReport' && setOpenSmsBulkReport(true);

    identity === 'creditAppReport' && setOpenCreditAppReport(true);

    identity === 'activitiesReport' && setOpenActivitiesReport(true);

    identity === 'birthdayReport' && setOpenBirthdayReport(true);

    identity === 'tasksActivity' && setOpenTaskActivity(true);

    identity === 'referrerReport' && setOpenReferrerReport(true);

    identity === 'commissionReport' && setOpenComissionReport(true);
  };

  // button info
  const buttonInfo = [
    {
      key: 1,
      backgroundColor: '#FFF',
      buttonText: 'Sales Activity',
      buttonTextSize: 1.8,
      buttonIcon: <SalesActivityIcon />,
      iconTextGap: 1,
      iconAbove: true,
      width: 10.416667,
      height: 18.518519,
      identity: 'salesActivity',
      textColor: '#00A78B',
      border: 0.15625,
      borderColor: '#C9EBE6',
      onClick: handleButton,
    },
    {
      key: 2,
      backgroundColor: '#FFF',
      buttonText: 'Call Activity',
      buttonTextSize: 1.8,
      buttonIcon: <CallActivityIcon />,
      iconTextGap: 1,
      iconAbove: true,
      width: 10.416667,
      height: 18.518519,
      identity: 'callActivity',
      textColor: '#00A78B',
      border: 0.15625,
      borderColor: '#C9EBE6',
      onClick: handleButton,
    },
    {
      key: 3,
      backgroundColor: '#FFF',
      buttonText: 'Appt Activity',
      buttonTextSize: 1.8,
      buttonIcon: <ApptActivityIcon />,
      iconTextGap: 1,
      iconAbove: true,
      width: 10.416667,
      height: 18.518519,
      identity: 'apptActivity',
      textColor: '#00A78B',
      border: 0.15625,
      borderColor: '#C9EBE6',
      onClick: handleButton,
    },
    {
      key: 4,
      backgroundColor: '#FFF',
      buttonText: 'Task Activity',
      buttonTextSize: 1.8,
      buttonIcon: <TasksActivityIcon />,
      iconTextGap: 1,
      iconAbove: true,
      width: 10.416667,
      height: 18.518519,
      identity: 'tasksActivity',
      textColor: '#00A78B',
      border: 0.15625,
      borderColor: '#C9EBE6',
      onClick: handleButton,
    },
    {
      key: 5,
      backgroundColor: '#FFF',
      buttonText: 'Sales Conversion',
      buttonTextSize: 1.8,
      buttonIcon: <SalesConversionIcon />,
      iconTextGap: 1,
      iconAbove: true,
      width: 10.416667,
      height: 18.518519,
      identity: 'salesConversion',
      textColor: '#00A78B',
      border: 0.15625,
      borderColor: '#C9EBE6',
      onClick: handleButton,
    },
    {
      key: 6,
      backgroundColor: '#FFF',
      buttonText: 'Sales Leader Board',
      buttonTextSize: 1.8,
      buttonIcon: <SalesLeaderboardIcon />,
      iconTextGap: 1,
      iconAbove: true,
      width: 10.416667,
      height: 18.518519,
      identity: 'salesLeaderBoard',
      textColor: '#00A78B',
      border: 0.15625,
      borderColor: '#C9EBE6',
      onClick: handleButton,
    },
    {
      key: 7,
      backgroundColor: '#FFF',
      buttonText: 'Sales Rep Score Card',
      buttonTextSize: 1.8,
      buttonIcon: <SalesRepScoreCardIcon />,
      iconTextGap: 1,
      iconAbove: true,
      width: 10.416667,
      height: 18.518519,
      identity: 'salesRepScoreCard',
      textColor: '#00A78B',
      border: 0.15625,
      borderColor: '#C9EBE6',
      onClick: handleButton,
    },
    {
      key: 8,
      backgroundColor: '#FFF',
      buttonText: 'Sold Customer',
      buttonTextSize: 1.8,
      buttonIcon: <SoldCustomerIcon />,
      iconTextGap: 1,
      iconAbove: true,
      width: 10.416667,
      height: 18.518519,
      identity: 'soldCustomer',
      textColor: '#00A78B',
      border: 0.15625,
      borderColor: '#C9EBE6',
      onClick: handleButton,
    },
    {
      key: 9,
      backgroundColor: '#FFF',
      buttonText: 'Visit Report',
      buttonTextSize: 1.8,
      buttonIcon: <VisitReportSmsIcon />,
      iconTextGap: 1,
      iconAbove: true,
      width: 10.416667,
      height: 18.518519,
      identity: 'visitReportSms',
      textColor: '#00A78B',
      border: 0.15625,
      borderColor: '#C9EBE6',
      onClick: handleButton,
    },
    {
      key: 10,
      backgroundColor: '#FFF',
      buttonText: 'SMS Report',
      buttonTextSize: 1.8,
      buttonIcon: <SmsReportIcon />,
      iconTextGap: 1,
      iconAbove: true,
      width: 10.416667,
      height: 18.518519,
      identity: 'smsReport',
      textColor: '#00A78B',
      border: 0.15625,
      borderColor: '#C9EBE6',
      onClick: handleButton,
    },
    {
      key: 10.5,
      backgroundColor: '#FFF',
      buttonText: 'Bulk SMS Report',
      buttonTextSize: 1.8,
      buttonIcon: <BulkSmsReportIcon />,
      iconTextGap: 1,
      iconAbove: true,
      width: 10.416667,
      height: 18.518519,
      identity: 'smsBulkReport',
      textColor: '#00A78B',
      border: 0.15625,
      borderColor: '#C9EBE6',
      onClick: handleButton,
    },
    {
      key: 11,
      backgroundColor: '#FFF',
      buttonText: 'Credit App Report',
      buttonTextSize: 1.8,
      buttonIcon: <CreditAppReportIcon />,
      iconTextGap: 1,
      iconAbove: true,
      width: 10.416667,
      height: 18.518519,
      identity: 'creditAppReport',
      textColor: '#00A78B',
      border: 0.15625,
      borderColor: '#C9EBE6',
      onClick: handleButton,
    },
    {
      key: 12,
      backgroundColor: '#FFF',
      buttonText: 'Activities Report',
      buttonTextSize: 1.8,
      buttonIcon: <ActivitiesReportIcon />,
      iconTextGap: 1,
      iconAbove: true,
      width: 10.416667,
      height: 18.518519,
      identity: 'activitiesReport',
      textColor: '#00A78B',
      border: 0.15625,
      borderColor: '#C9EBE6',
      onClick: handleButton,
    },
    {
      key: 13,
      backgroundColor: '#FFF',
      buttonText: 'Birthday Report',
      buttonTextSize: 1.8,
      buttonIcon: <BirthdayReportIcon />,
      iconTextGap: 1,
      iconAbove: true,
      width: 10.416667,
      height: 18.518519,
      identity: 'birthdayReport',
      textColor: '#00A78B',
      border: 0.15625,
      borderColor: '#C9EBE6',
      onClick: handleButton,
    },
    // {
    //   key: 14,
    //   backgroundColor: '#FFF',
    //   buttonText: 'Approved Not Sold',
    //   buttonTextSize: 1.8,
    //   buttonIcon: <ApprovedNotSoldIcon />,
    //   iconTextGap: 1,
    //   iconAbove: true,
    //   width: 10.416667,
    //   height: 18.518519,
    //   identity: 'approvedNotSold',
    //   textColor: '#00A78B',
    //   border: 0.15625,
    //   borderColor: '#C9EBE6',
    //   onClick: handleButton,
    // },
    // {
    //   key: 15,
    //   backgroundColor: '#FFF',
    //   buttonText: 'ROI Sources',
    //   buttonTextSize: 1.8,
    //   buttonIcon: <RoiSourcesIcon />,
    //   iconTextGap: 1,
    //   iconAbove: true,
    //   width: 10.416667,
    //   height: 18.518519,
    //   identity: 'roiSources',
    //   textColor: '#00A78B',
    //   border: 0.15625,
    //   borderColor: '#C9EBE6',
    //   onClick: handleButton,
    // },
    {
      key: 16,
      backgroundColor: '#FFF',
      buttonText: 'Referrer Report',
      buttonTextSize: 1.8,
      buttonIcon: <ReferrerReportIcon />,
      iconTextGap: 1,
      iconAbove: true,
      width: 10.416667,
      height: 18.518519,
      identity: 'referrerReport',
      textColor: '#00A78B',
      border: 0.15625,
      borderColor: '#C9EBE6',
      onClick: handleButton,
    },
    {
      key: 17,
      backgroundColor: '#FFF',
      buttonText: 'Commission Report',
      buttonTextSize: 1.8,
      buttonIcon: <CommissionReportIcon />,
      iconTextGap: 1,
      iconAbove: true,
      width: 10.416667,
      height: 18.518519,
      identity: 'commissionReport',
      textColor: '#00A78B',
      border: 0.15625,
      borderColor: '#C9EBE6',
      onClick: handleButton,
    },
  ];

  return (
    <ModalWindow top={0}>
      <ModalContainer width={96.458333} marginTop={6.296296}>
        <ModalContainerTitle title="Store Report" closeWindowFunction={handleCloseWindow} />
        <ModalContent>
          <ContentRow cols={7} gap={6} centerContent>
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
        <AnimatePresence>
          {openSalesActivity && <SalesActivity closeWindow={setOpenSalesActivity} />}
          {openCallActivity && <CallActivity closeWindow={setOpenCallActivity} />}
          {openApptActivity && <ApptActivity closeWindow={setOpenApptActivity} />}
          {openSalesConversion && <SalesConversion closeWindow={setOpenSalesConversion} />}
          {openSalesLeaderBoard && <SalesLeaderBoard closeWindow={setOpenSalesLeaderBoard} />}
          {openSalesRepScoreCard && <SalesRepScoreCard closeWindow={setOpenSalesRepScoreCard} />}
          {openSoldCustomer && <SoldCustomer closeWindow={setOpenSoldCustomer} />}
          {openVisitReport && <VisitReport closeWindow={setOpenVisitReport} />}
          {openSmsReport && <SmsReport closeWindow={setOpenSmsReport} />}
          {openSmsBulkReport && <SmsBulkReport closeWindow={setOpenSmsBulkReport} />}
          {openCreditAppReport && <CreditAppReport closeWindow={setOpenCreditAppReport} />}
          {openActivitiesReport && <ActivitiesReport closeWindow={setOpenActivitiesReport} />}
          {openBirthdayReport && <BirthdayReport closeWindow={setOpenBirthdayReport} />}
          {openTaskActivity && <TaskActivity closeWindow={setOpenTaskActivity} />}
          {openReferrerReport && (
            <ReferrerReport closeFunction={() => setOpenReferrerReport(false)} />
          )}
          {openComissionReport && <ComissionReport closeFn={() => setOpenComissionReport(false)} />}
        </AnimatePresence>
      </ModalContainer>
    </ModalWindow>
  );
}
