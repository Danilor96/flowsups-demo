import { SetStateAction } from 'react';

export function CategoryComponent({
  categories,
  selected,
  allCategoriesBtn,
  onClick,
}: {
  categories: {
    category: string;
    value: number;
  }[];
  selected: number | null;
  allCategoriesBtn?: boolean;
  onClick: (value: SetStateAction<number | null>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <section className="flex flex-row mt-auto">
      {categories.map((el, index) => (
        <article
          key={`categoriesTag---${index}`}
          onClick={() => onClick(el.value)}
          className={`w-fit h-fit flex justify-center items-center px-[0.2vw] py-[0.2vh] text-[2vh] cursor-pointer transition-colors  border-t border-l border-primaryColor ${
            selected === el.value
              ? 'text-white bg-primaryColor'
              : 'bg-[#F4F4F4] hover:bg-primaryColor text-primaryColor hover:text-white'
          } ${index === categories.length - 1 && !allCategoriesBtn ? 'border-r' : ''}`}
        >
          {el.category}
        </article>
      ))}
      {allCategoriesBtn && (
        <article
          onClick={() => onClick(null)}
          className={`w-fit h-fit flex justify-center items-center px-[0.2vw] py-[0.2vh] text-[2vh] cursor-pointer transition-colors  border-t border-l border-r border-primaryColor ${
            selected === null
              ? 'text-white bg-primaryColor'
              : 'bg-[#F4F4F4] hover:bg-primaryColor text-primaryColor hover:text-white'
          }`}
        >
          All
        </article>
      )}
    </section>
  );
}
