import { CheckboxInput } from '@/app/ui/inputs/CheckboxInput';
import { ModalContainer } from '@/app/ui/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '@/app/ui/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '@/app/ui/modalWindowsStructure/ModalContent';
import { ModalWindow } from '@/app/ui/modalWindowsStructure/ModalWindow';
import { messagesStore } from '@/store/adminDashboard';
import { customerListStore } from '@/store/customerList/customerList.store';
import { CustomerReport } from '@/store/customerList/types';
import { useEffect, useState } from 'react';
import { UserPermissionsTable } from './UserPermissionsTable';
import { useUserPermission } from './useUserPermission';

const PermisionModal = () => {
  const [openClosepermissionsModal, currentCustomerReport, refreshCustomerReportToggle] = customerListStore(state => [
    state.openClosePermissionsModal,
    state.currentCustomerReport,
    state.refreshCustomerReportToggle
  ]);
  const setMessages = messagesStore(state => state.setMessages);
  const [loading, setLoading] = useState(false);
  const [customerRerportWhitPermission, setCustomerRerportWhitPermission] = useState<CustomerReport | null>(null);
  const { users, idsSelected, onlyManagers, handleUserSelect, setIdsSelected, setOnlyManagers } = useUserPermission();

  const handleSave = async () => {
    setLoading(true);
    const response = await fetch(`/api/adminDashboard/reports/customer-list/${currentCustomerReport?.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        userIds: idsSelected
      })
    });
    const resJson = await response.json();
    if (resJson.successMessage) {
      setMessages(undefined, resJson.successMessage);
      refreshCustomerReportToggle();
    } else {
      setMessages(resJson.serverError || resJson.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fechtCustomerReportWhitPermission = (reportId: number) => {
      setLoading(true);
      fetch(`/api/adminDashboard/reports/customer-list/${reportId}`)
        .then(res => res.json())
        .then((data: { data: CustomerReport }) => {
          setCustomerRerportWhitPermission(data.data);
          setIdsSelected(data.data.permissions.map(per => per.userId));
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    };
    if (currentCustomerReport) {
      fechtCustomerReportWhitPermission(currentCustomerReport?.id);
    }
  }, [currentCustomerReport]);

  return (
    <ModalWindow top={0} positionFixed>
      <ModalContainer marginTop={12} width={50} height={80}>
        <ModalContainerTitle title="Manage Permissions" closeWindowFunction={openClosepermissionsModal} />
        <ModalContent overflowVisible height={72}>
          <div className="w-full h-full relative flex flex-col justify-between">
            <div className="overflow-auto pr-2">
              <div className="w-full justify-between flex mb-4">
                <span className="text-gray-600">
                  Report: <span className="font-semibold">{currentCustomerReport?.name || ''}</span>
                </span>
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
              {customerRerportWhitPermission && (
                <UserPermissionsTable users={users} handleSelect={handleUserSelect} idsSelected={idsSelected} />
              )}
              {loading && !customerRerportWhitPermission && (
                <div className="w-full min-h-[40vh] flex justify-center items-center">
                  <div
                    className="z-50 ml-2 animate-spin inline-block w-16 h-16 border-[3px] border-current border-t-transparent text-[#00A78B] rounded-full"
                    style={{ borderTopColor: 'white' }}
                  ></div>
                </div>
              )}
            </div>
            <div className="flex justify-end self-end">
              <button
                className="bg-[#00A78B] text-white px-4 py-2 rounded-lg min-w-32 flex items-center justify-center self-end mt-4 shadow-lg"
                onClick={() => handleSave()}
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
};

export default PermisionModal;
