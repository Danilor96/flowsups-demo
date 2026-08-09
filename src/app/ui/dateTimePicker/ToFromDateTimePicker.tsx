import { DayTime } from '@/app/libs/definitions';
import { adminDashboardStore } from '@/store/adminDashboard';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Loader } from '../miscellaneous/loader/Loader';
import { Button } from '../buttons/Button';
import { ButtonContainer } from '../buttons/ButtonContainer';

export function ToFromDateTimePicker({
  datePicker,
  toDateTime,
  fromDateTime,
  top,
  right,
  bottom,
  left,
  zIndex,
  dataset,
  height,
  identity,
  loading,
  fieldErrors,
  onChange,
}: {
  height?: number;
  datePicker: string;
  toDateTime: string;
  fromDateTime: string;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  loading?: boolean;
  zIndex?: number;
  dataset?: string;
  identity?: string;
  fieldErrors?: { [key: string]: [string | undefined] };
  onChange: (
    event:
      | React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
      | React.MouseEvent<HTMLButtonElement>,
  ) => void;
}) {
  // ----- global states -----

  const { dayTime } = adminDashboardStore();
  const { getDayTime } = adminDashboardStore();

  useEffect(() => {
    getDayTime();
  }, [getDayTime]);

  // ----- local states -----

  const [availableFromTime, setAvailableFromTime] = useState<DayTime | undefined>(undefined);
  const [availableToTime, setAvailableToTime] = useState<DayTime | undefined>(undefined);

  useEffect(() => {
    if (fromDateTime && dayTime && dayTime.length > 0) {
      let availableTime = dayTime;

      availableTime = availableTime.filter((el) => {
        const [toHourAndMinute, toPeriod] = el.time.split(' ');
        const [fromHourAndMinute, fromPeriod] = fromDateTime.split(' ');
        const [toHour, toMinute] = toHourAndMinute.split(':');
        const [fromHour, fromMinute] = fromHourAndMinute.split(':');

        let toHourInt = parseInt(toHour);
        let toMinuteInt = parseInt(toMinute);
        let fromHourInt = parseInt(fromHour);
        let fromMinuteInt = parseInt(fromMinute);

        if (toPeriod === 'PM' && toHourInt !== 12) toHourInt = toHourInt + 12;
        if (fromPeriod === 'PM' && fromHourInt !== 12) fromHourInt = fromHourInt + 12;
        if (toPeriod === 'AM' && toHourInt === 12) toHourInt = 0;
        if (fromPeriod === 'AM' && fromHourInt === 12) fromHourInt = 0;

        if (toHourInt > fromHourInt) {
          return true;
        }

        if (toHourInt === fromHourInt && toMinuteInt > fromMinuteInt) {
          return true;
        }

        return false;
      });

      setAvailableToTime(availableTime);
    } else if (dayTime && dayTime.length > 0) {
      setAvailableToTime(dayTime);
    }
  }, [fromDateTime, dayTime]);

  useEffect(() => {
    if (dayTime && dayTime.length > 0) {
      let availableTime = dayTime;

      if (datePicker) {
        const today = new Date();
        const selectedDayPicker = new Date(datePicker);

        const oneDayInMillis = 24 * 60 * 60 * 1000;
        const selectedDayPickerPlusOneDay = new Date(selectedDayPicker.getTime() + oneDayInMillis);

        const todayYear = today.getFullYear();
        const todayMonth = today.getMonth();
        const todayDay = today.getDate();

        const selectedYear = selectedDayPickerPlusOneDay.getFullYear();
        const selectedMonth = selectedDayPickerPlusOneDay.getMonth();
        const selectedDay = selectedDayPickerPlusOneDay.getDate();

        if (
          todayDay === selectedDay &&
          todayMonth === selectedMonth &&
          todayYear === selectedYear
        ) {
          availableTime = availableTime.filter((el) => {
            const [fromHourAndMinute, fromPeriod] = el.time.split(' ');
            const [fromHour, fromMinute] = fromHourAndMinute.split(':');

            let fromHourInt = parseInt(fromHour);
            let fromMinuteInt = parseInt(fromMinute);
            let todayHourInt = new Date().getHours();
            let todayMinuteInt = new Date().getMinutes();

            if (fromPeriod === 'PM' && fromHourInt !== 12) fromHourInt = fromHourInt + 12;
            if (fromPeriod === 'AM' && fromHourInt === 12) fromHourInt = 0;

            if (fromHourInt > todayHourInt) {
              return true;
            }

            if (fromHourInt === todayHourInt && fromMinuteInt > todayMinuteInt) {
              return true;
            }

            return false;
          });
        }
      }

      setAvailableFromTime(availableTime);
    }
  }, [dayTime, datePicker]);

  return (
    <section
      className="absolute bg-[#FFF] w-fit flex flex-col gap-[1.8vh] justify-center items-center rounded-[0.520833vw] px-[0.3vw] py-[0.3vh] shadow-crmFormShadow overflow-hidden"
      style={{
        height: height ? `${height}vh` : 'fit-content',
        top: `${top}vh`,
        right: `${right}vw`,
        bottom: `${bottom}vh`,
        left: `${left}vw`,
        zIndex: `${zIndex}`,
      }}
    >
      <div className="bg-white h-fit w-fit flex flex-row justify-center items-end gap-[0.5vw] px-[0.3vw] py-[0.3vh]">
        <aside className="relative">
          <input
            type="date"
            name="date"
            id=""
            value={datePicker}
            className="bg-[#F4F4F4] text-[#959595] h-[5.277778vh] rounded-[0.520833vw]"
            onChange={onChange}
            min={new Date().toLocaleDateString('sv-SE')}
          />
          {fieldErrors?.date && fieldErrors?.date.length > 0 && fieldErrors?.date[0] && (
            <p className="absolute top-[5.1vh] w-[9vw] flex justify-start text-[1.8vh] text-red-500">
              {fieldErrors?.date[0]}
            </p>
          )}
        </aside>
        <aside className="flex flex-row gap-[0.3vw]">
          <article className="relative flex flex-col justify-center items-center">
            <label htmlFor="" className="text-[#00A78B]">
              From
            </label>
            <select
              name="from"
              id=""
              onChange={onChange}
              value={fromDateTime}
              className="w-[10vw] h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw]"
            >
              <option value="">Time</option>
              {availableFromTime &&
                availableFromTime.length > 0 &&
                availableFromTime.map((el, index) => (
                  <option key={`${el.id * index}---${index + 1}timeselect1`} value={el.time}>
                    {el.time}
                  </option>
                ))}
            </select>
            {fieldErrors?.from && fieldErrors?.from.length > 0 && fieldErrors?.from[0] && (
              <p className="absolute top-[7.8vh] text-[1.8vh] text-red-500">
                {fieldErrors?.from[0]}
              </p>
            )}
          </article>
          <article className="relative flex flex-col justify-center items-center">
            <label htmlFor="" className="text-[#00A78B]">
              To
            </label>
            <select
              name="to"
              id=""
              onChange={onChange}
              value={toDateTime}
              className="w-[10vw] h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw]"
            >
              <option value="">Time</option>
              {availableToTime &&
                availableToTime.length > 0 &&
                availableToTime.map((el, index) => (
                  <option key={`${el.id * index}---${index + 1 - 13}timeselect2`} value={el.time}>
                    {el.time}
                  </option>
                ))}
            </select>
            {fieldErrors?.to && fieldErrors?.to.length > 0 && fieldErrors?.to[0] && (
              <p className="absolute top-[7.8vh] text-[1.8vh] text-red-500">{fieldErrors?.to[0]}</p>
            )}
          </article>
        </aside>
      </div>
      <ButtonContainer marginTop={0} widthFull justify="center" gap={1.5}>
        <Button
          onClick={onChange}
          backgroundColor="#FFF"
          identity={identity || ''}
          textColor="#020617"
          buttonText="Cancel"
          name="btnCancel"
          border={0.15}
          borderColor="#6b7280"
        />
        <Button
          onClick={onChange}
          backgroundColor="#00A78B"
          identity={identity || ''}
          textColor="#FFF"
          buttonText="Accept"
          name="btn"
        />
      </ButtonContainer>
      {loading && <Loader />}
    </section>
  );
}
