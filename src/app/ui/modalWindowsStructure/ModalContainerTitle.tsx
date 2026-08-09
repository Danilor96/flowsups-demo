import { motion } from 'framer-motion';
import { CloseWindow, NewTab } from '&/icons/Icons';
import { useLocalStorage } from '@/hooks/localStorage';
import { useEffect } from 'react';
import { modalWindowStore } from '@/store/adminDashboard';
import { reportsFiltersStore } from '@/store/filtersHandling';

export function ModalContainerTitle({
  title,
  closeWindowFunction,
  extraComponent,
  extraTitleComponent,
  openNewTab,
  directOpenUrl,
}: {
  title: string;
  closeWindowFunction: () => void;
  extraComponent?: React.ReactNode;
  extraTitleComponent?: React.ReactNode;
  openNewTab?: boolean;
  directOpenUrl?: string;
}) {
  // ----- global states -----

  const { toggleOpenInNewTab } = modalWindowStore();
  const clearDateFilter = reportsFiltersStore((state) => state.clearFilters);

  // ----- local states -----

  const [openInNewTab, setOpenInNewTab] = useLocalStorage('openInNewTab', false);

  useEffect(() => {
    toggleOpenInNewTab(openInNewTab);
  }, [openInNewTab, toggleOpenInNewTab]);

  const closeWindow = () => {
    closeWindowFunction();
    clearDateFilter();
  };

  return (
    <div className="w-full h-[9.259259vh] flex justify-center items-center shadow-crmFormShadow px-[1.927083vw]">
      <aside className="w-full flex justify-between items-center">
        <article
          style={{
            display: extraTitleComponent ? 'flex' : 'block',
            flexDirection: extraTitleComponent ? 'row' : 'unset',
            gap: extraTitleComponent ? '1vw' : '',
            alignItems: extraTitleComponent ? 'center' : 'unset',
          }}
        >
          <h2 className="text-[2.777778vh] font-semibold text-primaryColor">{title}</h2>
          {extraTitleComponent}
        </article>
        {extraComponent}

        <article className="flex flex-row items-center gap-[0.8vw]">
          {openNewTab && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              className="w-[2vw] h-[2vw] flex justify-center items-center overflow-hidden"
              onClick={() => {
                if (directOpenUrl && directOpenUrl.length > 0) {
                  window.open(directOpenUrl);

                  return;
                }

                setOpenInNewTab(!openInNewTab);
              }}
            >
              <NewTab
                color={
                  directOpenUrl && directOpenUrl.length > 0
                    ? '#3b82f6'
                    : openInNewTab
                    ? '#00a78b'
                    : '#cacaca'
                }
              />
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            className="w-[2.975vw] h-[2.975vw] flex justify-center items-center bg-white shadow-crmFormShadow rounded-md"
            onClick={() => closeWindow()}
          >
            <CloseWindow />
          </motion.button>
        </article>
      </aside>
    </div>
  );
}
