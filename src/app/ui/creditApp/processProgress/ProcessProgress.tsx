'use client';

import { publicCreditAppPageStore } from '@/store/creditApp';
import { ProgressBar } from './progressBar/ProgressBar';

export function ProcessProgress() {
  // ----- global states -----

  const { currentPage, currentProgress } = publicCreditAppPageStore();

  // ----- local states -----

  const formPages = ['Start', 'Address', 'Employment Status', 'References', 'Finish'];

  // , 'Employment Status', 'References'

  const handleFormView = (page: number) => {
    if (currentPage === 0 && page < 2) return true;

    if (currentPage === 1 && page > 0 && page < 3) return true;

    if (currentPage === 2 && page > 1 && page < 4) return true;

    if (currentPage === 3 && page >= 3) return true;

    return false;
  };

  const handleProgressView = (page: number) => {
    if (currentPage === 0 && page === 0) return true;

    if (currentPage === 1 && page === 1) return true;

    if (currentPage === 2 && page === 2) return true;

    if (currentPage === 3 && page === 3) return true;
  };

  return (
    <aside className="sticky top-[1rem] z-[200] w-full lg:w-[60%] flex flex-row justify-right items-center gap-[0.2rem] mx-auto px-[0.5rem] py-[0.5rem] bg-[#00000095] border-2 border-primaryColor rounded-xl overflow-hidden">
      {formPages.map((el, index) => {
        if (handleFormView(index))
          return (
            <>
              <p
                className={`w-fit px-[0.2rem] py-[0.2rem] text-[0.7rem] md:text-[1rem] rounded-md text-center ${
                  currentPage === index
                    ? 'bg-primaryColor text-white'
                    : 'bg-white text-primaryColor border border-primaryColor'
                }`}
              >
                {el}
              </p>
              {handleProgressView(index) && <ProgressBar />}
            </>
          );
      })}
    </aside>
  );
}
