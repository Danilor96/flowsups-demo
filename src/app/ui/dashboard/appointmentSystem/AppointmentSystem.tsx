import { adminDashboardStore, dailyTotalsStore, modalWindowStore } from '@/store/adminDashboard';
import { useCallback } from 'react';
import { AppointmentCalendar } from '&/dashboard/appointmentSystem/appointmentCalendar/AppointmentCalendar';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { Loader } from '&/miscellaneous/loader/Loader';
import { useLoadingGetData } from '@/hooks/loadingGetData';

export function AppointmentSystem() {
  // ---- global states ----

  const { closeAppointmentCustomersList } = modalWindowStore();

  const { getAppointments } = adminDashboardStore();

  const { getTodayAppointments } = dailyTotalsStore();

  const getPromiseData = useCallback(() => {
    return [getTodayAppointments(), getAppointments()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loading } = useLoadingGetData(getPromiseData);

  // ---- local states ----

  return (
    <ModalWindow zIndex={60}>
      <ModalContainer width={84.010417} marginTop={4.444444}>
        <ModalContainerTitle
          title="Appointment"
          closeWindowFunction={closeAppointmentCustomersList}
        />
        <ModalContent height={106}>
          {loading && <Loader zIndex={200} />}
          <AppointmentCalendar />
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
