export function OptionsSelected({
  width,
  options,
  optionsSelected,
  isOpen,
  toggleOpen,
}: {
  width: number;
  options?: { value: number; option: string }[];
  optionsSelected: string[];
  isOpen: boolean;
  toggleOpen: () => void;
}) {
  // ----- global states -----

  // ----- local states -----

  const handleReturnSelectedOptions = () => {
    const selectedOptions: string[] = [];

    if (optionsSelected?.length > 0 && options) {
      for (let i = 0; i < optionsSelected.length; i++) {
        const optSelected = optionsSelected[i];

        const optionExists = options?.find((el) => el.value.toString() === optSelected);

        if (optionExists) {
          selectedOptions.push(optionExists.option);
        }
      }
    }

    return selectedOptions;
  };

  const totalItemsToShow = () => {
    const itemWidth = 8;

    let itemsToShow = Math.floor(width / itemWidth);

    if (optionsSelected?.length === 1) {
      if (width > itemWidth) itemsToShow = 1;
    }

    return itemsToShow;
  };

  return (
    <aside>
      <article
        onClick={toggleOpen}
        className={`h-[5.277778vh] flex flex-row items-center gap-[0.2vw] bg-[#F4F4F4] px-[0.2vw] py-[0.2vh] overflow-hidden cursor-pointer !max-lg:w-full max-lg:h-11 ${
          isOpen ? 'rounded-t-md' : 'rounded-md'
        }`}
        style={{
          width: `${width}vw`,
        }}
      >
        {handleReturnSelectedOptions()?.length > 0 ? (
          handleReturnSelectedOptions().map((el, index) =>
            index < totalItemsToShow() ? (
              <p
                key={`optionselectedinput${el}--${index - 7}`}
                className="flex justify-center items-center bg-secondaryColor rounded-lg text-nowrap text-[2vh] text-primaryColor px-[0.4vw]"
              >
                {`${el.slice(0, Math.round(width / totalItemsToShow()))}${
                  el.length > Math.round(width / totalItemsToShow()) ? '...' : ''
                }`}
              </p>
            ) : index === totalItemsToShow() ? (
              <p
                key={`optionselectedinput${el}--${index - 7}`}
                className="flex justify-center items-center mx-auto bg-secondaryColor rounded-lg text-nowrap text-[2vh] text-primaryColor px-[0.5vw] border border-primaryColor"
              >
                {`+ ${optionsSelected?.length - totalItemsToShow()}`}
              </p>
            ) : (
              ''
            ),
          )
        ) : (
          <p className="mx-auto text-[2vh] text-primaryColor">select</p>
        )}
      </article>
    </aside>
  );
}
