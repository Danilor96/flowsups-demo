import { Button } from '@/app/ui/buttons/Button';
import { DownArrow, ReportIcon, SelectDropIcon } from '@/app/ui/icons/Icons';
import { Input } from '@/app/ui/inputs/Input';
import { ModalContainer } from '@/app/ui/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '@/app/ui/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '@/app/ui/modalWindowsStructure/ModalContent';
import { ModalWindow } from '@/app/ui/modalWindowsStructure/ModalWindow';
import { messagesStore } from '@/store/adminDashboard';
import { customerListStore, initialFilterState } from '@/store/customerList/customerList.store';
import { useEffect, useState } from 'react';
import { AdvancedFiltersPanel } from '../AdvancedFilters/AdvanceFilters';
import { AdvancedFilterRow } from '../AdvancedFilters/AdvanceFilterRow';
import { AppliedFilter, filter, ListViewTypes } from '@/store/customerList/types';
import { CheckboxInput } from '@/app/ui/inputs/CheckboxInput';
import { useFilters } from '../../customerLists/Filter/useFilters';
import CustomerListFilter from '../../customerLists/Filter';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { UserPermissionsTable } from '../ReportButtons/Permision/UserPermissionsTable';
import { useUserPermission } from '../ReportButtons/Permision/useUserPermission';

