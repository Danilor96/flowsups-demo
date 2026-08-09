export function List({
  listItems,
  addNewProspect,
  onSelect,
  onAddNewProspect,
}: {
  listItems?: { value: number; option: string }[];
  addNewProspect?: boolean;
  onSelect: (event: React.MouseEvent<HTMLLIElement>) => void;
  onAddNewProspect?: (event: React.MouseEvent<HTMLLIElement>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <ul className="absolute left-0 top-[7.2vh] z-40 w-full max-h-[21.111111vh] bg-[#FFFFFF] rounded-t-[0.520833vw] overflow-y-scroll">
      {addNewProspect && (
        <li
          onClick={onAddNewProspect}
          className="w-full px-[0.5vw] py-[0.8vh] hover:bg-[#3b82f6] hover:text-white transition-colors text-[1.9vh] font-medium leading-[2.440741vh] text-blue-500 cursor-pointer"
        >
          Add New Prospect
        </li>
      )}
      {listItems &&
        listItems.length > 0 &&
        listItems.map((el, index) => (
          <li
            onClick={onSelect}
            key={`${index * 76}000jjkds//__${2 * 4 - index}`}
            className="w-full px-[0.5vw] py-[0.8vh] cursor-pointer odd:bg-[#E6F6F3] even:bg-[#FFFFFF] hover:bg-[#8fd3c6] transition-colors text-[1.9vh] font-medium leading-[2.440741vh] text-[#00A78B]"
            data-value={el.value}
            style={{
              borderTopLeftRadius: index === 0 ? (!addNewProspect ? '0.520833vw' : '') : '',
              borderTopRightRadius: index === 0 ? (!addNewProspect ? '0.520833vw' : '') : '',
              borderBottomLeftRadius: index === listItems.length - 1 ? '0.520833vw' : '',
              borderBottomRightRadius: index === listItems.length - 1 ? '0.520833vw' : '',
            }}
          >
            {el.option}
          </li>
        ))}
    </ul>
  );
}
