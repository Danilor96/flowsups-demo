import { CancelIcon } from '&/icons/Icons';
import { useState } from 'react';

export function DeleteBtn({
  itemId,
  onClick,
}: {
  itemId?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  const [hoverDeleteBtn, setHoverDeleteBtn] = useState(false);

  const [showDecisionComponent, setShowDecisionComponent] = useState(false);

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();

          setShowDecisionComponent(true);
        }}
        className="absolute right-0 top-0 w-fit h-fit"
        onMouseEnter={() => setHoverDeleteBtn(true)}
        onMouseLeave={() => setHoverDeleteBtn(false)}
      >
        <CancelIcon width={1.2} height={1.2} color={hoverDeleteBtn ? '#FF000040' : ''} />
      </button>
      {showDecisionComponent && (
        <div className="absolute top-0 right-0 bottom-0 left-0 flex flex-col justify-center items-center bg-blue-400">
          <aside className="text-[1.8vh] text-white">Delete this item?</aside>
          <aside className="w-[100%] flex flex-row justify-center items-center gap-3">
            <button
              onClick={onClick}
              data-id={itemId}
              className="w-[2vw] rounded-md text-[1.8vh] text-white bg-red-400"
            >
              Yes
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();

                setShowDecisionComponent(false);
              }}
              className="w-[2vw] rounded-md text-[1.8vh] text-white bg-blue-600"
            >
              No
            </button>
          </aside>
        </div>
      )}
    </>
  );
}