export function AddNewCustomerReportModal() {
  const setMessages = messagesStore(state => state.setMessages);
  const toggleNewReportModal = customerListStore(state => state.toggleNewCustomerReportModal);
  const refreshCustomerReportToggle = customerListStore(state => state.refreshCustomerReportToggle);

  const [reportName, setReportName] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([
    { id: '0', field: '0', condition: '', value: null }
  ]);
  const [columnsSelected, setColumnsSelected] = useState<{ id: string; label: string; checked: boolean }[]>([]);
  const [viewType, setViewType] = useState<number>(2);
  const [loading, setLoading] = useState(false);
  const { filters, updateFilter, clearFilters } = useFilters();
  const [forCompany, setForCompany] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ name: string }>({
    name: ''
  });
  const [allowedUserIds, setAllowedUserIds] = useState<number[]>([]);

  const setSuccessMessage = (message: string) => {
    setMessages(undefined, message);
  };

  const setErrorMessage = (message: string) => {
    setMessages(message);
  };

  const handleSaveReport = async () => {
    if (!reportName) return setErrorMessage('Report name is required');
    const notHasAdvancedFilters = appliedFilters.length === 1 && appliedFilters[0].field === '0';

    try {
      setLoading(true);
      const response = await fetch('/api/adminDashboard/reports/customer-list', {
        method: 'POST',
        body: JSON.stringify({
          filters: filters,
          sortConfig: { key: null, direction: 'ascending' },
          advancedFilters: notHasAdvancedFilters ? [] : appliedFilters,
          viewType: viewType === 2 ? ListViewTypes.ListView : ListViewTypes.DetailView,
          columnsConfig: columnsSelected,
          name: reportName,
          forCompany,
          allowedUserIds: allowedUserIds.length > 0 ? allowedUserIds : undefined
        })
      });
      const resJson = await response.json();
      if (resJson.successMessage) {
        setSuccessMessage(resJson.successMessage);
        toggleNewReportModal();
        refreshCustomerReportToggle();
      }

      if (resJson.fieldErrors) {
        setFieldErrors(resJson.fieldErrors);
        setErrorMessage(resJson.fieldErrors.name || 'Please, fix the errors in the form');
      }

      if (resJson.serverError) {
        setErrorMessage(resJson.serverError || resJson.error);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error saving report:', error);
      setLoading(false);
    }
  };

  return (
    <ModalWindow top={-12} zIndex={60} height={110} minSizeFull>
      <ModalContainer marginTop={2} width={60}>
        <ModalContainerTitle title="Add New Customer Report" closeWindowFunction={toggleNewReportModal} />
        <ModalContent widthFull>
          <div className="flex flex-col gap-4">
            <ReportInformation
              forCompany={forCompany}
              setForCompany={setForCompany}
              reportName={reportName}
              setReportName={setReportName}
              nameFieldErrors={fieldErrors.name}
              onAllowedUserIdsChange={(allowedUserIds) => setAllowedUserIds(allowedUserIds)}
            />
            <Columns
              viewType={viewType}
              setViewType={setViewType}
              columnsSelected={columnsSelected}
              setColumnsSelected={setColumnsSelected}
            />
            <AdvancedFilterSection
              basicFilters={filters}
              appliedFilters={appliedFilters}
              setAppliedFilters={setAppliedFilters}
              updateFilterBasic={updateFilter}
              clearBasicFilters={clearFilters}
            />
            <div className="flex justify-end">
              <button
                className="bg-[#00A78B] text-white px-4 py-2 rounded-lg min-w-32 flex items-center justify-center"
                onClick={handleSaveReport}
                disabled={loading}
              >
                Save
                {loading && (
                  <div
                    className="ml-2 animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-[#00A78B] rounded-full"
                    style={{ borderTopColor: 'white' }}
                  ></div>
                )}
              </button>
            </div>
          </div>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}

const ContainerSection = ({ children, title }: { children: React.ReactNode; title: string }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="w-full flex flex-col border border-[#C9EBE6] rounded-xl overflow-hidden">
      <button
        className="h-[20%] bg-[#C9EBE6] flex items-center justify-between px-4 py-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h6 className="text-[#00A78B] text-lg font-semibold">{title}</h6>
        <SelectDropIcon color="#00A78B" />

        {/* </div> */}
      </button>
      <div
        className={`h-[80%] px-6 py-4 transition-all duration-300 opacity-${isOpen ? '100' : '0'} ${
          isOpen ? 'block ' : 'hidden'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const ReportInformation = ({
  reportName,
  setReportName,
  forCompany,
  setForCompany,
  nameFieldErrors = null,
  onAllowedUserIdsChange
}: {
  reportName: string;
  setReportName: (name: string) => void;
  forCompany: boolean;
  setForCompany: (forCompany: boolean) => void;
  nameFieldErrors?: string | null;
  onAllowedUserIdsChange?: (allowedUserIds: number[]) => void;
}) => {
  const session = useSession();
  const userHas = session.data?.user.user_has;
  const userIsManager = userHas?.some(
    userHas => userHas.role_id === 3 || userHas.role_id === 4 || userHas.role_id === 1 || userHas.role_id === 2
  );

  const { users, idsSelected, onlyManagers, handleUserSelect, setIdsSelected, setOnlyManagers } = useUserPermission();

  useEffect(() => {
    if (onAllowedUserIdsChange) {
      onAllowedUserIdsChange(idsSelected);
    }
  }, [idsSelected, onAllowedUserIdsChange]);

  return (
    <ContainerSection title="Report Information">
      <div>
        <div className="flex flex-col gap-2">
          <Input
            label="Report name"
            name="name"
            type="text"
            placeholder="Enter name"
            width={32}
            borderRadius={0.6}
            value={reportName}
            onChange={e => {
              if (e.target.value === ' ') return;
              setReportName(e.target.value);
            }}
          />
          {nameFieldErrors && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="text-[1.666667vh] text-[#F00]"
            >
              {nameFieldErrors}
            </motion.p>
          )}
        </div>
        <div className="flex flex-col mt-6 gap-2">
          <span className=" text-[#999999]">Category</span>
          <div className="flex gap-4">
            <button
              className={`border-2 border-[#C9EBE6] rounded-2xl flex flex-col justify-center items-center 
                gap-4 w-32 h-32  text-[#00A78B] ${!forCompany && 'bg-[#C9EBE6]'} `}
              onClick={() => setForCompany(false)}
            >
              <svg width="34" height="34" viewBox="0 0 45 69" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0 69H45V56.6786C44.9952 52.1052 43.3343 47.7206 40.3817 44.4867C37.429 41.2529 33.4257 39.4338 29.25 39.4286H15.75C11.5743 39.4338 7.571 41.2529 4.61833 44.4867C1.66566 47.7206 0.00476406 52.1052 0 56.6786V69ZM6.75 17.25C6.75 20.6617 7.67372 23.9968 9.40435 26.8336C11.135 29.6703 13.5948 31.8813 16.4727 33.1869C19.3507 34.4925 22.5175 34.8341 25.5727 34.1685C28.6279 33.5029 31.4343 31.86 33.6369 29.4476C35.8396 27.0351 37.3397 23.9615 37.9474 20.6153C38.5551 17.2691 38.2432 13.8007 37.0511 10.6487C35.859 7.49669 33.8403 4.8026 31.2502 2.90715C28.6602 1.0117 25.6151 0 22.5 0C18.3228 0 14.3168 1.81741 11.3631 5.05241C8.40937 8.28741 6.75 12.675 6.75 17.25Z"
                  fill="#00A78B"
                />
              </svg>
              <span>My Reports</span>
            </button>
            <button
              className={`border-2 border-[#C9EBE6] rounded-2xl flex flex-col justify-center items-center gap-4 w-32 h-32 
                 text-[#00A78B] ${forCompany && 'bg-[#C9EBE6]'} ${!userIsManager ? 'hidden' : ''}`}
              onClick={() => setForCompany(true)}
              disabled={!userIsManager}
            >
              <ReportIcon />
              <span>Company</span>
            </button>
          </div>
        </div>
        <div className="mt-2">
          {forCompany && (
            <div className="min-w-[40vw] max-h-[33vh] overflow-y-auto pr-1 relative">
              <div className="w-full justify-end flex mb-2 sticky top-0 bg-white z-10">
                <CheckboxInput
                  name="onlyManagers"
                  value={''}
                  checked={onlyManagers}
                  onChange={e => {
                    setOnlyManagers(e.target.checked);
                  }}
                  chekcboxText="This is a Management Report"
                />
              </div>
              <UserPermissionsTable
                users={users}
                handleSelect={handleUserSelect}
                idsSelected={idsSelected}
              />
            </div>
          )}
        </div>
      </div>
    </ContainerSection>
  );
};

const Columns = ({
  viewType,
  columnsSelected,
  setColumnsSelected,
  setViewType
}: {
  viewType: number;
  columnsSelected: { id: string; checked: boolean; label: string }[];
  setViewType: (viewType: number) => void;
  setColumnsSelected: (columns: { id: string; checked: boolean; label: string }[]) => void;
}) => {
  const columns = [
    {
      id: 'customer_name',
      label: 'Customer Name'
    },
    {
      id: 'assigned_to',
      label: 'Assigned To'
    },
    {
      id: 'phone_number',
      label: 'Phone'
    },
    {
      id: 'credit_app',
      label: 'Credit App'
    },
    {
      id: 'source',
      label: 'Source'
    },
    {
      id: 'city',
      label: 'City'
    },
    {
      id: 'state',
      label: 'State'
    },
    {
      id: 'status',
      label: 'Status'
    },
    {
      id: 'created_date',
      label: 'Created Date'
    },
    {
      id: 'created_by',
      label: 'Created By'
    },
    {
      id: 'interested_vehicle',
      label: 'Interested Vehicle'
    },
    {
      id: 'lead_info',
      label: 'Lead Info (detail view)'
    },
    {
      id: 'date',
      label: 'Date (detail view)'
    }
  ];
  const handleCheckboxChange = (columnId: string, label: string) => {
    const newColumnsSelected = [...columnsSelected];
    let existingColumn = newColumnsSelected.find(column => column.id === columnId);
    if (existingColumn) {
      existingColumn.checked = !existingColumn.checked;
      return setColumnsSelected(newColumnsSelected.map(column => (column.id === columnId ? existingColumn : column)));
    } else {
      newColumnsSelected.push({ id: columnId, checked: true, label: label });
      return setColumnsSelected(newColumnsSelected);
    }
  };

  return (
    <ContainerSection title="Columns">
      <div>
        <div className="mb-4">
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
            width={10}
            onChange={e => setViewType(Number(e.target.value))}
          />
        </div>
        <span className=" text-[#B3B3B3]">Add or remove columns.</span>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {columns.map((option, index) => (
            <div key={option.id} className="flex items-center space-x-2">
              {option && (
                <>
                  <CheckboxInput
                    name={option.label}
                    chekcboxText=""
                    checked={columnsSelected.some(item => {
                      const checked = item.checked;
                      return item.id === option.id && checked;
                    })}
                    onChange={() => handleCheckboxChange(option.id, option.label)}
                  />
                  <span className="text-sm text-gray-600">{option.label}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </ContainerSection>
  );
};

const AdvancedFilterSection = ({
  appliedFilters,
  basicFilters,
  setAppliedFilters,
  updateFilterBasic,
  clearBasicFilters
}: {
  appliedFilters: AppliedFilter[];
  basicFilters: filter;
  setAppliedFilters: (filters: AppliedFilter[]) => void;
  updateFilterBasic: (updatedFilter: Partial<filter>) => void;
  clearBasicFilters: () => void;
}) => {
  const addFilter = () => {
    setAppliedFilters([...appliedFilters, { id: Date.now().toString(), field: '', condition: '', value: null }]);
  };
  const handleClearAll = () => {
    setAppliedFilters([{ id: '0', field: '0', condition: '', value: null }]);
    // onApplyFilters([]);
  };

  const updateFilter = (updatedFilter: AppliedFilter) => {
    setAppliedFilters(appliedFilters.map(f => (f.id === updatedFilter.id ? updatedFilter : f)));
  };

  const removeFilter = (filterId: string) => {
    const newFilters = appliedFilters.filter(f => f.id !== filterId);
    if (newFilters.length === 0) {
      newFilters.push({ id: '0', field: '0', condition: '', value: null });
    }
    setAppliedFilters(newFilters);
    // onApplyFilters(newFilters);
  };

  return (
    <ContainerSection title="Advanced Filter">
      <div className="my-4">
        <CustomerListFilter
          filters={basicFilters}
          updateFilter={updateFilterBasic}
          clearFilters={clearBasicFilters}
          visibleFiltersOptions={{
            customerName: true,
            dateFilters: true,
            leadSource: true,
            leadType: true,
            status: true,
            asignedToBdcId: true,
            asignedToManagerId: true,
            assignedToSellerId: true
          }}
        />
      </div>
      <div>
        {/* <div className="flex items-center gap-4 mb-4">
          <button className="bg-teal-100 text-teal-700 py-2 px-4 rounded-lg ">AND</button>
          <button className="bg-teal-100 text-teal-700 py-2 px-4 rounded-lg ">OR</button>
        </div> */}
        <span className="text-gray-400">Advanced</span>
        <div
          className={` z-20 top-full mt-2 min-w-[400px] max-w-[800px] right-0 p-4 border border-gray-300 rounded-lg shadow-lg bg-white`}
        >
          <div
            id="container-advanced-filters"
            // ref={filtersContainerRef}
            className="max-h-[30vh] overflow-auto scroll-smooth"
          >
            {appliedFilters.map(filter => (
              <AdvancedFilterRow key={filter.id} filter={filter} onUpdate={updateFilter} onRemove={removeFilter} />
            ))}
          </div>
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
            <button
              onClick={addFilter}
              className="w-full sm:w-auto bg-[#00A78B] hover: py-2 px-4 text-white font-normal rounded-[10px] shadow"
            >
              Add New Filter
            </button>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={handleClearAll}
                className="w-full sm:w-auto bg-gray-200 hover:bg-gray-400 text-gray-600 font-semibold py-2 px-4 rounded-[10px] shadow"
              >
                Clear All
              </button>
              {/* <button
                onClick={handleApply}
                className="w-full sm:w-auto bg-[#00A78B] py-2 px-4 text-white font-normal rounded-[10px] shadow"
              >
                Apply
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </ContainerSection>
  );
};

export default AddNewCustomerReportModal;
