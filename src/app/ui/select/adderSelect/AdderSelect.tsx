import React, { useEffect, useState } from 'react';
import { CancelIcon, SelectDropIcon, ThreeGreenDots } from '&/icons/Icons';
import { AnimatePresence, motion } from 'framer-motion';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { modalWindowStore } from '@/store/adminDashboard';
import { DateBefore, DayOfWeek, DayPicker } from 'react-day-picker';
import { Loader } from '../../miscellaneous/loader/Loader';
import { DeleteBtn } from './deleteBtn/DeleteBtn';
import useUiHandler from '@/hooks/closeComponentsHandler';

export function AdderSelect({
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
  optionsHeightFit=false,
  optionsRight,
  optionsLeft,
  optionsBottom,
  optionsTop,
  textAlign,
  widthFull,
  optionsZIndex,
  iconTextGap,
  label,
  inputWidth,
  value,
  name,
  optionsRadius,
  optionsWithCategory,
  onChange,
  onClick,
  onBlur,
  onDatePicker,
  dateSelected,
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
  optionDateInput,
  loading,
  onDeleteClick,
  deleteItemBtn,
  justifyCenter,
  marginInlineAuto,
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
  optionsHeightFit?: boolean;
  textAlign?: string;
  optionsHeight: number;
  optionsBackgroundColor: string;
  optionsNameColor: string;
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
  optionsWithCategory?: {
    value?: string;
    icon?: React.ReactNode;
    name?: string;
    category?: { id: number; category: string };
    categoryId?: number;
    identity?: string;
  }[];
  label: string;
  value: string;
  inputWidth?: number;
  name: string;
  heightFull?: boolean;
  options?: {
    value?: string;
    icon?: React.ReactNode;
    name?: string;
    identity?: string;
    cancelBtn?: string;
  }[];
  optionDateInput?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onDatePicker?: (e: Date | undefined) => void;
  onDeleteClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  deleteItemBtn?: boolean;
  dateSelected?: Date | undefined;
  fieldErrors?: { [key: string]: [string | undefined] };
  selectThreeDottedIcon?: boolean;
  selectBtnBackgroundColor?: string;
  selectBtnWidth?: number;
  selectBtnCursorPointer?: boolean;
  loading?: boolean;
  justifyCenter?: boolean;
  marginInlineAuto?: boolean;
}) {
  // ----- global states -----

  const { openIconedSelectOptions, closeIconedSelectOptions } = modalWindowStore();
  const { iconedSelectOptions } = modalWindowStore();

  // ----- local states -----

  const dateBefore: DateBefore = {
    before: new Date(),
  };

  const dayOfWeew: DayOfWeek = {
    dayOfWeek: [0, 6],
  };

  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<
    { value?: string; icon?: React.ReactNode; name?: string; identity?: string }[] | undefined
  >(undefined);
  const [filteredDataWithCategory, setFilteredDataWithCategory] = useState<
    | {
        value?: string;
        icon?: React.ReactNode;
        name?: string;
        category?: { id: number; category: string };
        categoryId?: number;
        identity?: string;
      }[]
    | undefined
  >(undefined);

  useEffect(() => {
    if (value && options && options.length > 0) {
      setFilteredData(
        options?.filter((el) => {
          return el.name?.toLowerCase().trim().includes(value.toLowerCase().trim());
        }),
        // options,
      );
    } else if (value === '' && options && options.length > 0) {
      setFilteredData(options);
    } else if (value && optionsWithCategory && optionsWithCategory.length > 0) {
      setFilteredDataWithCategory(
        optionsWithCategory.filter((el) => {
          return el.name?.toLowerCase().trim().includes(value.toLowerCase().trim());
        }),
      );
    } else if (value === '' && optionsWithCategory && optionsWithCategory.length > 0) {
      setFilteredDataWithCategory(optionsWithCategory);
    }
  }, [value, options, optionsWithCategory]);

  const { isOpen, ref, toggleOpen } = useUiHandler();

  useEffect(() => {
    if (!iconedSelectOptions) {
      setShowOptions(false);
    }
  }, [iconedSelectOptions]);

  return (
    <article
      className="flex flex-col"
      style={{
        height: heightFull ? '100%' : '',
      }}
    >
      {label && (
        <label
          htmlFor={name ? name : ''}
          className="w-fit mb-[1.666667vh] text-[1.626852vh] font-medium text-[#B3B3B3]"
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
        {/* select */}
        <aside onClick={(e) => e.stopPropagation()} className="h-full flex flex-row">
          <input
            type="text"
            autoComplete="off"
            value={value}
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
            }}
            onClick={toggleOpen}
            onChange={(e) => {
              if (e.currentTarget.value !== '') {
                setShowOptions(true);
                openIconedSelectOptions();

                if (!isOpen) {
                  toggleOpen();
                }
              } else {
                setShowOptions(false);
              }
              onChange(e);
            }}
            onBlur={onBlur}
          />
          <section
            onClick={async () => {
              await closeIconedSelectOptions();
              openIconedSelectOptions();
              // !disabledButton && setShowOptions(!showOptions);
              !disabledButton && toggleOpen();
            }}
            className="h-full rounded-r-[0.520833vw] flex justify-center items-center"
            style={{
              backgroundColor: selectBtnBackgroundColor ? selectBtnBackgroundColor : '#F4F4F4',
              width: selectBtnWidth ? `${selectBtnWidth}%` : '20%',
              cursor: !disabledButton
                ? selectBtnCursorPointer
                  ? 'pointer'
                  : 'default'
                : 'default',
              borderWidth: `${border}vw`,
              borderColor: `${borderColor}`,
            }}
          >
            {selectThreeDottedIcon ? <ThreeGreenDots /> : <SelectDropIcon color="#00A78B" />}
          </section>
        </aside>
        {/* options */}
        {isOpen && (
          <ul
            className="absolute shadow-crmFormShadow overflow-y-scroll"
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
            }}
          >
            {!optionDateInput &&
              filteredData &&
              !optionsWithCategory &&
              filteredData.map((el, index) => (
                <li
                  key={`${el.value}adderslct${index}$$`}
                  className="relative w-full h-fit first:border-inherit"
                  style={{ borderRadius: `${optionsRadius}vw` }}
                >
                  <button
                    type="button"
                    value={el.value}
                    name={el.name}
                    data-identity={el.identity}
                    className="w-full flex flex-row items-center px-[0.6vw] hover:bg-secondaryColor transition-colors ease-in-out first:border-inherit"
                    style={{
                      height: optionsHeightFit ? 'fit-content' : `${optionsHeight}vh`,
                      gap: `${iconTextGap}vw`,
                      borderTopLeftRadius: `${index === 0 && `${optionsRadius}vw`}`,
                      borderTopRightRadius: `${index === 0 && `${optionsRadius}vw`}`,
                      borderBottomLeftRadius: `${
                        index === filteredData.length - 1 && `${optionsRadius}vw`
                      }`,
                      borderBottomRightRadius: `${
                        index === filteredData.length - 1 && `${optionsRadius}vw`
                      }`,
                      justifyContent: justifyCenter ? 'center' : '',
                      textAlign: textAlign ? textAlign as any : undefined,
                      paddingBlock: optionsHeightFit ? '0.5vh' : undefined,
                    }}
                    onClick={(e) => {
                      onClick(e);
                      setShowOptions(false);
                      toggleOpen();
                    }}
                  >
                    <p
                      className="text-[1.8vh] font-medium"
                      style={{ color: `${optionsNameColor}` }}
                    >
                      {el.name}
                    </p>
                    {el.icon && el.icon}
                  </button>
                  {deleteItemBtn && <DeleteBtn itemId={el.value} onClick={onDeleteClick} />}
                </li>
              ))}
            {!optionDateInput &&
              optionsWithCategory &&
              filteredDataWithCategory &&
              filteredDataWithCategory.map((el, index) => (
                <li
                  key={`${el.value}adderslctfilter${index * (13 + index)}$$`}
                  className="w-full h-fit first:border-inherit text-wrap"
                  style={{ borderRadius: `${optionsRadius}vw` }}
                >
                  <Paragraph marginLeft={0.3}>{el.category?.category}</Paragraph>
                  <button
                    type="button"
                    value={el.value}
                    name={el.name}
                    data-identity={el.identity}
                    data-category={el.category?.category}
                    className="w-full flex flex-row items-center px-[0.6vw] hover:bg-secondaryColor transition-colors ease-in-out first:border-inherit"
                    style={{
                      height: `${optionsHeight}vh`,
                      gap: `${iconTextGap}vw`,
                      borderTopLeftRadius: `${index === 0 && `${optionsRadius}vw`}`,
                      borderTopRightRadius: `${index === 0 && `${optionsRadius}vw`}`,
                      borderBottomLeftRadius: `${
                        index === filteredDataWithCategory.length - 1 && `${optionsRadius}vw`
                      }`,
                      borderBottomRightRadius: `${
                        index === filteredDataWithCategory.length - 1 && `${optionsRadius}vw`
                      }`,
                    }}
                    onClick={(e) => {
                      onClick(e);
                      setShowOptions(false);
                      toggleOpen();
                    }}
                  >
                    <p
                      className="text-[1.8vh] font-medium"
                      style={{
                        color: `${optionsNameColor}`,
                        marginInline: marginInlineAuto ? 'auto' : '',
                      }}
                    >
                      {el.name}
                    </p>
                    {el.icon}
                  </button>
                </li>
              ))}
            {optionDateInput && (
              <DayPicker
                mode="single"
                onSelect={onDatePicker}
                selected={dateSelected}
                disabled={[dateBefore, dayOfWeew]}
                className="text-[#00A78B] text-[2.1vh]"
                styles={{
                  day_button: { width: '2.5vw', height: '6vh' },
                  month_caption: { paddingInline: '1vw' },
                  chevron: { fill: '#F00' },
                }}
              />
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
