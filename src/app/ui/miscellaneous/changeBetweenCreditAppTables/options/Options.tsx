import { handlingCapitalWords } from '@/app/libs/functions/inputs/inputsFunction';
import { adminDashboardStore } from '@/store/adminDashboard';

export function Options({
  handleClick,
}: {
  handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  // ----- global states -----

  const { creditAppListStatus } = adminDashboardStore();

  // ----- local states -----

  return (
    <div className="absolute left-[-11.5vw] top-0 w-[11.145833vw] h-[15.833333vh] flex flex-col rounded-[0.520833vw] bg-[#FFF] shadow-crmFormShadow overflow-hidden">
      {creditAppListStatus &&
        creditAppListStatus.length > 0 &&
        creditAppListStatus.map((el, index) => (
          <button
            key={`${el.id * 7}leadOpts--${index + index * 3}`}
            onClick={handleClick}
            data-status={el.id}
            className="w-full h-full font-medium text-[2vh] text-[#20B299] hover:bg-[#E6F6F3] transition-colors"
          >
            {handlingCapitalWords(el.status)}
          </button>
        ))}
    </div>
  );
}
