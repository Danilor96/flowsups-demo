import { messagesStore, singleCLientDataStore } from '@/store/adminDashboard';
import { LeadCard } from '&/dashboard/clientSystem/clientDetail/leadHistory/leadCard/LeadCard';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  TaskLeadHistory,
  LeadHistory as LeadHistoryType,
} from '@/app/api/customerDetail/leadHistory/type';
import { getLeadHistory } from '@/app/libs/services/customers/profile.services';
import { TaskLeadCard } from '&/dashboard/clientSystem/clientDetail/leadHistory/taskLeadCard/TaskLeadCard';
import { leadsStore } from '@/store/leads';

export function LeadHistory() {
  // ----- global states -----

  const { singleCLientData } = singleCLientDataStore();

  const setMssg = messagesStore((state) => state.setMessages);

  const cheatFetchCount = leadsStore((state) => state.cheatCountForFetch);

  // ----- local states -----
  const [loading, setLoading] = useState(true);
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const [leadHistory, setLeadHistory] = useState<(LeadHistoryType | TaskLeadHistory)[]>([]);

  const observer = useRef<IntersectionObserver | null>(null);

  const fetchData = useCallback(
    async (
      isFirstLoad: boolean,
      currentCursor: string | number | null,
      cheatFetchCount?: boolean,
    ) => {
      setLoading(true);

      try {
        if (singleCLientData) {
          const data = await getLeadHistory({
            customerId: singleCLientData.id,
            currentCursor: currentCursor,
            isFirstLoad: isFirstLoad,
            cheatFetchCount: cheatFetchCount,
          });

          if (data.leadHistoryCombined && data.leadHistoryCombined.length > 0) {
            setLeadHistory((prevState) =>
              isFirstLoad
                ? data.leadHistoryCombined
                : !cheatFetchCount
                  ? [...prevState, ...data.leadHistoryCombined]
                  : [...data.leadHistoryCombined, ...prevState],
            );

            if (!cheatFetchCount) {
              setCurrentCursor(data.nextCursor);
            }
          }
        }
      } catch (error) {
        setMssg('An error occurred');
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    fetchData(true, null);
  }, [fetchData]);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (observer.current) observer.current.disconnect();

      if (!node || loading) return;

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && currentCursor) {
          fetchData(false, currentCursor);
        }
      });

      observer.current.observe(node);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchData, currentCursor],
  );

  useEffect(() => {
    if (cheatFetchCount) {
      fetchData(false, null, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cheatFetchCount]);

  return (
    <div className="w-full">
      <aside className="px-[1.8vw] max-h-[100vh] mt-[2.5vh] flex flex-col gap-[2.407407vh] overflow-y-scroll">
        {leadHistory.length > 0 ? (
          leadHistory.map((data, index) => {
            if (data.type === 'LEAD') {
              if (data.leadNote) {
                return (
                  <div
                    key={`${data.id + index}leadhistory${index * 300 - 27}---`}
                    ref={leadHistory.length - 1 === index ? lastElementRef : null}
                  >
                    <LeadCard
                      leadId={data.leadId || 0}
                      createdAt={data.leadNote.createdAt}
                      text={data.leadNote.note}
                      name={data.createdBy}
                      fromLead={data.lead || ''}
                    />
                  </div>
                );
              }

              return (
                <div
                  key={`${data.id + index}leadhistory${index * 300 - 27}---`}
                  ref={leadHistory.length - 1 === index ? lastElementRef : null}
                >
                  <LeadCard
                    leadId={data.leadId || 0}
                    createdAt={data.createdAt}
                    text={data.lead}
                    name={data.createdBy}
                    fromLead={data.lead || ''}
                  />
                </div>
              );
            }

            return (
              <div
                key={`${data.id + index}leadhistory${index * 300 - 27}---`}
                ref={leadHistory.length - 1 === index ? lastElementRef : null}
              >
                <TaskLeadCard
                  id={data.id}
                  dueDate={data.dueDate}
                  statusId={data.statusId}
                  subject={data.subject}
                  description={data.description}
                  assignedTo={data.assignedTo}
                  createdBy={data.createdBy}
                  createdAt={data.createdAt}
                  finishedAt={data.finishedAt}
                  fromOptionsLeads
                />
              </div>
            );
          })
        ) : (
          <p className="text-[2.777778vh] font-semibold leading-[1.805556vh] text-[#585858]">{`There is no activity`}</p>
        )}
        {loading && (
          <div className="w-full flex justify-center items-center py-5">
            <div className="z-50 ml-2 animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-white text-[#00A78B] rounded-full"></div>
          </div>
        )}
      </aside>
    </div>
  );
}
