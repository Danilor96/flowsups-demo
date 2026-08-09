import { Input } from '@/app/ui/inputs/Input';
import { ResportButtons } from './ReportButtons/ReportButtons';
import CustomerReportSelect from './CustomerReportsSelect/CustomerReportSelects';

const ExtraTitleButtons = ({
  filterToggle,
  isFilterVisible,
  tableViewOnChange,
  viewType = 2,
  handleRefreshButtonClick
}: {
  filterToggle: () => void;
  isFilterVisible: boolean;
  tableViewOnChange: (number: number) => void;
  viewType: number;
  handleRefreshButtonClick: () => void;
}) => {
  return (
    <div className="ml-4 flex gap-3 justify-center items-center w-fit">
      <CustomerReportSelect />
      <div className="h-fit flex items-center justify-center">
        <Input
          backgroundColor={'#FFF'}
          border={0.13}
          borderColor={'#00A78B'}
          borderRadius={0.6}
          textAlterColor={'#00A78B'}
          labelSameColor={true}
          label=""
          name="detailView"
          type="select"
          value={viewType.toString()}
          options={[
            { value: 1, option: 'Detail View' },
            { value: 2, option: 'List View' }
          ]}
          width={8}
          onChange={e => tableViewOnChange(parseInt(e.target.value))}
        />
      </div>
      <button
        onClick={filterToggle}
        className="w-[40px] h-[35px] p-[10px] flex items-center justify-center bg-[#00A78B] rounded-[16px]
        hover:scale-105 transition-all
        "
        title={isFilterVisible ? 'Hide filters' : 'Show filters'}
      >
        {isFilterVisible ? (
          <svg width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M26.8994 0.333008H1.06604C0.956987 0.341421 0.855147 0.390764 0.780958 0.471136C0.706768 0.551508 0.665717 0.656963 0.666041 0.766341V2.19967C0.66504 2.34659 0.693257 2.49223 0.749051 2.62814C0.804845 2.76405 0.887103 2.88751 0.991041 2.99134L10.991 12.9913V21.3247L17.0327 24.333V12.9747L27.0327 2.97467C27.224 2.76831 27.3311 2.49774 27.3327 2.21634V0.766341C27.3327 0.651414 27.2871 0.541194 27.2058 0.459928C27.1245 0.378663 27.0143 0.333008 26.8994 0.333008Z"
              fill="white"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={34}
            height={34}
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 4h12v2.172a2 2 0 0 1 -.586 1.414l-3.914 3.914m-.5 3.5v4l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227" />
            <path d="M3 3l18 18" stroke="white" />
          </svg>
        )}
      </button>
      <button
        className="w-[40px] h-[35px] p-[10px] flex items-center justify-center bg-[#00A78B] rounded-[16px]
        hover:scale-105 transition-all
        "
        onClick={handleRefreshButtonClick}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_2_48616)">
            <path
              d="M6.53125 15.7812H2.40625M2.40625 15.7812C2.40625 15.7812 5.84375 20.5938 11 20.5938C15.7465 20.5938 19.5938 17.1562 19.5938 13.0312M2.40625 15.7812V20.5938M15.4688 8.21875H19.5938M19.5938 8.21875C19.5938 8.21875 16.1562 3.40625 11 3.40625C6.2535 3.40625 2.40625 6.84375 2.40625 10.9688M19.5938 8.21875V3.40625"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_2_48616">
              <rect width="22" height="22" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </button>
      <ResportButtons />
    </div>
  );
};

export default ExtraTitleButtons;
