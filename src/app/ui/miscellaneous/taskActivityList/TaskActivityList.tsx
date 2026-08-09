import { useEffect, useState } from 'react';
import { Tasks } from '@/app/libs/definitions';
import { CancelWhiteIcon, CompleteWhiteIcon, TaskActivityCardIcon } from '&/icons/Icons';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { PaginationControl } from '&/miscellaneous/paginationControl/PaginationControl';

export function TaskActivityList({
  tasks,
  marginTop,
  itemsPerPage,
  height,
  overflowY,
  handleButtons,
}: {
  tasks: Tasks;
  marginTop?: number;
  itemsPerPage: number;
  height?: number;
  overflowY?: boolean;
  handleButtons: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  //   handling pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentItems, setCurrentItems] = useState<any[]>([]);

  useEffect(() => {
    if (tasks && itemsPerPage && tasks.length > 0) {
      setTotalPages(Math.ceil(tasks.length / itemsPerPage));
      setCurrentItems(tasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
    } else {
      setTotalPages(0);
      setCurrentItems([]);
    }
  }, [currentPage, tasks, itemsPerPage]);

  const handlePagination = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { next, prev } = e.currentTarget.dataset;

    if (next) {
      if (currentPage < totalPages) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    }

    if (prev) {
      if (currentPage > 1) {
        setCurrentPage((prevPage) => prevPage - 1);
      }
    }
  };

  return (
    <>
      <ul
        className="relative"
        style={{
          height: height && `${height}vh`,
          overflowY: overflowY ? 'scroll' : 'auto',
        }}
      >
        {currentItems ? (
          currentItems.length > 0 ? (
            currentItems.map((el) => (
              <li
                key={el.id}
                className="w-full h-[23vh] bg-[#43B9A5] rounded-[0.520833vw] text-[#FFF]"
                style={{
                  marginTop: `${marginTop}vh`,
                }}
              >
                <aside className="w-full h-full px-[1.822917vw] py-[2.592593vh] flex flex-row">
                  <div className="w-[2.529167vw] h-[2.529167vw] flex justify-center items-center border-[0.083333vw] border-[#FFF] rounded-full">
                    <TaskActivityCardIcon />
                  </div>
                  <div className="w-[25%] mt-[1.296296vh] ml-[4vw]">
                    <p className="mb-[2.1296296vh] text-[#FFF] font-bold">{`${
                      el.customer?.first_name || ''
                    } ${el.customer?.last_name || ''}`}</p>
                    <p className="mb-[1.111111vh] text-[#FFF]">{`Assgined to ${
                      el.assigned ? el.assigned?.name : 'Managers'
                    } ${el.assigned ? el.assigned?.last_name : ''} - `}</p>
                    <p className="text-[#FFF]">{`Subject ${el.title}`}</p>
                  </div>
                  <div className="w-[25%] mt-auto mb-auto ml-[4vw]">
                    <p className="mb-[1.111111vh]">{`Due on ${
                      el.deadline &&
                      new Date(el.deadline).toLocaleDateString('en-US', {
                        day: '2-digit',
                        weekday: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    }`}</p>
                    <p>{`Phone # ${el.customer?.mobile_phone || ''}`}</p>
                  </div>
                  <div className="w-[25%] ml-[4vw]">
                    <ButtonContainer marginTop={6} gap={3}>
                      <Button
                        backgroundColor="#FFFFFF10"
                        width={7.083333}
                        height={5.462963}
                        identity="cancelTask"
                        textColor="#FFF"
                        border={0.104167}
                        borderColor="#FFF"
                        buttonText="Cancel"
                        buttonIcon={<CancelWhiteIcon />}
                        iconTextGap={0.7}
                        buttonTextSize={2.2}
                        verticalCenter
                        value={el.id}
                        onClick={handleButtons}
                      />
                      <Button
                        backgroundColor="#FFFFFF10"
                        width={9}
                        height={5.462963}
                        identity="completeTask"
                        textColor="#FFF"
                        border={0.104167}
                        borderColor="#FFF"
                        buttonText="Complete"
                        buttonIcon={<CompleteWhiteIcon />}
                        iconTextGap={0.7}
                        buttonTextSize={2.2}
                        verticalCenter
                        value={el.id}
                        onClick={handleButtons}
                      />
                    </ButtonContainer>
                  </div>
                </aside>
              </li>
            ))
          ) : (
            <li className="mt-[3vh] text-[1.9vh] text-[#43B9A5]">No data available</li>
          )
        ) : (
          <li>No data available</li>
        )}
      </ul>
      <PaginationControl
        currentPage={currentPage}
        onClick={handlePagination}
        totalPages={totalPages}
      />
    </>
  );
}
