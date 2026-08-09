import { CheckedIcon } from '&/icons/Icons';
import { Button } from '&/buttons/Button';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { useEffect, useState } from 'react';

export function SelectContent({
  options,
  optionsSelected,
  width,
  singleSelection,
  optionsShowsTop,
  onClick,
}: {
  options?: { value: number; option: string }[];
  optionsSelected: string[];
  width: number;
  singleSelection?: boolean;
  optionsShowsTop?: boolean;
  onClick: (value: string[]) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  const [filteredOptions, setFilteredOptions] = useState<typeof options>([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    if (options && options?.length > 0) {
      let newData = [...options];

      if (searchValue) {
        const searchTermarray = searchValue.toLowerCase().split(' ');

        newData = newData.filter((el) => {
          const optionFormatted = el.option.toLowerCase();

          return searchTermarray.every((word) => optionFormatted.includes(word));
        });
      }

      setFilteredOptions(newData);
    } else {
      setFilteredOptions([]);
    }
  }, [searchValue, options]);

  const handleClick = (e: React.MouseEvent<HTMLLIElement | HTMLButtonElement>) => {
    const { value } = e.currentTarget;
    const { identity } = e.currentTarget.dataset;

    if (singleSelection) {
      onClick([value.toString()]);
      return;
    }

    let newArray = [...optionsSelected];

    if (identity === 'reset') {
      newArray = [];
    }

    if (identity === 'all' && options && options.length > 0) {
      let allOpt: string[] = [];

      for (let i = 0; i < options.length; i++) {
        const opt = options[i];

        allOpt.push(opt.value.toString());
      }
      newArray = allOpt;
    }

    if (newArray.includes(value.toString()) && !identity) {
      newArray = newArray.filter((el) => el !== value.toString());
    } else if (!identity) {
      newArray.push(value.toString());
    }

    onClick(newArray);
  };



  return (
    <aside
      className="absolute z-[2] w-full h-fit flex flex-col justify-between items-center py-[1vh] bg-[#F4F4F4] border-t border-primaryColor shadow-crmFormShadow rounded-b-lg"
      style={{
        top: optionsShowsTop ? undefined : '100%',
        bottom: optionsShowsTop ? '100%' : undefined,
      }}
    >
      <input
        type="text"
        name=""
        id=""
        value={searchValue}
        onChange={(e) => setSearchValue(e.currentTarget.value)}
        placeholder="Search"
        className="w-[80%] h-[3vh] px-[0.2vw] text-[1.8vh] text-primaryColor bg-white rounded-md outline-none placeholder:text-[#B3B3B3] border border-primaryColor"
      />
      <ul
        className="w-[90%] mt-[1vh] overflow-y-scroll rounded-lg bg-primaryColor"
        style={{
          height: '20vh',
        }}
      >
        {filteredOptions && filteredOptions?.length > 0 ? (
          filteredOptions.map((el, index) => (
            <li
              key={`selectcontentoptions----${index * 89 - 31}`}
              value={el.value}
              onClick={handleClick}
              className={`relative w-full flex justify-center items-center border-b border-secondaryColor text-wrap hover:bg-white transition-colors cursor-pointer group ${
                optionsSelected.includes(el.value.toString()) ? 'bg-[#0c8a75]' : ''
              }`}
              style={{
                minHeight: '4vh',
              }}
            >
              <div className="w-full h-full flex flex-row justify-center items-center">
                <aside className="w-[95%] h-full flex items-center px-[0.1vw] py-[0.5vh]">
                  <p className="w-fit h-fit text-[2vh] text-white group-hover:text-primaryColor transition-colors">
                    {el.option}
                  </p>
                </aside>
                <aside
                  className={`w-[5%] min-h-full flex justify-center items-center transition-colors ${
                    optionsSelected.includes(el.value.toString())
                      ? 'bg-secondaryColor border border-primaryColor'
                      : ''
                  }`}
                  style={{
                    minHeight: '4vh',
                  }}
                >
                  {optionsSelected.includes(el.value.toString()) && <CheckedIcon />}
                </aside>
              </div>
            </li>
          ))
        ) : (
          <li className="px-[1vw] py-[1vh]">
            <p className="w-fit h-fit text-[2vh] text-white">No results found</p>
          </li>
        )}
      </ul>
      {!singleSelection && (
        <article className={`w-[80%] flex flex-row items-end justify-between`}>
          <ButtonContainer marginTop={1} justify="center" gap={width < 11 ? 0.5 : 1}>
            <Button
              backgroundColor=""
              identity="reset"
              textColor="#9a3412"
              border={0.1}
              borderColor="#9a3412"
              buttonText="Reset"
              height={3}
              buttonTextSize={2}
              widthFitContent
              lineHeight={0}
              onClick={handleClick}
            />
            <Button
              backgroundColor=""
              identity="all"
              textColor="#1e40af"
              border={0.1}
              borderColor="#1e40af"
              buttonText="All"
              height={3}
              buttonTextSize={2}
              widthFitContent
              lineHeight={0}
              onClick={handleClick}
            />
          </ButtonContainer>
          <p className="w-fit text-[2vh] text-primaryColor">{`${optionsSelected.length}/${
            options?.length || ''
          }`}</p>
        </article>
      )}
    </aside>
  );
}
