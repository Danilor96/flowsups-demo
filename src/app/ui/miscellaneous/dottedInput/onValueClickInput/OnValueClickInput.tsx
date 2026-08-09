import { ThreeGreenDots } from '@/app/ui/icons/Icons';

export function OnValueClickInput({
  value,
  width,
  name,
  label,
  onValueClick,
}: {
  value: string;
  width: number;
  name: string;
  label?: string;
  onValueClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <div
      className="relative flex flex-col"
      style={{
        width: `${width}vw`,
      }}
    >
      <label
        htmlFor={name}
        className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
      >
        {label}
      </label>
      <aside className="flex flex-row">
        <div
          id="referrerName"
          className="w-[90%] h-[5.277778vh] flex items-center bg-[#F4F4F4] rounded-l-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw]"
        >
          <button onClick={onValueClick} className="underline">
            {value}
          </button>
        </div>
        <button
          type="button"
          className="w-[10%] h-[5.277778vh] bg-[#F4F4F4] flex justify-center items-center rounded-r-[0.520833vw]"
          disabled={true}
        >
          <ThreeGreenDots />
        </button>
      </aside>
    </div>
  );
}
