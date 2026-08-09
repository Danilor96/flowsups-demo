import { Sellers } from '@/app/libs/definitions';

export function SalesRepsList({
  filteredList,
  identity,
  onClick,
  toggleOpen,
}: {
  filteredList: Sellers;
  identity: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  toggleOpen: () => void;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <ul
      className={`absolute z-20 w-[21.458333vw] max-h-[20vh] top-[10vh] text-[2vh] font-medium leading-[2.222222vh] text-[#20B299] rounded-[0.520833vw] py-[0.1vh] overflow-y-scroll ${
        filteredList && filteredList.length > 0 && 'shadow-crmFormShadow'
      }`}
    >
      {filteredList && filteredList.length > 0 ? (
        filteredList.map((el, index) => (
          <li
            key={`${el.id * 33 + 1}saleslist${index - 12}`}
            className="w-full h-[6vh] flex justify-center items-center hover:bg-[#c4e9e2] transition-colors bg-white"
            style={{
              borderTopLeftRadius: index === 0 ? '0.520833vw' : '',
              borderTopRightRadius: index === 0 ? '0.520833vw' : '',
              borderBottomLeftRadius: index === filteredList.length - 1 ? '0.520833vw' : '',
              borderBottomRightRadius: index === filteredList.length - 1 ? '0.520833vw' : '',
            }}
          >
            <button
              type="button"
              onClick={(e) => {
                onClick(e);
                toggleOpen();
              }}
              data-identity={identity}
              data-id={el.id}
              className="w-full h-full text-left pl-[1vw]"
            >
              {`${el.name} ${el.last_name} ${el.username ? `- ${el.username}` : ''}`}
            </button>
          </li>
        ))
      ) : (
        <li className="z-50 w-fit h-fit bg-[#E6F6F3]">
          <p className="w-fit px-[0.5vw] py-[0.7vh] text-[2vh] text-[#00A78B] font-bold">
            No sales rep. found
          </p>
        </li>
      )}
    </ul>
  );
}
