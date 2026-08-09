import { AnimatePresence, motion } from 'framer-motion';
import { GeneralInfo } from '&/dashboard/cards/inventory/details/generalInfo/GeneralInfo';
import { TitleLicense } from '&/dashboard/cards/inventory/details/titleLicense/TitleLicense';
import { KeyInfo } from '&/dashboard/cards/inventory/details/keyInfo/KeyInfo';
import { detailsInventorySystemIndexStore } from '@/store/inventory';

export function Details() {
  // ----- global states -----

  const { detailsIndex } = detailsInventorySystemIndexStore();

  // ----- local states -----

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <AnimatePresence>{detailsIndex === 1 && <GeneralInfo />}</AnimatePresence>
      <AnimatePresence>{detailsIndex === 2 && <TitleLicense />}</AnimatePresence>
      <AnimatePresence>{detailsIndex === 3 && <KeyInfo />}</AnimatePresence>
    </motion.div>
  );
}
