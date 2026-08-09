import { SelectDropIcon, StoreReportIcon, StoreReportIconV2, UserIcon } from '@/app/ui/icons/Icons';
import useUiHandler from '@/hooks/closeComponentsHandler';
import { messagesStore } from '@/store/adminDashboard';
import { customerListStore } from '@/store/customerList/customerList.store';
import { CustomerReport } from '@/store/customerList/types';
import { useEffect, useState } from 'react';
import { postCustomerReportAsFavorite } from './customerReport.service';

const CustomerReportSelect = () => {
  const currentReportSelected = customerListStore(state => state.currentCustomerReport);
  const applyCustomerReport = customerListStore(state => state.applyCustomerReport);
  const refreshCustomerReport = customerListStore(state => state.refreshCustomerReport);
  const setMessages = messagesStore(state => state.setMessages);

  const { isOpen, ref, toggleOpen } = useUiHandler();
  const [customerReports, setCustomerReports] = useState<CustomerReport[]>([]);
  const [loading, setLoading] = useState(true);

  const getCustomerReports = async () => {
    setLoading(true);
    fetch('/api/adminDashboard/reports/customer-list')
      .then(res => res.json())
      .then(data => {
        setCustomerReports(data.data);
        setLoading(false);
        if (!currentReportSelected) {
          const reportDefault = data.data.find(
            (report: CustomerReport) => report.defaultBy && report.defaultBy.length > 0
          );
          applyCustomerReport(reportDefault || data.data[0]);
        }
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleSetFavorite = async (id: number, isAsFavorite: boolean) => {
    // Optimistic update
    const originalReports = [...customerReports];

    setCustomerReports(prevReports =>
      prevReports.map(report => {
        if (report.id === id) {
          return { ...report, favoriteBy: isAsFavorite ? [{ id: report.owner_user_id }] : [] };
        }
        return report;
      })
    );

    try {
      const response = await postCustomerReportAsFavorite(id, isAsFavorite);
      const data = await response.json();
      if (response.ok) {
        setMessages(undefined, data.successMessage);
        setLoading(false);
      }
      if (!response.ok) {
        setMessages(data.serverError || data.error);
        setCustomerReports(originalReports);
        setLoading(false);
      }
    } catch (error) {
      setCustomerReports(originalReports);
      setMessages('Server Error');
    }
  };

  useEffect(() => {
    getCustomerReports();
  }, [refreshCustomerReport]);

  const currentReport = currentReportSelected ? currentReportSelected : customerReports[0]
  const allCustomerReport = customerReports.find((report: CustomerReport) => report.id === 0) || null;

  const customerReportsOfCompany = customerReports.filter((report: CustomerReport) => report.for_company);
  const customerReportsOfUser = customerReports.filter((report: CustomerReport) => !report.for_company);

  return (
    <div className="relative flex flex-col min-w-56 max-w-64" ref={ref}>
      <div
        className="w-full flex flex-row items-center pl-2 rounded-l-[0.6vw] border-[#00A78B] rounded-r-[0.6vw] border-[0.13vw] overflow-hidden"
        onClick={() => toggleOpen()}
      >
        <span className="w-[85%] text-[1.666667vh] pr-2 flex items-cente text-[#00A78B] truncate text-nowrap cursor-pointer">
          {currentReport ? currentReport.name : 'All'}
        </span>
        <button onClick={() => toggleOpen()} className="w-[20%] h-[4.8vh] pr-[0.6rem]  flex justify-end items-center">
          <SelectDropIcon color="#00A78B" />
        </button>
      </div>
      {isOpen && (
        <div className="absolute top-[100%] min-w-[65vw] left-0 z-20 mt-1 bg-white border border-gray-400 rounded-lg shadow-xl overflow-hidden">
          <div className="border-b border-gray-300 w-full py-2 text-[#00A78B] bg-gray-100 px-4">
            <div className="flex items-center gap-2">
              <ReportIcon />
              <span className="py-2 font-semibold">Customer Reports</span>
            </div>
          </div>
          <div className="w-full h-full overflow-scroll max-h-[50vh] ">
            <div className="w-full h-full mt-4">
            <span className="w-full text-[0.9rem] text-gray-600 font-semibold px-4 pt-2 flex items-center gap-2">
              <UserIcon size={24} /> My Reports
            </span>
            <ul className="text-sm w-full grid grid-cols-3 gap-x-4 gap-y-2 mt-4 pl-6 pr-4 pb-4 text-gray-600 mb-2 border-b border-gray-200">
              {allCustomerReport && (
                <li
                  className={`flex items-center gap-2 px-4 py-2 pl-10 cursor-pointer hover:bg-gray-200 rounded-lg
                  group
                  ${allCustomerReport.id === currentReport.id ? 'bg-gray-200 text-[#00A78B]' : ''}
                `}
                  onClick={() => applyCustomerReport(allCustomerReport)}
                >
                  {allCustomerReport.name}
                </li>
              )}
              {customerReportsOfUser.slice(1).map(report => (
                <ReportItem
                  report={report}
                  handleSetFavorite={handleSetFavorite}
                  applyCustomerReport={applyCustomerReport}
                  key={report.id}
                  isActive={report.id === currentReport.id}
                />
              ))}
            </ul>
          </div>
          <div className='w-full h-full mt-4'>
            <span className="w-full text-[0.9rem] text-gray-600 font-semibold px-4 pt-2 flex items-center gap-2">
              <StoreReportIconV2 size={24} /> Company Reports
            </span>
            <ul className="w-full grid grid-cols-3 gap-x-4 gap-y-2 mt-4 text-sm pl-6 pr-4 pb-4 text-gray-600 mb-2">
              {customerReportsOfCompany.map(report => (
                <ReportItem
                  report={report}
                  handleSetFavorite={handleSetFavorite}
                  applyCustomerReport={applyCustomerReport}
                  key={report.id}
                  isActive={report.id === currentReport.id}
                />
              ))}
            </ul>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerReportSelect;

interface ItemProps {
  report: CustomerReport;
  handleSetFavorite: (id: number, favorite: boolean) => void;
  applyCustomerReport: (report: CustomerReport) => void;
  isActive: boolean;
}

const ReportItem = ({ report, handleSetFavorite, applyCustomerReport, isActive }: ItemProps) => {
  return (
    <li
      key={report.id}
      className={`flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-200 rounded-lg group 
        ${isActive ? 'bg-gray-200 text-[#00A78B]' : ''} `}
      onClick={() => applyCustomerReport(report)}
    >
      <button
        onClick={e => {
          e.stopPropagation();
          handleSetFavorite(report.id, report.favoriteBy && report.favoriteBy.length > 0 ? false : true);
        }}
        className={`group-hover:visible ${report.favoriteBy && report.favoriteBy.length > 0 ? 'block' : 'invisible'}`}
        title={report.favoriteBy && report.favoriteBy.length > 0 ? 'Remove from favorites' : 'Add to favorites'}
      >
        <HeartIcon filled={report.favoriteBy && report.favoriteBy.length > 0} size={20} />
      </button>
      {report.defaultBy && report.defaultBy.length > 0 && <StarIcon size={20} />}
      {report.name}
    </li>
  );
};

const ReportIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M8 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h5.697" />
      <path d="M18 14v4h4" />
      <path d="M18 11v-4a2 2 0 0 0 -2 -2h-2" />
      <path d="M8 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
      <path d="M18 18m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
      <path d="M8 11h4" />
      <path d="M8 15h3" />
    </svg>
  );
};

const HeartIcon = ({ filled, size = 24 }: { filled: boolean , size?: number}) => {
  return filled ? (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
    </svg>
  );
};

const StarIcon = ({ size = 24 }: { size?: number}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" />
    </svg>
  );
};
