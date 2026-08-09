import { useEffect, useState } from 'react';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { CustomerName } from '&/miscellaneous/customerName/CustomerName';
import { DateFormats } from '&/miscellaneous/dateFormats/DateFormats';
import { sub } from 'date-fns';
import { adminDashboardStore, modalWindowStore } from '@/store/adminDashboard';
import { storeReportsStore } from '@/store/reports';
import { buildDateQueryString } from '@/app/libs/buildDatePrismaFilter';
import { reportsFiltersStore, transformDateToQuery } from '@/store/filtersHandling';

const TaskStatus: { [key: number]: string } = {
  1: 'Pending',
  2: 'Completed',
  3: 'Cancelled',
  4: 'Late',
};

// Define the type for a single task based on the endpoint response
interface Task {
  id: number;
  title: string;
  created_at: Date;
  deadline: Date;
  task_status: {
    status: string;
  },
  assigned: {
    id: number;
    name: string;
    last_name: string;
  },
  assigned_seller: {
    id: number;
    name: string;
    last_name: string;
  } | null,
  customer: {
    id: number;
    first_name: string | null;
    last_name: string | null;
    client_status: {status: string};
  } | null;
}

export function TasksList({ closeWindow, user, taskStatusId }: { user: { id: number; name: string; }, taskStatusId: number , closeWindow: () => void }) {
  const { openInNewTab } = modalWindowStore();
  const getSingleClientTasks = adminDashboardStore((store) => store.getSingleClientTasks);
  const openTaskDetail = modalWindowStore((store) => store.openTaskDetail);
  const createdDate = reportsFiltersStore((store) => store.createDate);
  const dateToExternalFilter = transformDateToQuery(createdDate);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      const dateQuery = dateToExternalFilter ? buildDateQueryString(dateToExternalFilter) : null;
      
      try {
        setLoading(true);
        const url = `/api/adminDashboard/tasks?userId=${user.id}&status=${taskStatusId}${dateQuery ? `&${dateQuery}` : ''}`;
        const response = await fetch(url);
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const initialColumnsDef = {
    customer_name: true,
    customer_status: true,
    assigned_to: true,
    subject: true,
    task_status: true,
    created_at: true,
    deadline: true,
  };

  const columnRenderers: { [key in keyof typeof initialColumnsDef]: (el: Task) => any } = {
    customer_name: el => (
      <CustomerName
        customer={`${el.customer?.first_name || ''} ${el.customer?.last_name || ''}`}
        customerId={el.customer?.id || 0}
      />
    ),
    customer_status: el => el.customer?.client_status?.status?.toUpperCase() || '',
    subject: el => el.title,
    assigned_to: el => `${el.assigned?.name || el.assigned_seller?.name || ''} ${el.assigned?.last_name || el.assigned_seller?.last_name || ''}`,
    task_status: el => el.task_status?.status?.toUpperCase() || '',
    created_at: el => <DateFormats date={el.created_at} format={2} />,
    deadline: el => <DateFormats date={el.deadline} format={2} />,
  };

  const { columns } = useDynamicTableColumns<Task, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    columnStyles: {
      customer_name: { size: 220 },
      subject: { size: 300 },
      created_at: { size: 180 },
      deadline: { size: 180 },
    },
    columnRenderers,
    accessorFnMapper: {
      customer_name: el => `${el.customer?.first_name || ''} ${el.customer?.last_name || ''}`,
      customer_status: el => el.customer?.client_status?.status || '',
      assigned_to: el => `${el.assigned?.name || el.assigned_seller?.name || ''} ${el.assigned?.last_name || el.assigned_seller?.last_name || ''}`,
      subject: el => el.title,
      task_status: el => el.task_status?.status || '',
      created_at: el => el.created_at,
      deadline: el => el.deadline,
    },
    filterableColumns: ['customer_name', 'customer_status', 'subject', 'created_at', 'deadline', 'task_status'],
    columnDataTypes: {
      deadline: 'date',
      created_at: 'date',
    }
  });

    const handleOpenTask = (taskId: number) => {
    if (taskId) {
      if (openInNewTab) {
        window.open(`/dashboard/task-${taskId}`);
        return;
      }

      getSingleClientTasks(taskId.toString());

      openTaskDetail();
    }
  };
  
  return (
    <ModalWindow top={-13.7}>
      <ModalContainer width={95.8125} marginTop={5.5555556}>
        <ModalContainerTitle
          title={`${TaskStatus[taskStatusId]} Tasks assigned to ${user.name}`}
          closeWindowFunction={closeWindow}
        />
        <ModalContent>
          <ButtonContainer marginTop={1.5} block widthFull>
            <ColoredTableV2
              data={tasks || []}
              columns={columns}
              initialColumnsDef={initialColumnsDef}
              itemsPerPage={10}
              loading={loading}
              paginationIsActive
              textColor="#FFF"
              height={54}
              rowSelectionIsActive={false}
              onRowClick={originalRow => {
                const rowId = originalRow.id;
                handleOpenTask(rowId);
              }}
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
