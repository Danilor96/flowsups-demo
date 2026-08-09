import {
  modalWindowStore,
  creditAppInputsStore,
  messagesStore,
  creditAppPaginationStore,
  singleCLientDataStore,
  adminDashboardStore,
} from '@/store/adminDashboard';
import { Start } from './start/Start';
import { Address } from './address/Address';
import { EmploymentStatus } from './employmentStatus/EmploymentStatus';
import { References } from './references/References';
import { HeaderNavigation } from './headerNavigation/HeaderNavigation';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { getData } from './creditApp.services';
import { useCallback } from 'react';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { creditAppStore } from '@/store/creditApp';

export function CreditApp() {
  // ----- global states -----
  const { closeClientCreditApp } = modalWindowStore();

  const { clearCreditAppInputs, clearCreditAppStart } = creditAppInputsStore();

  const { messages } = messagesStore();

  const { currentPage } = creditAppPaginationStore();
  const { resetCurrentPage } = creditAppPaginationStore();

  const { setCreditApp } = creditAppStore();

  const { getStates } = adminDashboardStore();

  const { singleCLientData } = singleCLientDataStore();

  const getPromiseData = useCallback(() => {
    return [fetchData(), getStates()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loading } = useLoadingGetData(getPromiseData);

  // ----- local states -----

  const fetchData = async () => {
    const res = await getData(singleCLientData?.id);

    setCreditApp(res);
  };

  const handleCloseWindow = () => {
    resetCurrentPage();
    clearCreditAppInputs();
    clearCreditAppStart();
    closeClientCreditApp();
  };

  return (
    <ModalWindow
      top={0}
      successMessage={messages.successMessage}
      failMessage={messages.serverError}
      positionFixed
      height={100}
    >
      <ModalContainer width={89.583333} marginTop={7.5}>
        <ModalContainerTitle title="Credit App" closeWindowFunction={handleCloseWindow} />
        <HeaderNavigation />
        {currentPage === 1 && <Start />}
        {currentPage === 2 && <Address />}
        {currentPage === 3 && <EmploymentStatus />}
        {currentPage === 4 && <References />}
      </ModalContainer>
    </ModalWindow>
  );
}
