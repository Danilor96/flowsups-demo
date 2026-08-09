import { AnimatePresence, motion } from 'framer-motion';
import { StockStatus } from '&/miscellaneous/stockStatus/StockStatus';
import { Options } from '&/miscellaneous/statusPicker/options/Options';
import useUiHandler from '@/hooks/closeComponentsHandler';

export function StatusPicker({
  status,
  identity,
  itemId,
  options,
  optionsWidth,
  optionsHeight,
  optionsBackgroundColor,
  optionsRadius,
  optionsRight,
  optionsLeft,
  optionsBottom,
  optionsTop,
  optionsZIndex,
  noOpenItemOptions,
  onClick,
}: {
  status: number;
  identity: string;
  itemId: number;
  options?: { id?: number; option?: string }[];
  optionsWidth: number;
  optionsHeight: number;
  optionsBackgroundColor: string;
  optionsRadius: number;
  optionsRight?: number;
  optionsLeft?: number;
  optionsBottom?: number;
  optionsTop?: number;
  optionsZIndex?: number;
  noOpenItemOptions?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  const { isOpen, ref, toggleOpen } = useUiHandler();

  return (
    <article ref={ref} className="relative w-fit h-fit">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleOpen}
        data-id={itemId}
        className="w-fit h-fit"
      >
        <StockStatus status={status} />
      </motion.button>
      <AnimatePresence>
        {isOpen && !noOpenItemOptions && (
          <Options
            onClick={onClick}
            options={options}
            identity={identity}
            itemId={itemId}
            optionsBackgroundColor={optionsBackgroundColor}
            optionsHeight={optionsHeight}
            optionsRadius={optionsRadius}
            optionsWidth={optionsWidth}
            optionsBottom={optionsBottom}
            optionsLeft={optionsLeft}
            optionsRight={optionsRight}
            optionsTop={optionsTop}
            optionsZIndex={optionsZIndex}
          />
        )}
      </AnimatePresence>
    </article>
  );
}
