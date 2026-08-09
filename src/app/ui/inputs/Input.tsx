import { AnimatePresence, motion } from 'framer-motion';
import { CalendarIcon, EyeClosed, EyeIcon, SearchLens, ThreeGreenDots } from '&/icons/Icons';
import React, { useEffect, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { adminDashboardStore } from '@/store/adminDashboard';
import inputTypeDateFormatStore from '@/store/inputTypeDateFormat';
import useUiHandler from '@/hooks/closeComponentsHandler';
import { CustomCheckbox } from './customCheckbox/CustomCheckbox';
import { CustomCheckboxTwo } from './customCheckbox/CustomCheckboxTwo';
import { differenceInHours, startOfDay } from 'date-fns';
import { IsLoadingComponent } from './isLoadingComponent/IsLoadingComponent';
import { CustomDayPickerDropdown } from './CustomDayPickerDropdown';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useInteractions,
  FloatingPortal,
} from '@floating-ui/react';
import { handlingCapitalWords } from '@/app/libs/functions/inputs/inputsFunction';

export function Input({
  type,
  name,
  chekcboxText,
  label,
  width,
  height,
  inputWidth,
  selectBtnWidth,
  value,
  border,
  borderColor,
  textAlterColor,
  placeHolderColor,
  borderRadius,
  options,
  optionsPositionTop,
  backgroundColor,
  labelRight,
  labelLeft,
  colGridSpan,
  onChange,
  onDayPickerClick,
  onTimeChanged,
  identity,
  fieldErrors,
  setFieldErrors,
  placeholder,
  marginLeft,
  disabled,
  maxDateAge,
  threeDotsDateInput,
  inputDate,
  max,
  customCheckbox,
  index,
  min,
  searchLensIcon,
  labelSameColor,
  fieldErrorWidthMaxContent,
  fieldErrorTop,
  dayPickerDisabledDayOfWeek,
  dayPickerDisabledAfter,
  defaultMonth,
  fetchTimeData,
  timeDataValue,
  dayPickerDisabledbefore,
  fontSize,
  labelFontSize,
  limitDateTime,
  uniqueIdPrefix,
  widthFull,
  fieldErrorFontSize,
  noDisabledBgColor,
  mobileDottedDate,
  fieldErrorBgWhite,
  specialComponent,
  dontCloseDatePickerAfterPick,
  showTimeAdvise,
  noDatePickerYearSelect,
  labelTop,
  labelBottom,
  labelColor,
  disabledDayPickerBtn,
  dayPickerTop,
  dayPickerBottom,
  dayPickerRight,
  dayPickerLeft,
  stopPropagationOnClick,
  isLoading,
  enableFloating,
  countryPhoneCode,
  capitalString,
}: {
  type: string | undefined;
  name: string | undefined;
  label: string | undefined;
  chekcboxText?: string;
  border?: number;
  borderColor?: string;
  textAlterColor?: string;
  placeHolderColor?: string;
  borderRadius?: number;
  width: number | undefined;
  height?: number;
  inputWidth?: number;
  selectBtnWidth?: number;
  marginLeft?: number;
  index?: number;
  placeholder?: string;
  labelSameColor?: boolean;
  colGridSpan?: number;
  value: string | undefined;
  labelRight?: boolean;
  labelLeft?: boolean;
  threeDotsDateInput?: boolean;
  inputDate?: boolean;
  backgroundColor?: string;
  searchLensIcon?: boolean;
  options?: { value: number | undefined; option: string | undefined }[];
  optionsPositionTop?: true;
  uniqueIdPrefix?: string;
  onDayPickerClick?: (e: Date, index?: number) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onTimeChanged?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  identity?: string;
  fieldErrors?: { [key: string]: [string | undefined] };
  setFieldErrors?: React.Dispatch<React.SetStateAction<{ [key: string]: [string | undefined] }>>;
  disabled?: boolean;
  maxDateAge?: boolean;
  min?: number;
  max?: number;
  limitDateTime?: number;
  dontCloseDatePickerAfterPick?: boolean;
  showTimeAdvise?: boolean;
  noDatePickerYearSelect?: boolean;
  customCheckbox?: boolean;
  fieldErrorWidthMaxContent?: boolean;
  fieldErrorTop?: number;
  dayPickerDisabledDayOfWeek?: number[];
  dayPickerDisabledbefore?: Date;
  dayPickerDisabledAfter?: Date;
  dayPickerTop?: string;
  dayPickerBottom?: string;
  dayPickerRight?: string;
  dayPickerLeft?: string;
  defaultMonth?: Date;
  fetchTimeData?: boolean;
  timeDataValue?: string;
  fontSize?: number;
  widthFull?: boolean;
  labelFontSize?: number;
  fieldErrorFontSize?: number;
  fieldErrorBgWhite?: boolean;
  mobileDottedDate?: boolean;
  noDisabledBgColor?: boolean;
  disabledDayPickerBtn?: boolean;
  specialComponent?: React.ReactNode;
  labelTop?: number;
  labelBottom?: number;
  labelColor?: string;
  stopPropagationOnClick?: boolean;
  isLoading?: boolean;
  enableFloating?: boolean;
  countryPhoneCode?: string;
  capitalString?: boolean;
}) {
  const { isOpen, ref: uiHandlerRef, toggleOpen } = useUiHandler();

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      if (open !== isOpen) toggleOpen();
    },
    middleware: [offset(5), flip(), shift()],
    whileElementsMounted: autoUpdate,
    placement: 'bottom-start',
  });

  const dismiss = useDismiss(context, { enabled: !!enableFloating });
  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss]);

  const { dayTime } = adminDashboardStore();
  const { getDayTime } = adminDashboardStore();

  const { formatDate } = inputTypeDateFormatStore();

  const today = new Date();
  const year = today.getFullYear() - 18;
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const maxDate = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;

  const inputsTypeIgnored = ['checkbox', 'select', 'DottedDate', 'password'];

  const [passwordInput, setPasswordInput] = useState<boolean>(true);
  // const [localFieldErrors, setLocalFieldErrors] = useState<any>();

  useEffect(() => {
    if (fetchTimeData) {
      getDayTime();
    }
  }, [getDayTime, fetchTimeData]);

  const convertTo24Hours = (time: string) => {
    const [hour, minutes, period] = time.split(/:| /);
    let hora24 = parseInt(hour);

    if (period.toLowerCase() === 'pm' && hora24 !== 12) {
      hora24 += 12;
    } else if (period.toLowerCase() === 'am' && hora24 === 12) {
      hora24 = 0;
    }

    return {
      hour: hora24,
      minutes: parseInt(minutes),
    };
  };

  const handlingDayTime = () => {
    if (!dayTime) {
      return [];
    }

    const optionsToRender = [];
    let limitCount = 0;

    for (let i = 0; i < dayTime.length; i++) {
      const time = dayTime[i];

      const disabledDay = dayPickerDisabledbefore;
      const selectedDay = value;

      if (
        disabledDay &&
        selectedDay &&
        (selectedDay.length === 10 || selectedDay.length === 20) &&
        new Date(selectedDay).toLocaleDateString().split('T')[0] ===
          new Date().toLocaleDateString().split('T')[0]
      ) {
        const nowTime = new Date();
        const nowHour = nowTime.getHours();
        const nowMinutes = nowTime.getMinutes();

        const { hour, minutes } = convertTo24Hours(time.time);

        if (hour > nowHour || (hour === nowHour && minutes > nowMinutes)) {
          if (limitDateTime && limitCount < limitDateTime) {
            optionsToRender.push(
              <option key={time.id} value={time.time}>
                {time.time}
              </option>,
            );
            limitCount = limitCount + 0.5;
          } else if (!limitDateTime) {
            optionsToRender.push(
              <option key={time.id} value={time.time}>
                {time.time}
              </option>,
            );
          }
        }
      } else {
        if (selectedDay && limitDateTime) {
          const difference = differenceInHours(new Date(), startOfDay(new Date(selectedDay)));

          const hoursLeft = Math.abs(difference) - limitDateTime;

          if (limitCount < Math.abs(hoursLeft)) {
            optionsToRender.push(
              <option key={time.id} value={time.time}>
                {time.time}
              </option>,
            );

            limitCount = limitCount + 0.5;
          }
        } else if (!limitDateTime) {
          optionsToRender.push(
            <option key={time.id} value={time.time}>
              {time.time}
            </option>,
          );
        }
      }
    }

    return optionsToRender;
  };

  // this return a input that isn't a checkbox, select or the special date input called "DottedDate"

  if (type && !inputsTypeIgnored.includes(type)) {
    return (
      <section
        className="relative flex"
        style={{
          width: widthFull ? '100%' : '',
          flexDirection: labelLeft ? 'row' : labelRight ? 'row-reverse' : 'column',
          justifyContent: `${labelRight && 'center'}`,
          alignItems: `${labelRight && 'center'}`,
          gap: `${labelRight && '1vw'}`,
          gridColumn: colGridSpan ? `span ${colGridSpan}` : 'auto',
          marginLeft: marginLeft && `${marginLeft}vw`,
        }}
      >
        {label && (
          <label
            htmlFor={name ? name : ''}
            className="w-fit font-medium"
            style={{
              marginBottom: `${labelRight ? 0 : labelBottom ? `${labelBottom}vh` : '1.666667vh'}`,
              color: labelSameColor ? textAlterColor : '#B3B3B3',
              fontSize: labelFontSize ? `${labelFontSize}vh` : '1.626852vh',
            }}
          >
            {label}
          </label>
        )}
        <aside
          className="h-[5.277778vh] flex flex-row items-center gap-[0.5vw] px-[0.6vw]"
          style={{
            width: width !== 0 ? `${width}vw` : '100%',
            height: height ? `${height}vh` : undefined,
            backgroundColor: disabled
              ? noDisabledBgColor
                ? backgroundColor
                  ? backgroundColor
                  : '#F4F4F4'
                : '#C9EBE6'
              : backgroundColor
                ? backgroundColor
                : '#F4F4F4',
            border: `${border ? `${border}vw solid ${borderColor}` : 'none'}`,
            borderRadius: borderRadius ? `${borderRadius}vw` : '0.520833vw',
          }}
        >
          {countryPhoneCode && (
            <p
              className="h-full flex justify-center items-center cursor-default"
              style={{
                fontSize: fontSize ? `${fontSize}vh` : '1.666667vh',
                color: textAlterColor ? textAlterColor : '#585858',
              }}
            >
              {countryPhoneCode}
            </p>
          )}
          {searchLensIcon && <SearchLens />}
          <input
            onClick={(e) => (stopPropagationOnClick ? e.stopPropagation() : null)}
            type={type}
            name={name ? name : ''}
            id={name ? name : ''}
            value={capitalString ? handlingCapitalWords(value) : value}
            autoComplete="off"
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            data-index={index}
            data-identity={identity}
            max={maxDateAge ? maxDate : undefined}
            maxLength={max ? max : undefined}
            min={type === 'text' ? min : undefined}
            className={`w-full h-full outline-none font-medium ${
              textAlterColor
                ? `placeholder:text-[${placeHolderColor || textAlterColor}]`
                : 'placeholder:text-[#959595]'
            }`}
            style={{
              backgroundColor: 'inherit',
              color: textAlterColor ? textAlterColor : '#585858',
              borderRadius: borderRadius ? `${borderRadius}vw` : '0.520833vw',
              fontSize: fontSize ? `${fontSize}vh` : '1.666667vh',
            }}
          />
        </aside>
        <AnimatePresence>
          {fieldErrors && name && fieldErrors[name] && fieldErrors[name].length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute z-[1] p-0.5 rounded-md shadow-crmFormShadow bg-white/80 text-[#F00] hover:text-[#FF000020] hover:bg-white/20 transition-colors"
              style={{
                width: fieldErrorWidthMaxContent ? 'max-content' : undefined,
                // top: fieldErrorTop ? `${fieldErrorTop}vh` : '9.5vh',
                top: '100%',
                fontSize: fieldErrorFontSize ? `${fieldErrorFontSize}vh` : '1.666667vh',
                backgroundColor: fieldErrorBgWhite ? '#FFF' : '',
              }}
            >
              {fieldErrors[name][0]}
            </motion.p>
          )}
        </AnimatePresence>
        {specialComponent && specialComponent}
        {isLoading && <IsLoadingComponent />}
      </section>
    );
  }

  if (type === 'password') {
    return (
      <section
        className="relative flex"
        style={{
          flexDirection: `${labelRight ? 'row-reverse' : 'column'}`,
          justifyContent: `${labelRight && 'center'}`,
          alignItems: `${labelRight && 'center'}`,
          gap: `${labelRight && '1vw'}`,
          gridColumn: colGridSpan ? `span ${colGridSpan}` : 'auto',
          marginLeft: marginLeft && `${marginLeft}vw`,
        }}
      >
        {label && (
          <label
            htmlFor={name ? name : ''}
            className="font-medium"
            style={{
              marginBottom: `${labelRight ? 0 : '1.666667vh'}`,
              color: labelSameColor ? textAlterColor : '#B3B3B3',
              fontSize: labelFontSize ? `${labelFontSize}vh` : '1.626852vh',
            }}
          >
            {label}
          </label>
        )}
        <aside
          className="h-[5.277778vh] flex flex-row items-center gap-[0.5vw] px-[0.6vw] rounded-[0.520833vw]"
          style={{
            width: width !== 0 ? `${width}vw` : '100%',
            height: height ? `${height}vh` : undefined,
            backgroundColor: disabled ? '#C9EBE6' : backgroundColor ? backgroundColor : '#F4F4F4',
            border: `${border ? `${border}vw solid ${borderColor}` : 'none'}`,
            borderRadius: borderRadius && `${borderRadius}vw`,
          }}
        >
          <div className="w-full flex flex-row items-center justify-center">
            {searchLensIcon && <SearchLens />}
            <input
              type={passwordInput ? 'password' : 'text'}
              name={name ? name : ''}
              id={name ? name : ''}
              value={value}
              autoComplete="off"
              onChange={onChange}
              placeholder={placeholder}
              disabled={disabled}
              data-index={index}
              data-identity={identity}
              max={maxDateAge ? maxDate : undefined}
              maxLength={max ? max : undefined}
              className={`w-[90%] h-full outline-none font-medium ${
                textAlterColor
                  ? `placeholder:text-[${textAlterColor}]`
                  : 'placeholder:text-[#959595]'
              }`}
              style={{
                backgroundColor: 'inherit',
                color: textAlterColor ? textAlterColor : '#585858',
                fontSize: fontSize ? `${fontSize}vh` : '1.666667vh',
              }}
            />
            <button
              onClick={(e) => {
                const elementClicked = e.currentTarget.closest('button');

                elementClicked && setPasswordInput(!passwordInput);
              }}
              className="w-[10%] h-[5.277778vh] rounded-r-[0.520833vw] bg-[#F4F4F4] outline-none flex justify-center items-center"
            >
              {passwordInput ? <EyeIcon /> : <EyeClosed />}
            </button>
          </div>
        </aside>
        <AnimatePresence>
          {fieldErrors && name && fieldErrors[name] && fieldErrors[name].length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute z-[1] p-0.5 rounded-md shadow-crmFormShadow bg-white/80 text-[#F00] hover:text-[#FF000020] hover:bg-white/20 transition-colors"
              style={{
                width: fieldErrorWidthMaxContent ? 'max-content' : undefined,
                // top: fieldErrorTop ? `${fieldErrorTop}vh` : '9.5vh',
                top: '100%',
                fontSize: fieldErrorFontSize ? `${fieldErrorFontSize}vh` : '1.666667vh',
                backgroundColor: fieldErrorBgWhite ? '#FFF' : '',
              }}
            >
              {fieldErrors[name][0]}
            </motion.p>
          )}
        </AnimatePresence>
        {isLoading && <IsLoadingComponent />}
      </section>
    );
  }

  // this return a custom select input

  if (type === 'select') {
    return (
      <section
        className="relative flex"
        style={{
          width: width === 0 ? '100%' : 'fit-content',
          flexDirection: labelLeft ? 'row' : labelRight ? 'row-reverse' : 'column',
          justifyContent: `${labelRight && 'revert'}`,
          alignContent: `${labelRight && 'center'}`,
          gridColumn: colGridSpan ? `span ${colGridSpan}` : 'auto',
          marginLeft: marginLeft && `${marginLeft}vw`,
          gap: labelLeft || labelRight ? '1.5vw' : '',
        }}
      >
        {label && (
          <label
            htmlFor={name ? name : ''}
            className="w-fit mb-[1.666667vh] font-medium"
            style={{
              color: labelSameColor ? textAlterColor : '#B3B3B3',
              marginBottom: labelLeft || labelRight ? 'auto' : '1.666667vh',
              marginTop: labelLeft || labelRight ? 'auto' : '',
              fontSize: labelFontSize ? `${labelFontSize}vh` : '1.626852vh',
            }}
          >
            {label}
          </label>
        )}
        <aside
          className="h-fit"
          style={{
            width: width === 0 ? '100%' : 'fit-content',
          }}
        >
          <select
            onClick={(e) => (stopPropagationOnClick ? e.stopPropagation() : null)}
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            data-index={index}
            data-identity={identity}
            className="h-[5.277778vh] outline-none pl-[0.6vw] pr-8 font-medium appearance-none bg-no-repeat bg-[position:right_0.75rem_center] bg-[size:0.7em_0.7em] 
          bg-[url('/inputSelectArrowIcon.svg')]"
            style={{
              width: width !== 0 ? `${width}vw` : '100%',
              backgroundColor:
                disabled && !noDisabledBgColor
                  ? '#C9EBE6'
                  : backgroundColor
                    ? backgroundColor
                    : '#F4F4F4',
              color: textAlterColor ? textAlterColor : '#585858',
              border: `${border ? `${border}vw solid ${borderColor}` : 'none'}`,
              borderRadius: borderRadius ? `${borderRadius}vw` : '0.520833vw',
              fontSize: fontSize ? `${fontSize}vh` : '1.666667vh',
            }}
          >
            <option value="">select</option>
            {options?.map((el) => (
              <option key={`${uniqueIdPrefix}-${el.value}-${el.option}`} value={el.value}>
                {el.option}
              </option>
            ))}
          </select>
        </aside>
        <AnimatePresence>
          {fieldErrors && name && fieldErrors[name] && fieldErrors[name].length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute z-[1] p-0.5 rounded-md shadow-crmFormShadow bg-white/80 text-[#F00] hover:text-[#FF000020] hover:bg-white/20 transition-colors"
              style={{
                width: fieldErrorWidthMaxContent ? 'max-content' : undefined,
                // top: fieldErrorTop ? `${fieldErrorTop}vh` : '9.5vh',
                top: '100%',
                fontSize: fieldErrorFontSize ? `${fieldErrorFontSize}vh` : '1.666667vh',
                backgroundColor: fieldErrorBgWhite ? '#FFF' : '',
              }}
            >
              {fieldErrors[name][0]}
            </motion.p>
          )}
        </AnimatePresence>
        {isLoading && <IsLoadingComponent />}
      </section>
    );
  }

  // this return a custom checkbox input

  if (type === 'checkbox') {
    return (
      <div
        className="relative flex flex-row gap-[0.653646vw] items-center outline-none"
        style={{
          border: `${border ? `${border}vw solid ${borderColor}` : 'none'}`,
          borderRadius: `${borderRadius && `${borderRadius}vw`}`,
          paddingInline: `${border && '1.09375vw'}`,
          paddingTop: `${border && '1.805556vh'}`,
          paddingBottom: `${border && '1.805556vh'}`,
          gridColumn: colGridSpan ? `span ${colGridSpan}` : 'auto',
          marginLeft: marginLeft && `${marginLeft}vw`,
        }}
      >
        {customCheckbox && (
          <label htmlFor={name}>
            <CustomCheckboxTwo
              checked={value ? true : false}
              width={width}
              mobile={mobileDottedDate}
            />
          </label>
        )}
        <input
          type="checkbox"
          name={name}
          id={name}
          value={value}
          data-index={index}
          data-identity={identity}
          onChange={onChange}
          disabled={disabled}
          checked={value ? true : false}
          className="w-[6vw] h-[6vw] md:w-[1.14375vw] md:h-[1.14375vw] accent-[#00A78B] outline-none"
          style={{
            // width: width ? (width !== 0 ? `${width}vw` : '1.14375vw') : '1.14375vw',
            // height: width ? (width !== 0 ? `${width}vw` : '1.14375vw') : '1.14375vw',
            display: customCheckbox ? 'none' : '',
          }}
        />
        <p
          className="w-full text-[1.8vh] font-medium"
          style={{
            color: `${textAlterColor ? `${textAlterColor}` : '#B3B3B3'}`,
          }}
        >
          {chekcboxText}
        </p>
        <AnimatePresence>
          {fieldErrors && name && fieldErrors[name] && fieldErrors[name].length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute z-[1] p-0.5 rounded-md shadow-crmFormShadow bg-white/80 text-[#F00] hover:text-[#FF000020] hover:bg-white/20 transition-colors"
              style={{
                width: fieldErrorWidthMaxContent ? 'max-content' : undefined,
                // top: fieldErrorTop ? `${fieldErrorTop}vh` : '9.5vh',
                top: '100%',
                fontSize: fieldErrorFontSize ? `${fieldErrorFontSize}vh` : '1.666667vh',
                backgroundColor: fieldErrorBgWhite ? '#FFF' : '',
              }}
            >
              {fieldErrors[name][0]}
            </motion.p>
          )}
        </AnimatePresence>
        {isLoading && <IsLoadingComponent />}
      </div>
    );
  }

  // this is a special date input. This input include a custom text input that allows the users to
  // type a date in format mm/dd/yyyy and displays a daypicker to directly pick a specific date from
  // the calendar. Also allows to display an optional select that include the hours of the day that
  // helps to save a specific date with a specific hour.

  // you can set a disabled day/days of the week or to specify a date where dates before are disabled.

  if (type === 'DottedDate') {
    return (
      <section
        className="relative flex"
        style={{
          flexDirection: `${labelRight ? 'row-reverse' : 'column'}`,
          justifyContent: `${labelRight && 'center'}`,
          alignItems: `${labelRight && 'center'}`,
          gap: `${labelRight && '1vw'}`,
          gridColumn: colGridSpan ? `span ${colGridSpan}` : 'auto',
          marginLeft: marginLeft && `${marginLeft}vw`,
        }}
      >
        {label && (
          <label
            htmlFor={name ? name : ''}
            className="font-medium"
            style={{
              position: labelTop || labelBottom ? 'absolute' : 'static',
              top: labelTop ? `${labelTop}vh` : '',
              bottom: labelBottom ? `${labelBottom}vh` : '',
              marginBottom: !labelTop && !labelBottom ? `${labelRight ? 0 : '1.666667vh'}` : '',
              color: labelSameColor ? textAlterColor : labelColor ? labelColor : '#B3B3B3',
              fontSize: labelFontSize ? `${labelFontSize}vh` : '1.626852vh',
            }}
          >
            {label}
          </label>
        )}
        <article
          ref={enableFloating ? refs.setReference : uiHandlerRef}
          {...(enableFloating ? getReferenceProps() : {})}
        >
          <aside
            className="relative h-[5.277778vh] flex rounded-[0.520833vw] px-[0.6vw] overflow-hidden"
            style={{
              width: width && width !== 0 ? `${width}vw` : '100%',
              height: height ? `${height}vh` : undefined,
              backgroundColor: disabled
                ? noDisabledBgColor
                  ? '#F4F4F4'
                  : '#C9EBE6'
                : backgroundColor
                  ? backgroundColor
                  : '#F4F4F4',
              border: `${border ? `${border}vw solid ${borderColor}` : 'none'}`,
              borderRadius: borderRadius && `${borderRadius}vw`,
            }}
          >
            <input
              type="text"
              name={name ? name : ''}
              id={name ? name : ''}
              value={formatDate(value, timeDataValue)}
              autoComplete="off"
              onChange={(e) => {
                const currentValue = e.target.value;
                onChange(e);
                //construir una fecha valida para que no se pueda ingresar una fecha invalida
                const date = new Date(currentValue);
                const isValidDateFormated = date.toString() !== 'Invalid Date';
                if (currentValue.length > 10) return;
                if (currentValue && name && (dayPickerDisabledAfter || dayPickerDisabledbefore)) {
                  let isValidDate = true;
                  if (
                    dayPickerDisabledAfter &&
                    new Date(currentValue).getTime() > dayPickerDisabledAfter.getTime()
                  ) {
                    isValidDate = false;
                  }
                  if (
                    dayPickerDisabledbefore &&
                    new Date(currentValue).getTime() < dayPickerDisabledbefore.getTime()
                  ) {
                    isValidDate = false;
                  }
                  if (!isValidDate || !isValidDateFormated) {
                    setFieldErrors?.((prev: { [key: string]: [string | undefined] }) => ({
                      ...prev,
                      [name]: ['Invalid date'],
                    }));
                    return;
                  }
                  setFieldErrors?.((prev: any) => ({ ...prev, born_date: undefined }));
                }
              }}
              placeholder="mm/dd/yyyy"
              disabled={disabled}
              data-index={index}
              max={maxDateAge ? maxDate : undefined}
              maxLength={max ? max : undefined}
              className={`h-full outline-none font-medium bg-[#FFF0] ${
                textAlterColor
                  ? `placeholder:text-[${textAlterColor}]`
                  : 'placeholder:text-[#959595]'
              }`}
              style={{
                color: textAlterColor ? textAlterColor : '#585858',
                fontSize: fontSize ? `${fontSize}vh` : '1.666667vh',
                width: inputWidth ? `${inputWidth}%` : '90%',
              }}
            />
            <button
              onClick={() => {
                if (!disabledDayPickerBtn) toggleOpen();
              }}
              className="absolute right-0 h-full flex justify-center items-center bg-[#C9EBE6]"
              style={{
                width: selectBtnWidth ? `${selectBtnWidth}%` : '10%',
                cursor: disabledDayPickerBtn ? 'default' : '',
              }}
            >
              {/* <ThreeGreenDots /> */}
              <CalendarIcon />
            </button>
          </aside>
          {isOpen &&
            (enableFloating ? (
              <FloatingPortal>
                <article
                  ref={refs.setFloating}
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-row bg-[#FFF] rounded-[0.52vw] shadow-crmFormShadow"
                  style={{
                    ...floatingStyles,
                    zIndex: 200,
                  }}
                  {...getFloatingProps()}
                >
                  <DayPicker
                    mode="single"
                    selected={value ? new Date(value) : undefined}
                    // captionLayout={noDatePickerYearSelect ? 'label' : 'dropdown-years'}
                    captionLayout={noDatePickerYearSelect ? 'label' : 'dropdown'}
                    onDayClick={(e) => {
                      if (onDayPickerClick) {
                        onDayPickerClick(e, index);
                        if (!dontCloseDatePickerAfterPick) toggleOpen();
                      }
                    }}
                    disabled={
                      dayPickerDisabledDayOfWeek
                        ? {
                            dayOfWeek: dayPickerDisabledDayOfWeek,
                          }
                        : dayPickerDisabledbefore
                          ? {
                              before: dayPickerDisabledbefore,
                              after: dayPickerDisabledAfter,
                            }
                          : dayPickerDisabledAfter
                            ? {
                                after: dayPickerDisabledAfter,
                              }
                            : undefined
                    }
                    defaultMonth={defaultMonth}
                    style={{
                      color: '#00A78B',
                      fill: '#FFF',
                    }}
                    styles={{
                      day_button: {
                        width: mobileDottedDate ? '2rem' : '2.5vw',
                        height: '6vh',
                      },
                      month_caption: { paddingInline: '1vw' },
                      nav: { paddingInline: '1vw' },
                      day: { width: '2.8vw', height: '3vh' },
                    }}
                    components={{
                      Dropdown: CustomDayPickerDropdown,
                    }}
                  />
                  {onTimeChanged && (
                    <select
                      name=""
                      id=""
                      onChange={(e) => {
                        onTimeChanged(e);

                        if (value && dontCloseDatePickerAfterPick) toggleOpen();
                      }}
                      className={`w-[10vw] h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] mt-[2.5vh] mr-[1vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw] outline-none border-2 ${
                        showTimeAdvise && value ? 'border-primaryColor' : 'border-[#F4F4F4]'
                      }`}
                      style={{
                        height: height ? `${height}vh` : undefined,
                      }}
                      data-identity={identity}
                    >
                      <option value="">{value ? 'Select a Time' : 'Select a Date'}</option>
                      {handlingDayTime()}
                    </select>
                  )}
                </article>
              </FloatingPortal>
            ) : (
              <article
                onClick={(e) => e.stopPropagation()}
                className="absolute mt-1 h-fit flex flex-row bg-[#FFF] rounded-[0.52vw] shadow-crmFormShadow"
                style={{
                  width: widthFull ? '100%' : 'fit-content',
                  zIndex: 200,
                  top: dayPickerTop,
                  right: dayPickerRight,
                  left: dayPickerLeft,
                  marginBottom: optionsPositionTop ? '0.25rem' : undefined,
                  // bottom: dayPickerBottom,
                  bottom: optionsPositionTop ? '100%' : dayPickerBottom,
                }}
              >
                <DayPicker
                  mode="single"
                  selected={value ? new Date(value) : undefined}
                  captionLayout={noDatePickerYearSelect ? 'label' : 'dropdown'}
                  onDayClick={(e) => {
                    if (onDayPickerClick) {
                      onDayPickerClick(e, index);
                      if (!dontCloseDatePickerAfterPick) toggleOpen();
                    }
                  }}
                  disabled={
                    dayPickerDisabledDayOfWeek
                      ? {
                          dayOfWeek: dayPickerDisabledDayOfWeek,
                        }
                      : dayPickerDisabledbefore
                        ? {
                            before: dayPickerDisabledbefore,
                            after: dayPickerDisabledAfter,
                          }
                        : dayPickerDisabledAfter
                          ? {
                              after: dayPickerDisabledAfter,
                            }
                          : undefined
                  }
                  defaultMonth={defaultMonth}
                  style={{
                    color: '#00A78B',
                    fill: '#FFF',
                  }}
                  styles={{
                    day_button: {
                      width: mobileDottedDate ? '2rem' : '2.5vw',
                      height: '6vh',
                    },
                    month_caption: { paddingInline: '1vw' },
                    nav: { paddingInline: '1vw' },
                    day: { width: '2.8vw', height: '3vh' },
                  }}
                  components={{
                    Dropdown: CustomDayPickerDropdown,
                  }}
                />
                {onTimeChanged && (
                  <select
                    name=""
                    id=""
                    onChange={(e) => {
                      onTimeChanged(e);

                      if (value && dontCloseDatePickerAfterPick) toggleOpen();
                    }}
                    className={`w-[10vw] h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] mt-[2.5vh] mr-[1vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw] outline-none border-2 ${
                      showTimeAdvise && value ? 'border-primaryColor' : 'border-[#F4F4F4]'
                    }`}
                    style={{
                      height: height ? `${height}vh` : undefined,
                    }}
                    data-identity={identity}
                  >
                    <option value="">{value ? 'Select a Time' : 'Select a Date'}</option>
                    {handlingDayTime()}
                  </select>
                )}
              </article>
            ))}
        </article>
        <AnimatePresence>
          {fieldErrors && name && fieldErrors[name] && fieldErrors[name].length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute z-[1] p-0.5 rounded-md shadow-crmFormShadow bg-white/80 text-[#F00] hover:text-[#FF000020] hover:bg-white/20 transition-colors"
              style={{
                width: fieldErrorWidthMaxContent ? 'max-content' : undefined,
                // top: fieldErrorTop ? `${fieldErrorTop}vh` : '9.5vh',
                top: '100%',
                fontSize: fieldErrorFontSize ? `${fieldErrorFontSize}vh` : '1.666667vh',
                backgroundColor: fieldErrorBgWhite ? '#FFF' : '',
              }}
            >
              {fieldErrors[name][0]}
            </motion.p>
          )}
        </AnimatePresence>
        {isLoading && <IsLoadingComponent />}
      </section>
    );
  }
}
