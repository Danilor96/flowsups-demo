import { Sellers } from '@/app/libs/definitions';
import { ThreeGreenDots } from '&/icons/Icons';
import useUiHandler from '@/hooks/closeComponentsHandler';

export function AssignedTo({
  value,
  sellersList,
  onSellerChange,
  onSellerClick,
}: {
  onSellerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSellerClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  value: string;
  sellersList: Sellers;
}) {
  // ----- global states -----

  // ----- local states -----

  const { isOpen, ref, toggleOpen } = useUiHandler();

  return (
    <div ref={ref} className="relative flex flex-col w-[16.458333vw] !max-lg:w-full">
      <label
        htmlFor="leadFollowUpDate"
        className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3] max-lg:text-sm max-lg:mb-2"
      >
        Assigned To
      </label>
      <aside className="flex flex-row">
        <input
          onChange={(e) => {
            onSellerChange(e);
            if (value && !isOpen) {
              toggleOpen();
            }
          }}
          value={value}
          type="text"
          name="leadFollowUpDate"
          id="leadFollowUpDate"
          autoComplete="off"
          className="w-[90%] h-[5.277778vh] bg-[#F4F4F4] rounded-l-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw] outline-none max-lg:h-11 max-lg:text-sm"
        />
        <button
          type="button"
          onClick={toggleOpen}
          className="w-[10%] h-[5.277778vh] bg-[#C9EBE6] flex justify-center items-center rounded-r-[0.520833vw] max-lg:h-11"
        >
          <ThreeGreenDots />
        </button>
      </aside>
      {isOpen && (
        <ul className="absolute z-20 w-[21.458333vw] h-fit top-[10vh] text-[1.481482vh] font-medium leading-[2.222222vh] text-[#20B299] bg-[#FFF] rounded-[0.520833vw] py-[0.1vh] shadow-crmFormShadow max-lg:w-full max-lg:top-24 max-lg:text-sm">
          {sellersList &&
            sellersList.map((el) => (
              <li
                key={el.id}
                className="h-[3vh] flex justify-center items-center hover:bg-[#c4e9e2] transition-colors rounded-[0.520833vw]"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    onSellerClick(e);
                    toggleOpen();
                  }}
                  data-id={el.id}
                  data-name={el.name}
                  data-lastname={el.last_name}
                  className="w-full text-left pl-[1vw]"
                >
                  {el.name} {el.last_name}
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
