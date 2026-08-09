import { dayweekStore } from '@/store/userSchedule';

export function ToggleBtn({ index }: { index: number }) {
  // ----- global states -----

  const { dayweek } = dayweekStore();
  const { setPickDay } = dayweekStore();

  // ----- local states -----

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { i } = e.target.dataset;

    i && setPickDay(parseInt(i));
  };

  return (
    <article className="w-fit h-fit">
      <label htmlFor={`val${index}`}>
        <div
          className={`w-[1.95vw] h-[1.94vh] flex items-center rounded-[0.651041vw] px-[0.2vw] py-[0.2vh] ${
            dayweek[index]
              ? 'bg-[#00A78B] border-[0.015vw] border-[#00967D] justify-end'
              : 'bg-[#D9D9D9] border-[0.015vw] border-[#CECBCB] justify-start'
          }`}
        >
          <aside className="w-[0.8203125vw] h-[1.283333vh] bg-[#FFF] rounded-full"></aside>
        </div>
      </label>
      <input
        type="checkbox"
        id={`val${index}`}
        className="hidden"
        data-i={index}
        checked={dayweek[index]}
        onChange={handleChange}
      />
    </article>
  );
}
