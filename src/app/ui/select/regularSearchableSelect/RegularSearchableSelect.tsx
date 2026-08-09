import React, { useEffect, useState } from 'react';
import { SelectDropIcon, ThreeGreenDots } from '&/icons/Icons';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader } from '&/miscellaneous/loader/Loader';
import useUiHandler from '@/hooks/closeComponentsHandler';

export function RegularSearchableSelect({
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
  optionsWidth,
  optionsHeight,
  optionsRight,
  optionsLeft,
  optionsBottom,
  optionsTop,
  widthFull,
  optionsZIndex,
  iconTextGap,
  label,
  inputWidth,
  value,
  name,
  optionsRadius,
  onClick,
  fieldErrors,
  optionsContainerHeight,
  flex,
  optionsWidthFit,
  optionsWidthFull,
  flexColReverse,
  selectBtnBackgroundColor,
  selectBtnWidth,
  selectThreeDottedIcon,
  disabledInput,
  disabledButton,
  heightFull,
  selectBtnCursorPointer,
  loading,
  noTextSearch,
  labelLeft,
  labelFontSize,
  labelSameColor,
  optionsPaddingY,
  optionsCenter,
}: {
  flex?: boolean;
  flexColReverse?: boolean;
  width: number;
  widthFull?: boolean;
  height?: number;
  borderRadius?: number;
  border?: number;
  borderColor?: string;
  backgroundColor?: string;
  defaultText?: string;
  textColor?: string;
  optionsWidth: number;
  optionsWidthFull?: boolean;
  optionsWidthFit?: boolean;
  optionsHeight: number;
  optionsBackgroundColor: string;
  iconTextGap: number;
  optionsRadius: number;
  optionsRight?: number;
  disabledInput?: boolean;
  disabledButton?: boolean;
  optionsLeft?: number;
  optionsBottom?: number;
  optionsTop?: number;
  optionsZIndex?: number;
  optionsContainerHeight?: number;
  label: string;
  value?: string;
  inputWidth?: number;
  name: string;
  heightFull?: boolean;
  options?: { value?: string; icon?: React.ReactNode; name?: string; identity?: string }[];
  onClick: (value: string, identity?: string, name?: string) => void;
  fieldErrors?: { [key: string]: [string | undefined] };
  selectThreeDottedIcon?: boolean;
  selectBtnBackgroundColor?: string;
  selectBtnWidth?: number;
  selectBtnCursorPointer?: boolean;
  loading?: boolean;
  noTextSearch?: boolean;
  labelLeft?: boolean;
  labelFontSize?: number;
  labelSameColor?: boolean;
  optionsPaddingY?: number;
  optionsCenter?: boolean;
}) {
  // ----- global states -----

  // ----- local states -----

  const { isOpen, ref, toggleOpen } = useUiHandler();

  const [showOptions, setShowOptions] = useState(false);

  const [textValue, setTextValue] = useState('');

  const [filteredData, setFilteredData] = useState<
    { value?: string; icon?: React.ReactNode; name?: string; identity?: string }[] | undefined
  >(undefined);

  useEffect(() => {
    if (textValue && options && options.length > 0 && !noTextSearch) {
      setFilteredData(
        options?.filter((el) => {
          return el.name?.toLowerCase().trim().includes(textValue.toLowerCase().trim());
        }),
      );
    } else if (textValue === '' && options && options.length > 0) {
      setFilteredData(options);
    }
  }, [textValue, options, noTextSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;

    if (value !== '') setShowOptions(true);

    setTextValue(value);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value, name } = e.currentTarget;
    const { identity } = e.currentTarget.dataset;

    toggleOpen();

    onClick(value, identity, name);
  };

  useEffect(() => {
    if (!isOpen) {
      setShowOptions(false);
    } else {
      setShowOptions(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (value) {
      const optionSelected = filteredData?.find((el) => el.value === value);

      if (optionSelected) {
        if (optionSelected.name) setTextValue(optionSelected.name);
      }
    }
  }, [value, noTextSearch && filteredData]);

  const handleOverflow = () => {
    let overflow = false;

    const containerH = optionsContainerHeight;
    const totalOptions = filteredData?.length;

    if (containerH && totalOptions) {
      let totalPadding = 8;
      let valueForOperation = optionsHeight;

      if (optionsPaddingY) totalPadding = optionsPaddingY * 2;

      if (totalPadding > optionsHeight) valueForOperation = totalPadding;

      overflow = valueForOperation * totalOptions > containerH;
    }

    return overflow;
  };

  return (
    <article
      className="flex"
      style={{
        height: heightFull ? '100%' : '',
        flexDirection: labelLeft ? 'row' : 'column',
        gap: labelLeft ? '1vw' : '',
        alignItems: labelLeft ? 'center' : '',
      }}
    >
      {label && (
        <label
          htmlFor={name ? name : ''}
          className="w-fit font-medium"
          style={{
            marginBottom: labelLeft ? 0 : '1.666667vh',
            fontSize: labelFontSize ? `${labelFontSize}vh` : '1.626852vh',
            color: labelSameColor ? textColor : '#B3B3B3',
          }}
        >
          {label}
        </label>
      )}
      <div
        ref={ref}
        className="relative w-fit h-fit"
        style={{
          width: widthFull ? '100%' : `${width}vw`,
          height: heightFull ? '100%' : height ? `${height}vh` : '5.277778vh',
          display: flex ? 'flex' : 'block',
          flexDirection: flexColReverse ? 'column-reverse' : 'unset',
        }}
      >
        {loading && (
          <Loader
            props={{
              style: {
                borderRadius: 5,
              },
            }}
          />
        )}
        <aside onClick={(e) => e.stopPropagation()} className="h-full flex flex-row">
          <input
            type="text"
            autoComplete="off"
            value={textValue}
            name={name}
            disabled={disabledInput}
            placeholder={defaultText}
            className="flex flex-row justify-between items-center px-[0.6vw] outline-none rounded-l-[0.520833vw] text-[1.666667vh] font-medium leading-[1.805555vh] placeholder:text-[#959595]"
            style={{
              width: inputWidth ? `${inputWidth}%` : '80%',
              borderRadius: `${borderRadius}vw`,
              borderWidth: `${border}vw`,
              borderColor: `${borderColor}`,
              backgroundColor: backgroundColor ? `${backgroundColor}` : '#F4F4F4',
              color: textColor ? `${textColor}` : '#585858',
              cursor: noTextSearch ? 'default' : '',
              caretColor: noTextSearch ? (backgroundColor ? `${backgroundColor}` : '#F4F4F4') : '',
            }}
            onClick={toggleOpen}
            onChange={!noTextSearch ? handleChange : undefined}
          />
          <section
            onClick={toggleOpen}
            className="h-full rounded-r-[0.520833vw] flex justify-center items-center"
            style={{
              backgroundColor: selectBtnBackgroundColor ? selectBtnBackgroundColor : '#F4F4F4',
              width: selectBtnWidth ? `${selectBtnWidth}%` : '20%',
              cursor: selectBtnCursorPointer ? 'pointer' : 'default',
            }}
          >
            {selectThreeDottedIcon ? <ThreeGreenDots /> : <SelectDropIcon color="#00A78B" />}
          </section>
        </aside>
        {showOptions && (
          <ul
            className="absolute shadow-crmFormShadow"
            style={{
              width: optionsWidthFull
                ? '100%'
                : optionsWidthFit
                ? 'fit-content'
                : `${optionsWidth}vw`,
              maxHeight: `${optionsContainerHeight}vh`,
              backgroundColor: `${optionsBackgroundColor}`,
              borderRadius: `${optionsRadius}vw`,
              zIndex: optionsZIndex ? optionsZIndex : 3,
              left: `${optionsLeft}vw`,
              right: `${optionsRight}vw`,
              bottom: `${optionsBottom}vh`,
              top: `${optionsTop}vh`,
              overflowY: handleOverflow() ? 'scroll' : 'auto',
            }}
          >
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((el, index) => (
                <li
                  key={`${el.value}adderslct${index}$$`}
                  className="w-full h-fit first:border-inherit even:bg-secondaryColor"
                  style={{ borderRadius: `${optionsRadius}vw` }}
                >
                  <button
                    type="button"
                    value={el.value}
                    name={el.name}
                    data-identity={el.identity}
                    className="w-full flex flex-row items-center px-[0.6vw] hover:bg-primaryColor text-primaryColor hover:text-white transition-colors ease-in-out"
                    style={{
                      height: `${optionsHeight}vh`,
                      gap: `${iconTextGap}vw`,
                      borderTopLeftRadius: `${index === 0 && `${optionsRadius}vw`}`,
                      borderTopRightRadius: `${index === 0 && `${optionsRadius}vw`}`,
                      borderBottomLeftRadius: `${
                        index === filteredData.length - 1 && `${optionsRadius}vw`
                      }`,
                      borderBottomRightRadius: `${
                        index === filteredData.length - 1 && `${optionsRadius}vw`
                      }`,
                      paddingBottom: optionsPaddingY ? `${optionsPaddingY}vh` : '4vh',
                      paddingTop: optionsPaddingY ? `${optionsPaddingY}vh` : '4vh',
                      justifyContent: optionsCenter ? 'center' : '',
                    }}
                    onClick={handleClick}
                  >
                    <p className="text-[1.8vh] font-medium">{el.name}</p>
                    {el.icon}
                  </button>
                </li>
              ))
            ) : (
              <p
                className="flex justify-center items-center text-[1.8vh] font-medium text-primaryColor"
                style={{ height: `${optionsHeight}vh` }}
              >
                No Matches Found
              </p>
            )}
          </ul>
        )}
        <AnimatePresence>
          {fieldErrors && name && fieldErrors[name] && fieldErrors[name].length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute bottom-[-2.1vh] text-[1.666667vh] text-[#F00]"
            >
              {fieldErrors[name][0]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
}
