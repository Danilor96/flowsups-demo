import { Button } from '@/app/ui/buttons/Button';
import { AddUserIcon, ReportIcon, UserIcon } from '@/app/ui/icons/Icons';
import { Input } from '@/app/ui/inputs/Input';
import { ModalContainer } from '@/app/ui/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '@/app/ui/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '@/app/ui/modalWindowsStructure/ModalContent';
import { ModalWindow } from '@/app/ui/modalWindowsStructure/ModalWindow';
import { adminDashboardStore, messagesStore } from '@/store/adminDashboard';
import { customerListStore } from '@/store/customerList/customerList.store';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { UserPermissionsTable } from './Permision/UserPermissionsTable';
import { useUserPermission } from './Permision/useUserPermission';
import { CheckboxInput } from '@/app/ui/inputs/CheckboxInput';

export const SaveReportAsForm = ({
  setSuccessMessage,
  setErrorMessage,
  onForComapanyChange
}: {
  setSuccessMessage: (message: string) => void;
  setErrorMessage: (message: string) => void;
  onForComapanyChange?: (forCompany: boolean) => void;
}) => {
  const filters = customerListStore(state => state.filters);
  const sortConfig = customerListStore(state => state.sortConfig);
  const advancedFilters = customerListStore(state => state.advancedFilters);
  const viewType = customerListStore(state => state.viewType);
  const toggleSaveAsModal = customerListStore(state => state.toggleSaveAsModal);
  const refreshCustomerReportToggle = customerListStore(state => state.refreshCustomerReportToggle);

  const session = useSession();
  const userHas = session.data?.user.user_has;
  const userIsManager = userHas?.some(
    userHas => userHas.role_id === 3 || userHas.role_id === 4 || userHas.role_id === 1 || userHas.role_id === 2
  );

  const [loading, setLoading] = useState(false);
  const [reportName, setReportName] = useState('');
  const [forCompany, setForCompany] = useState(false);
  const { users, idsSelected, onlyManagers, handleUserSelect, setIdsSelected, setOnlyManagers } = useUserPermission();

  const [fieldErrors, setFieldErrors] = useState<{ name: string }>({
    name: ''
  });

  const postCustomerReport = async () => {
    if (!reportName) return setErrorMessage('Report name is required');
    const allowedUserIds = idsSelected.length > 0 ? idsSelected : undefined;
    try {
      setLoading(true);
      const response = await fetch('/api/adminDashboard/reports/customer-list', {
        method: 'POST',
        body: JSON.stringify({
          filters: filters,
          sortConfig,
          advancedFilters,
          viewType,
          name: reportName,
          forCompany,
          allowedUserIds
        })
      });
      const resJson = await response.json();
      if (resJson.successMessage) {
        setSuccessMessage(resJson.successMessage);
        toggleSaveAsModal();
        refreshCustomerReportToggle();
      }

      if (resJson.fieldErrors) {
        setFieldErrors(resJson.fieldErrors);
        setErrorMessage(resJson.fieldErrors.name || 'Please, fix the errors in the form');
      }

      if (resJson.serverError) {
        setErrorMessage(resJson.serverError);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error saving report:', error);
      setLoading(false);
    }
  };

  return (
    <div className="">
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
          {fieldErrors.name && <p className="text-[1.666667vh] text-[#F00]">{fieldErrors.name}</p>}
        </div>
        <div className="flex flex-col mt-6 gap-2">
          <span className=" text-[#999999]">Category</span>
          <div className="flex gap-4">
            <button
              className={`border-2 border-[#C9EBE6] rounded-2xl flex flex-col justify-center items-center gap-4 w-32 h-32  text-[#00A78B]
                ${!forCompany && 'bg-[#C9EBE6]'}
                `}
              onClick={() => {
                setForCompany(false);
                if (onForComapanyChange) onForComapanyChange(false);
                setOnlyManagers(false);
                setIdsSelected([]);
              }}
            >
              <UserIcon />
              <span>My Reports</span>
            </button>
            <button
              className={`border-2 border-[#C9EBE6] rounded-2xl flex flex-col justify-center items-center gap-4 w-32 h-32  text-[#00A78B]
                ${forCompany && 'bg-[#C9EBE6]'} ${!userIsManager ? 'hidden' : ''}`}
              onClick={() => {
                setForCompany(true);
                if (onForComapanyChange) onForComapanyChange(true);
              }}
              disabled={!userIsManager}
            >
              <ReportIcon />
              <span>Company</span>
            </button>
          </div>
        </div>
        <div className="mt-2">
          {forCompany && (
            <div className="min-w-[40vw] max-h-[35vh] overflow-y-auto pr-1 relative">
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
              <UserPermissionsTable users={users} handleSelect={handleUserSelect} idsSelected={idsSelected} />
            </div>
          )}
        </div>
      </div>
      <div className="w-full flex justify-end pt-4 mt-3">
        <button
          className="bg-[#00A78B] text-white px-4 py-2 rounded-lg min-w-32 flex items-center justify-center"
          onClick={postCustomerReport}
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
  );
};

export const SaveReportAsModal = () => {
  const toggleSaveAsModal = customerListStore(state => state.toggleSaveAsModal);

  const setMessages = messagesStore(state => state.setMessages);
  const [forCompany, setForCompany] = useState(false);
  return (
    <ModalWindow top={-12} zIndex={600} height={110} minSizeFull>
      <ModalContainer marginTop={!forCompany ? 18 : 2} width={!forCompany ? 36 : 50}>
        <ModalContainerTitle title="Save Report" closeWindowFunction={toggleSaveAsModal} />
        <ModalContent widthFull>
          <SaveReportAsForm
            setSuccessMessage={message => setMessages(undefined, message)}
            setErrorMessage={message => setMessages(message)}
            onForComapanyChange={setForCompany}
          />
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
};
