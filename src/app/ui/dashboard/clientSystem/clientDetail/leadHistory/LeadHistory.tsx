import { messagesStore, singleCLientDataStore } from '@/store/adminDashboard';
import { LeadCard } from './leadCard/LeadCard';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getLeadHistory } from '@/app/libs/services/customers/profile.services';
import {
  LeadHistory as LeadHistoryType,
  TaskLeadHistory,
} from '@/app/api/customerDetail/leadHistory/type';
import { TaskLeadCard } from './taskLeadCard/TaskLeadCard';

export function LeadHistory() {
  // ----- global satates -----

  const { singleCLientData } = singleCLientDataStore();

  const setMssg = messagesStore((state) => state.setMessages);

  // ----- local states -----
  const [loading, setLoading] = useState(true);
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const [leadHistory, setLeadHistory] = useState<(LeadHistoryType | TaskLeadHistory)[]>([]);

  const observer = useRef<IntersectionObserver | null>(null);

  const fetchData = useCallback(
    async (isFirstLoad: boolean, currentCursor: string | number | null) => {
      setLoading(true);

      try {
        if (singleCLientData) {
          const data = await getLeadHistory({
            customerId: singleCLientData.id,
            currentCursor: currentCursor,
            isFirstLoad: isFirstLoad,
          });

          if (data.leadHistoryCombined && data.leadHistoryCombined.length > 0) {
            setLeadHistory((prevState) =>
              isFirstLoad ? data.leadHistoryCombined : [...prevState, ...data.leadHistoryCombined],
            );
            setCurrentCursor(data.nextCursor);
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

  return (
    <aside className="w-[73.489583vw] h-[40vh] flex flex-col gap-[1.666667vh] pb-2">
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
                    leadId={data.leadId}
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
                  leadId={data.leadId}
                  createdAt={data.createdAt}
                  text={data.lead}
                  name={data.createdBy}
                  fromLead={data.lead}
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
  );
}
