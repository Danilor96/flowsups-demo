import { useEffect, useState } from 'react';
import { CloseWindow } from '@/app/libs/definitions';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { PlusIcon } from '&/icons/Icons';
import { AddOtherModal } from './AddOtherModal';
import { getMonthDateRangeParams } from '@/app/libs/monthAndYearDateFilter';
import { useCalendarStore } from '@/store/monthNavigation';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { formatOtherVehicle, formatVehicle } from '@/app/ui/dashboard/clientSystem/customerLists/utils/utils';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';

interface OtherSalesLog {
  id: string;
  customerFirstName: string;
  customerLastName: string;
  customerMobile : string;
  assigned_seller: {
    img: string | null;
    name: string | null;
    id: number;
    created_at: Date;
    last_name: string | null;
    mobile_phone: string | null;
    email: string;
    updated_at: Date | null;
    status_id: number | null;
    round_robin: boolean;
    username: string | null;
    password: string | null;
    emailVerified: Date | null;
    sessions_expires: Date | null;
    ready_for_leads: boolean;
    round_robin_order: number | null;
    monthly_vehicle_sales_goal: number | null;
    sales_points_total: number;
    sales_points_today: number;
    sales_points_today_date: Date;
    daily_points_target: number | null;
    default_customer_report_id: number | null;
  } | null;
  vehicle: {
    id: number;
    make: string | null;
    model: string | null;
    year: string | null;
    stock_no: string | null;
    vin: string | null;
    created_at: Date;
  } | null;
  created_at: Date;
  date: Date;
}

export function AddOther({ closeWindow }: CloseWindow) {
  const { currentMonth, currentYear, resetMonthFilter, setFetchingData } = useCalendarStore();

  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  // handling close current window
  const handleCloseWindow = () => {
    closeWindow(false);
  };

  // table data
  const [tableData, setTableDate] = useState<OtherSalesLog[]>([]);
  const [loading, setLoading] = useState(false);

  const initialColumnsDef = {
    customer: true,
    sales_assigned: true,
    vehicle: true,
    date: true,
  };

  const { columns } = useDynamicTableColumns<OtherSalesLog, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    accessorFnMapper: {
      customer: row => `${row.customerFirstName || ''} ${row.customerLastName || ''}`,
      sales_assigned: row => `${row.assigned_seller?.name || ''} ${row.assigned_seller?.last_name || ''}`,
      vehicle: row =>  row.vehicle ? formatOtherVehicle(row.vehicle) : '',
      date: row => (row.date ? new Date(row.date).toLocaleDateString() : ''),
    },
  });

  const fetchData = async (filter: object | null) => {
    const urlParams = getMonthDateRangeParams(currentMonth, currentYear);
    try {
      setLoading(true);
      const dateQueryString = undefined; // buildDateQueryString(filter);
      const response = await fetch(`/api/reports/salesLog/sales-score/add-other?${urlParams || ''}`);
      const data = (await response.json()) as {
        data: OtherSalesLog[];
      };
      setTableDate(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching deal counts:', error);
    }
  };

  useEffect(() => {
    fetchData(null);
  }, [currentMonth, currentYear]);

  // handling add other button
  const handleAddOther = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsAddVehicleModalOpen(true);
  };

  const specialButtonBackgroundColor = '#92CEC375';
  const specialButtonHeight = 5.740741;
  const specialButtonTextColor = '#00A78B';
  const specialButtonTextSize = 1.851852;
  const specialButtonText = 'Add Other';
  const specialButtonIcon = <PlusIcon />;
  
  return (
    <ModalWindow top={0}>
      <ModalContainer marginTop={6.296296} width={82.916667}>
        <ModalContainerTitle title="Add Other" closeWindowFunction={handleCloseWindow} />
        <ModalContent>
          <ColoredTableV2
            data={tableData || []}
            columns={columns}
            loading={loading}
            initialColumnsDef={initialColumnsDef}
            textColor="#FFF"
            height={61.5}
            // specialRow={totalsData}
            rowSelectionIsActive={false}
            extraComponent={
              <button
                className="w-full flex flex-row justify-center items-center gap-[0.833333vw] rounded-b-[0.520833vw]"
                style={{
                  height: `${specialButtonHeight}vh`,
                  color: specialButtonTextColor,
                  backgroundColor: specialButtonBackgroundColor,
                  fontSize: `${specialButtonTextSize}vh`,
                }}
                onClick={e => handleAddOther(e)}
              >
                {specialButtonIcon}
                {specialButtonText}
              </button>
            }
          />
        </ModalContent>
      </ModalContainer>
      {isAddVehicleModalOpen && (
        <AddOtherModal
          onClose={() => setIsAddVehicleModalOpen(false)}
          onSave={() => {
            fetchData(null);
            setIsAddVehicleModalOpen(false);
          }}
        />
      )}
    </ModalWindow>
  );
}
