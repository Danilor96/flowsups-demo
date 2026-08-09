import { DecreaseTimeInputIcon, IncreaseTimeInputIcon } from '&/icons/Icons';
import { adminDashboardStore } from '@/store/adminDashboard';
import { daytimeStore } from '@/store/userSchedule';

export function TimeBtn({ index, from }: { index: number; from: boolean }) {
  // ----- global states -----

  const { setFromDaytime, setToDaytime } = daytimeStore();
  const { daytimeFrom, daytimeTo } = daytimeStore();

  const { dayTime } = adminDashboardStore();

  // ----- local states -----

  const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { increase, i, from } = e.currentTarget.dataset;

    if (increase === 'true' && i) {
      let newTime: number = 0;

      if (from === 'true' && dayTime) {
        newTime =
          daytimeFrom[parseInt(i)] === dayTime.length - 1 ? 0 : daytimeFrom[parseInt(i)] + 1;

        setFromDaytime(parseInt(i), newTime);
      } else if (dayTime) {
        newTime = daytimeTo[parseInt(i)] === dayTime.length - 1 ? 0 : daytimeTo[parseInt(i)] + 1;

        setToDaytime(parseInt(i), newTime);
      }
    }

    if (increase === 'false' && i) {
      let newTime: number = 0;

      if (from === 'true' && dayTime) {
        newTime = daytimeFrom[parseInt(i)] > 0 ? daytimeFrom[parseInt(i)] - 1 : dayTime.length - 1;

        setFromDaytime(parseInt(i), newTime);
      } else if (dayTime) {
        newTime = daytimeTo[parseInt(i)] > 0 ? daytimeTo[parseInt(i)] - 1 : dayTime.length - 1;

        setToDaytime(parseInt(i), newTime);
      }
    }
  };

  return (
    <section className="w-fit h-fit flex flex-col justify-center items-center gap-[0.35vh]">
      <button onClick={handleButton} data-from={from} data-i={index} data-increase={true}>
        <IncreaseTimeInputIcon />
      </button>
      <button onClick={handleButton} data-from={from} data-i={index} data-increase={false}>
        <DecreaseTimeInputIcon />
      </button>
    </section>
  );
}
