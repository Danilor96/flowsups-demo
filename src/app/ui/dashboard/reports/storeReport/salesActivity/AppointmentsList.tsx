import { useEffect, useState } from 'react';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { CustomerName } from '&/miscellaneous/customerName/CustomerName';
import { UserAssignedName } from '&/miscellaneous/userAssignedName/UserAssignedName';
import { DateFormats } from '&/miscellaneous/dateFormats/DateFormats';
import { storeReportsStore } from '@/store/reports';
import { buildDateQueryString } from '@/app/libs/buildDatePrismaFilter';
import { reportsFiltersStore, transformDateToQuery } from '@/store/filtersHandling';

// Define the type for a single appointment based on the endpoint response
interface Appointment {
  id: number;
  start_date: Date;
  end_date: Date;
  client_accept_appointment: boolean;
  users: {
    id: number;
    name: string | null;
    last_name: string | null;
  } | null;
  appointments_status: {
    id: number;
    status: string;
  } | null;
  customers: {
    id: number;
    first_name: string | null;
    last_name: string | null;
  } | null;
}

const AppointmentStatus: { [key: number]: string } = {
  1: 'Agended',
  2: 'Completed',
  3: 'Cancelled',
  4: 'Reschedule',
  5: 'Visit',
  6: 'Confirmed',
  7: 'Late',
};

export function AppointmentsList({
  user,
  createdBy,
  appointmentStatusId,
  closeWindow,
}: {
  user: { id: number; name: string };
  createdBy?: number | null;
  appointmentStatusId: number;
  closeWindow: () => void;
}) {
  const createdDate = reportsFiltersStore((store) => store.createDate);
  const dateToExternalFilter = transformDateToQuery(createdDate);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      const dateQuery = dateToExternalFilter ? buildDateQueryString(dateToExternalFilter) : null;

      try {
        setLoading(true);
        const url = `/api/adminDashboard/appointments?userId=${user.id}&status=${appointmentStatusId}${dateQuery ? `&${dateQuery}` : ''}`;
        const createdByUrl = createdBy ? `/api/adminDashboard/appointments?userCreator=${createdBy}` : '';
        const response = await fetch(createdBy ? createdByUrl : url);
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const initialColumnsDef = {
    customer_name: true,
    assigned_to: true,
    status: true,
    start_date: true,
    end_date: true,
    confirmed: true,
  };

  const columnRenderers: { [key in keyof typeof initialColumnsDef]: (el: Appointment) => any } = {
    customer_name: el => (
      <CustomerName
        customer={`${el.customers?.first_name || ''} ${el.customers?.last_name || ''}`}
        customerId={el.customers?.id || 0}
      />
    ),
    assigned_to: el => <UserAssignedName userName={el.users?.name || 'N/A'} userLastname={el.users?.last_name || ''} />,
    status: el => el.appointments_status?.status || 'N/A',
    start_date: el => <DateFormats date={el.start_date} format={2} />,
    end_date: el => <DateFormats date={el.end_date} format={2} />,
    confirmed: el => (el.client_accept_appointment ? 'Yes' : 'No'),
  };

  const { columns } = useDynamicTableColumns<Appointment, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    columnStyles: {
      customer_name: { size: 220 },
      assigned_to: { size: 200 },
      status: { size: 150 },
      start_date: { size: 180 },
      end_date: { size: 180 },
      confirmed: { size: 120 },
    },
    columnRenderers,
    accessorFnMapper: {
      customer_name: el => `${el.customers?.first_name || ''} ${el.customers?.last_name || ''}`,
      assigned_to: el => `${el.users?.name || ''} ${el.users?.last_name || ''}`,
      status: el => el.appointments_status?.status || 'N/A',
      start_date: el => el.start_date,
      end_date: el => el.end_date,
      confirmed: el => (el.client_accept_appointment ? 'Yes' : 'No'),
    },
    filterableColumns: ['customer_name', 'assigned_to', 'status', 'start_date', 'end_date', 'confirmed'],
  });

  const title = createdBy
    ? `Appointments created by ${user.name}`
    : `${AppointmentStatus[appointmentStatusId]} Appointments assigned to ${user.name}`;

  return (
    <ModalWindow top={-13.7}>
      <ModalContainer width={95.8125} marginTop={5.555556}>
        <ModalContainerTitle title={title} closeWindowFunction={closeWindow} />
        <ModalContent>
          <ButtonContainer marginTop={1.5} block widthFull>
            <ColoredTableV2
              data={appointments || []}
              columns={columns}
              initialColumnsDef={initialColumnsDef}
              itemsPerPage={10}
              loading={loading}
              paginationIsActive
              textColor="#FFF"
              height={54}
              rowSelectionIsActive={false}
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
