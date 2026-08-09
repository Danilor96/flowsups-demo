import {
  adminDashboardStore,
  currentSectionStore,
  messagesStore,
  modalWindowStore,
} from '@/store/adminDashboard';
import { useCallback, useEffect, useState } from 'react';
import { useSocketStore } from '@/store/socketIo';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { CustomerName } from '&/miscellaneous/customerName/CustomerName';
import { CustomerContactFormat } from '&/miscellaneous/customerContactFormat/CustomerContactFormat';
import { UserAssignedName } from '&/miscellaneous/userAssignedName/UserAssignedName';
import { dateFormatsStore } from '@/store/dateFormats';
import { VehicleFormat } from '&/miscellaneous/vehicleFormat/VehicleFormat';
import { DottedOptionsButton } from '&/miscellaneous/dottedOptionsButton/DottedOptionsButton';
import { useSession } from 'next-auth/react';
import { useDynamicTableColumns } from '../table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '../table/coloredTable/v2';
import { DailyMadeAppointment } from '@/app/libs/definitions';
import { StatusBtn } from './cards/dailyActivity/content/tableOne/statusBtn/StatusBtn';
import { Can } from '../auth/Can';
import { SpecialBtn } from './cards/dailyActivity/content/tableOne/specialBtn/SpecialBtn';

export function DailyAppointment() {
  // ----- global states -----
  const { data: session } = useSession();

  const userId = session?.user.id;

  const { closeDailyAppointments } = modalWindowStore();

  const { dailyMadeAppointments } = adminDashboardStore();
  const { getDailyMadeAppointments } = adminDashboardStore();

  const { getCurrentSection } = currentSectionStore();

  const { messages } = messagesStore();

  const { dateFormatted } = dateFormatsStore();

  const { socket } = useSocketStore();

  const fetchDailyAppointments = useCallback(() => {
    if (userId) {
      setLoading(true);
      getDailyMadeAppointments(userId).finally(() => {
        setLoading(false);
      });
    }
  }, [userId, getDailyMadeAppointments]);

  useEffect(() => {
    getCurrentSection('Daily made appointments');
    fetchDailyAppointments();
  }, [fetchDailyAppointments, getCurrentSection]);

  useEffect(() => {
    const handleUpdate = (dataToUpdate: string) => {
      if (dataToUpdate === 'dailyAppointmentsList' || dataToUpdate === 'appointments') {
        fetchDailyAppointments();
      }
    };

    socket?.on('update_data', handleUpdate);

    return () => {
      socket?.off('update_data', handleUpdate);
    };
  }, [socket, fetchDailyAppointments]);

  // ----- local states -----

  const [loading, setLoading] = useState<boolean>(true);

  const initialColumnsDef = {
    customer: true,
    phone: true,
    assigned_to: true,
    appointment_time: true,
    vehicle: true,
    status: true,
    _blank_button: true,
  };

  const columnRenderers: { [key in keyof typeof initialColumnsDef]: (el: DailyMadeAppointment) => any } = {
    customer: el => (
      <CustomerName customer={`${el.customers?.first_name} ${el.customers?.last_name}`} customerId={el.customers?.id} />
    ),
    phone: el => (
      <CustomerContactFormat contact={el.customers?.mobile_phone} customerId={el.customers?.id} marginInlineAuto />
    ),
    assigned_to: el => <UserAssignedName userName={el.users?.name || ''} userLastname={el.users?.last_name || ''} />,
    appointment_time: el => `${dateFormatted(5, el.start_date)} - ${dateFormatted(1, el.end_date)}`,
    vehicle: el => <VehicleFormat interestedVehicle={el.customers?.interested_vehicle} />,
    status: el => {
      // if(el.waiting_aprove){
      //   return ''
      // }
      return (
        !el.waiting_aprove && <StatusBtn appointmentId={el.id} customerId={el.customer_id} customerVisit={false} />
      );
      // return <DottedOptionsButton appId={el.id} />;
    },
    _blank_button: (el) => {
      return (
        <Can
          requiredPermission={[5, 6, 7]}
          fallback={<p className="w-[7.03125vw] mx-auto">{el.appointments_status?.status}</p>}
        >
          <SpecialBtn
            appointmentId={el.id}
            customerId={el.customer_id}
            changeReason={el.change_reason}
            preventedEndDate={el.prevented_end_date}
            preventedStartDate={el.prevented_start_date}
            waitingAprove={el.waiting_aprove}
            appointmentAccepted={el.client_accept_appointment}
            confirmationSent={el.confirmation_sent}
            defaultHomePhoneNumber={el.customers.home_default}
            homePhone={el.customers.home_phone}
            mobilePhone={el.customers.mobile_phone}
          />
        </Can>
      );
        },
  };

  const { columns } = useDynamicTableColumns<DailyMadeAppointment, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    hideHeaderFor: ['_blank_button'],
    columnStyles: { status: { size: 80 }, appointment_time: { size: 200 } },
    disableTruncateOnColumns: ['status', '_blank_button'],
    columnRenderers,
    accessorFnMapper: {
      customer: el => `${el.customers?.first_name} ${el.customers?.last_name}`,
      phone: el => el.customers?.mobile_phone,
      assigned_to: el => `${el.users?.name} ${el.users?.last_name}`,
      appointment_time: el => `${dateFormatted(5, el.start_date)} - ${dateFormatted(1, el.end_date)}`,
      vehicle: el => {
        if (el.customers.interested_vehicle) {
          const interestedVehicle = el.customers.interested_vehicle;
          const year = interestedVehicle?.vehicle_manufacture_years?.year;
          const brand = interestedVehicle?.vehicle_brands.brand.toUpperCase();
          const model = interestedVehicle?.vehicle_models.model;
          const vin = interestedVehicle?.vehicle_identification_numbers.vin;
          const lastSixVin = vin?.slice(vin.length - 6, vin.length);

          return `${year} ${brand} ${model} - [${lastSixVin}]`;
        }
        return '';
      },
    },
    disabledSortColumns: ['status', '_blank_button'],
    filterableColumns: ['customer', 'phone', 'assigned_to', 'appointment_time', 'vehicle'],
  });

  return (
    <ModalWindow top={0} positionFixed successMessage={messages.successMessage} failMessage={messages.serverError}>
      <ModalContainer width={86.510417} marginTop={7.592593}>
        <ModalContainerTitle title="Daily Made Appointments" closeWindowFunction={closeDailyAppointments} openNewTab />
        <ModalContent>
          <ColoredTableV2
            data={dailyMadeAppointments || []}
            columns={columns}
            initialColumnsDef={initialColumnsDef}
            itemsPerPage={7}
            loading={loading}
            paginationIsActive
            textColor="#FFF"
            height={52}
            rowSelectionIsActive={false}
          />
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
