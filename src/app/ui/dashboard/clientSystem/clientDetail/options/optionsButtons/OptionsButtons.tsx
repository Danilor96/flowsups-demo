import { modalWindowStore } from '@/store/adminDashboard';
import { OptionButton } from './optionButton/OptionButton';
import { AnimatePresence } from 'framer-motion';
import { CreditApp } from '../creditApp/CreditApp';
import { Lead } from '../lead/Lead';
import { Events } from '../events/Events';
import { Referrer } from '../referrer/Referrer';
import { Files } from '../files/Files';
import { Vehicle } from '../vehicle/Vehicle';
import { Cobuyer } from '../cobuyer/Cobuyer';

export function OptionsButtons({ handleOpenCreditApp }: { handleOpenCreditApp: () => void }) {
  // ----- global states -----

  const {
    clientCobuyer,
    clientVehicle,
    clientCreditApp,
    clientLead,
    clientEvents,
    clientReferrer,
    clientFiles,
  } = modalWindowStore();

  const {
    openClientEvents,
    openClientLead,
    openClientCobuyer,
    openClientVehicle,
    openClientFiles,
    openClientReferrer,
  } = modalWindowStore();

  // ----- local states -----

  const buttons = [
    {
      onClick: openClientEvents,
      label: 'Events',
      style: { top: 45, left: 5 },
    },
    {
      onClick: openClientLead,
      label: 'Lead',
      style: { top: 30, left: 0 },
    },
    {
      onClick: handleOpenCreditApp,
      label: 'Credit-App',
      style: { top: 10, left: 1 },
    },
    {
      onClick: openClientCobuyer,
      label: 'Cobuyer',
      style: { top: 0, left: 10 },
    },
    {
      onClick: openClientVehicle,
      label: 'Trade in',
      style: { top: 10, left: 19 },
    },
    {
      onClick: openClientFiles,
      label: 'Files',
      style: { top: 30, left: 20 },
    },
    {
      onClick: openClientReferrer,
      label: 'Referrer',
      style: { top: 45, left: 15 },
    },
  ];

  return (
    <>
      <ul className="relative w-[26.038021vw] h-[58.3vh]">
        {buttons.map((el, index) => (
          <li key={`${index - 12}buttonsOptions${index * index + 34}`}>
            <OptionButton
              option={el.label}
              onClick={el.onClick}
              top={el.style.top}
              left={el.style.left}
            />
          </li>
        ))}
      </ul>
      <AnimatePresence>{clientCobuyer && <Cobuyer />}</AnimatePresence>
      <AnimatePresence>{clientVehicle && <Vehicle />}</AnimatePresence>
      <AnimatePresence>{clientFiles && <Files />}</AnimatePresence>
      <AnimatePresence>{clientReferrer && <Referrer />}</AnimatePresence>
      <AnimatePresence>{clientEvents && <Events />}</AnimatePresence>
      <AnimatePresence>{clientLead && <Lead />}</AnimatePresence>
      <AnimatePresence>{clientCreditApp && <CreditApp />}</AnimatePresence>
    </>
  );
}
