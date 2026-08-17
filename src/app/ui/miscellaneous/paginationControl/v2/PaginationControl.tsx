import { FullNextPagIcon, FullPrevPagIcon, NextPagIcon, PrevPagIcon } from '&/icons/Icons';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';

interface props {
  onClick: (event: React.MouseEvent<HTMLButtonElement>, page?: number) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  paginationControlWidth?: number; // in vw
  nextPageActive?: boolean;
  previousPageActive?: boolean;
  paginationTextColor?: string;
  handleNextPage: () => void;
  handleFirstPage: () => void;
  handlePreviousPage: () => void;
  handleLastPage: () => void;
}

export function PaginationControlV2({
  currentPage,
  totalPages,
  totalItems,
  onClick,
  nextPageActive,
  previousPageActive,
  handleNextPage,
  handleFirstPage,
  handlePreviousPage,
  handleLastPage,
  paginationControlWidth = 38,
  paginationTextColor,
}: props) {
  // ----- global states -----

  // ----- local states -----

  const getPaginationNumbers = (totalPages: number, currentPage: number) => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage > 4 && currentPage < totalPages - 3) {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      } else {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      }
    }

    return pages;
  };

  const pages = getPaginationNumbers(totalPages, currentPage);
  const color = paginationTextColor || '#00A78B'
  return (
    <aside
      className="mx-auto/ flex flex-row justify-center items-center py-[0.5vh] max-lg:flex-wrap max-lg:gap-1 !max-lg:w-[min(92vw,26rem)] max-lg:[&_svg]:!w-4 max-lg:[&_svg]:!h-4"
      style={{ width: `${paginationControlWidth}vw` }}
    >
      <Paragraph fontSize={2} textNoWrap color={color} marginRight={1}>
        {totalItems} Results found
      </Paragraph>

      <div className="flex flex-row justify-center items-center gap-4 max-lg:gap-1">
        <button
          onClick={handleFirstPage}
          disabled={!previousPageActive}
          data-jumpprev={true}
          className={`w-[2vw] h-[2vw] rounded-full flex justify-center items-center
          ${!previousPageActive ? 'opacity-50 cursor-not-allowed' : ''} !max-lg:w-9 !max-lg:h-9`}
        >
          <FullPrevPagIcon color={color} />
        </button>
        <button
          onClick={handlePreviousPage}
          disabled={!previousPageActive}
          data-prev={true}
          className={`w-[2vw] h-[2vw] rounded-full flex justify-center items-center
          ${!previousPageActive ? 'opacity-50 cursor-not-allowed' : ''} !max-lg:w-9 !max-lg:h-9`}
        >
          <PrevPagIcon color={color} />
        </button>
      </div>

      <div className="flex items-center gap-3 text-[#00A78B]/ text-[2vh]"
        style={{ color: color }}
      >
        <span className="text-white text-[2vh] bg-[#00A78B] rounded-xl px-3 py-1 flex justify-center items-center">
          {currentPage}
        </span>
        of <span>{totalPages}</span>
      </div>

      <div className="flex flex-row justify-center items-center gap-4 max-lg:gap-1">
        <button
          onClick={handleNextPage}
          data-next={true}
          disabled={!nextPageActive}
          className={`w-[2vw] h-[2vw] rounded-full flex justify-center items-center ${
            !nextPageActive ? 'opacity-50 cursor-not-allowed' : ''
          } !max-lg:w-9 !max-lg:h-9`}
        >
          <NextPagIcon color={color} />
        </button>

        <button
          onClick={handleLastPage}
          data-jumpnext={true}
          disabled={currentPage === totalPages}
          className={`w-[2vw] h-[2vw] rounded-full flex justify-center items-center ${
            !nextPageActive ? 'opacity-50 cursor-not-allowed' : ''
          } !max-lg:w-9 !max-lg:h-9`}
        >
          <FullNextPagIcon color={color} />
        </button>
      </div>
    </aside>
  );
}
