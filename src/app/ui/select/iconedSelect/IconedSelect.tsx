import { SelectDropIcon } from '&/icons/Icons';
import useUiHandler from '@/hooks/closeComponentsHandler';

export function IconedSelect({
  height,
  width,
  borderRadius,
  backgroundColor,
  border,
  borderColor,
  defaultText,
  textColor,
  options,
  optionsBackgroundColor,
  optionsNameColor,
  optionsWidth,
  optionsHeight,
  optionsRight,
  optionsLeft,
  optionsBottom,
  optionsTop,
  optionsZIndex,
  iconTextGap,
  optionsRadius,
  onClick,
  label,
  optionsContainerHeight,
  optionsTextAlignCenter,
  optionsParagraphWidthFull,
  fontSize,
  labelBottom,
}: {
  width: number;
  height: number;
  borderRadius?: number;
  border?: number;
  borderColor?: string;
  backgroundColor?: string;
  defaultText?: string;
  textColor?: string;
  optionsWidth: number;
  optionsHeight: number;
  optionsBackgroundColor: string;
  optionsNameColor: string;
  iconTextGap: number;
  optionsRadius: number;
  optionsRight?: number;
  optionsLeft?: number;
  optionsBottom?: number;
  optionsTop?: number;
  optionsZIndex?: number;
  optionsTextAlignCenter?: boolean;
  optionsParagraphWidthFull?: boolean;
  optionsContainerHeight?: number;
  fontSize?: number;
  labelBottom?: number;
  options:
    | { value?: string; icon?: React.ReactNode; name?: string; identity?: string }[]
    | undefined;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  label?: string;
}) {
  // ----- global states -----

  // ----- local states -----

  const { isOpen, ref, toggleOpen } = useUiHandler();

  return (
    <div ref={ref} className="relative w-fit h-fit">
      {label && (
        <label
          htmlFor=""
          className="text-[#00A78B] font-medium"
          style={{
            fontSize: fontSize ? `${fontSize}vh` : '1.9vh',
            marginBottom: labelBottom ? `${labelBottom}vh` : '',
          }}
        >
          {label}
        </label>
      )}
      {/* select */}
      <button
        type="button"
        className="flex flex-row justify-between items-center px-[0.6vw] cursor-default"
        style={{
          width: `${width}vw`,
          height: `${height}vh`,
          borderRadius: `${borderRadius}vw`,
          borderWidth: `${border}vw`,
          borderColor: `${borderColor}`,
          backgroundColor: `${backgroundColor}`,
        }}
        onClick={toggleOpen}
      >
        <p className="text-[1.8vh] font-medium" style={{ color: `${textColor}` }}>
          {defaultText}
        </p>
        <SelectDropIcon color={borderColor} />
      </button>
      {/* options */}
      {isOpen && (
        <ul
          className={`absolute shadow-crmFormShadow ${
            optionsContainerHeight ? 'overflow-y-scroll' : ''
          }`}
          style={{
            width: `${optionsWidth}vw`,
            height: optionsContainerHeight ? `${optionsContainerHeight}vh` : '',
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
                key={index}
                className="w-full h-fit first:border-inherit"
                style={{ borderRadius: `${optionsRadius}vw` }}
              >
                <button
                  type="button"
                  value={el.value}
                  name={el.name}
                  data-identity={el.identity}
                  className="w-full flex flex-row items-center px-[0.6vw] hover:bg-secondaryColor transition-colors ease-in-out first:border-inherit"
                  style={{
                    height: `${optionsHeight}vh`,
                    gap: `${iconTextGap}vw`,
                    borderTopLeftRadius: `${index === 0 && `${optionsRadius}vw`}`,
                    borderTopRightRadius: `${index === 0 && `${optionsRadius}vw`}`,
                    borderBottomLeftRadius: `${
                      index === options.length - 1 && `${optionsRadius}vw`
                    }`,
                    borderBottomRightRadius: `${
                      index === options.length - 1 && `${optionsRadius}vw`
                    }`,
                  }}
                  onClick={(e) => {
                    onClick(e);
                    toggleOpen();
                  }}
                >
                  <p
                    className="text-[1.8vh] font-medium"
                    style={{
                      width: optionsParagraphWidthFull ? '100%' : 'fit-content',
                      color: `${optionsNameColor}`,
                      textAlign: optionsTextAlignCenter ? 'center' : 'start',
                    }}
                  >
                    {el.name}
                  </p>
                  {el.icon}
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
