import { FullNextPagIcon, FullPrevPagIcon, NextPagIcon, PrevPagIcon } from '&/icons/Icons';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';

export function PaginationControl({
  currentPage,
  totalPages,
  onClick,
  paginationControlWidth = 38,
}: {
  onClick: (event: React.MouseEvent<HTMLButtonElement>, page?: number) => void;
  currentPage: number;
  totalPages: number;
  paginationControlWidth?: number; // in vw
}) {
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

  return (
    <div className="mx-auto flex flex-row justify-center items-center gap-[1vw] mt-[1.8vh] px-[1vw] py-[0.5vh] bg-[#92CEC3] rounded-[1.01vw]"
      style={{ width: `${paginationControlWidth}vw` }}
    >
      <aside className="w-[9vw] flex flex-row justify-center items-center">
        <button
          onClick={onClick}
          disabled={currentPage === 1}
          data-jumpprev={true}
          className="w-[2vw] h-[2vw] rounded-full flex justify-center items-center"
        >
          <FullPrevPagIcon />
        </button>

        <article className="w-[7vw] flex flex-row justify-center items-center gap-[0.3vw] mr-[1vw]">
          <button
            onClick={onClick}
            disabled={currentPage === 1}
            data-prev={true}
            className="w-[2vw] h-[2vw] rounded-full flex justify-center items-center"
          >
            <PrevPagIcon />
          </button>
          <Paragraph color="#FFF" fontSize={2}>
            Previous
          </Paragraph>
        </article>
      </aside>

      <aside className="w-[15vw] flex flex-row justify-center items-center">
        {pages.map((page, index) =>
          typeof page === 'number' ? (
            <button
              key={index}
              onClick={(e) => onClick(e, page)}
              disabled={page === currentPage}
              className={`${
                page === currentPage && 'bg-[#6BB9B1]'
              } rounded-[0.538333vw] text-[2vh] font-medium text-[#FFF] px-[0.5vw] py-[0.8vh]`}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="text-[#FFF] px-2">
              {page}
            </span>
          ),
        )}
      </aside>

      <aside className="flex flex-row justify-center items-center">
        <article className="w-[7vw] flex flex-row justify-center items-center gap-[0.3vw] ml-[1vw]">
          <Paragraph color="#FFF" fontSize={2}>
            Next
          </Paragraph>
          <button
            onClick={onClick}
            data-next={true}
            disabled={currentPage === totalPages}
            className="w-[2vw] h-[2vw] rounded-full flex justify-center items-center"
          >
            <NextPagIcon />
          </button>
        </article>

        <button
          onClick={onClick}
          data-jumpnext={true}
          disabled={currentPage === totalPages}
          className="w-[2vw] h-[2vw] rounded-full flex justify-center items-center"
        >
          <FullNextPagIcon />
        </button>
      </aside>
    </div>
  );
}
