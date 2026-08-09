import { ModalContainer } from '@/app/ui/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '@/app/ui/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '@/app/ui/modalWindowsStructure/ModalContent';
import { ModalWindow } from '@/app/ui/modalWindowsStructure/ModalWindow';
import { messagesStore } from '@/store/adminDashboard';
import { customerListStore } from '@/store/customerList/customerList.store';
import { AdvanceFilter } from './advanceFilter/AdvanceFilter';
import { ReportInformation } from './reportInformation/ReportInformation';
import { useState } from 'react';
import { FilterableField } from '@/store/customerList/types';

export function AddNewReportModal({
  toggleOpenBtn,
  filterableFields,
}: // filters,
{
  toggleOpenBtn: () => void;
  filterableFields: FilterableField[];
  // filters: AppliedFilter;
}) {
  const setMessages = messagesStore((state) => state.setMessages);
  const toggleNewReportModal = customerListStore((state) => state.toggleNewCustomerReportModal);
  const refreshCustomerReportToggle = customerListStore(
    (state) => state.refreshCustomerReportToggle,
  );

  const [reportName, setReportName] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([
    { id: '0', field: '0', condition: '', value: null },
  ]);
  const [columnsSelected, setColumnsSelected] = useState<
    { id: string; label: string; checked: boolean }[]
  >([]);
  const [loading, setLoading] = useState(false);
  //   const { filters, updateFilter, clearFilters } = useFilters();
  const [forCompany, setForCompany] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ name: string }>({
    name: '',
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
          // filters: filters,
          sortConfig: { key: null, direction: 'ascending' },
          advancedFilters: notHasAdvancedFilters ? [] : appliedFilters,
          columnsConfig: columnsSelected,
          name: reportName,
          forCompany,
          allowedUserIds: allowedUserIds.length > 0 ? allowedUserIds : undefined,
        }),
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
        <ModalContainerTitle title="Add New Customer Report" closeWindowFunction={toggleOpenBtn} />
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
            <AdvanceFilter filterableFields={filterableFields} />
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
