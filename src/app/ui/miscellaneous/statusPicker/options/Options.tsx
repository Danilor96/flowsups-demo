import { StockStatus } from '&/miscellaneous/stockStatus/StockStatus';
import { motion } from 'framer-motion';

export function Options({
  options,
  identity,
  optionsWidth,
  optionsHeight,
  optionsBackgroundColor,
  optionsRadius,
  optionsRight,
  optionsLeft,
  optionsBottom,
  optionsTop,
  optionsZIndex,
  itemId,
  onClick,
}: {
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
  identity: string;
  itemId: number;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <motion.ul
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute shadow-crmFormShadow"
      style={{
        width: `${optionsWidth}vw`,
        backgroundColor: `${optionsBackgroundColor}`,
        borderRadius: `${optionsRadius}vw`,
        zIndex: optionsZIndex ? optionsZIndex : 3,
        left: `${optionsLeft}vw`,
        right: `${optionsRight}vw`,
        bottom: `${optionsBottom}vh`,
        top: `${optionsTop}vh`,
      }}
    >
      {options &&
        options.map((el, index) => (
          <li
            key={el.id}
            className="w-full h-fit first:border-inherit"
            style={{ borderRadius: `${optionsRadius}vw` }}
          >
            <button
              type="button"
              value={el.id}
              name={el.option}
              data-identity={identity}
              data-item={itemId}
              className="w-full flex flex-row items-center px-[0.6vw] hover:bg-secondaryColor transition-colors ease-in-out first:border-inherit"
              style={{
                height: `${optionsHeight}vh`,
                borderTopLeftRadius: `${index === 0 && `${optionsRadius}vw`}`,
                borderTopRightRadius: `${index === 0 && `${optionsRadius}vw`}`,
                borderBottomLeftRadius: `${index === options.length - 1 && `${optionsRadius}vw`}`,
                borderBottomRightRadius: `${index === options.length - 1 && `${optionsRadius}vw`}`,
              }}
              onClick={onClick}
            >
              <StockStatus status={el.id ? el.id : 5} />
            </button>
          </li>
        ))}
    </motion.ul>
  );
}
