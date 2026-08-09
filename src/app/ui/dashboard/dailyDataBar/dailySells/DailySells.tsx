import { adminDashboardStore, modalWindowStore } from '@/store/adminDashboard';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { useCallback, useEffect, useState } from 'react';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { CustomerName } from '&/miscellaneous/customerName/CustomerName';
import { CustomerContactFormat } from '&/miscellaneous/customerContactFormat/CustomerContactFormat';
import { UserAssignedName } from '&/miscellaneous/userAssignedName/UserAssignedName';
import { dateFormatsStore } from '@/store/dateFormats';
import { VehicleFormatName } from '&/miscellaneous/vehicelPicker/VehiclePicker';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import type { DailySells } from '@/app/libs/definitions';
import { DailySell } from '@/app/libs/definitions';

export function DailySells() {
  // ----- global states -----

  const { closeDailySells } = modalWindowStore();

  const { dailySells } = adminDashboardStore();
  const { getDailySells } = adminDashboardStore();

  const { dateFormatted } = dateFormatsStore();

  const getPromisesData = useCallback(() => {
    return [getDailySells()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { error, loading } = useLoadingGetData(getPromisesData);

  // ----- local states -----

  const [tableData, setTableData] = useState<any[]>([
    {
      id: '',
      customer: '',
      phone: '',
      assigned_to: '',
      date: '',
      vehicle: '',
    },
  ]);

  const initialColumnsDef = {
    customer: true,
    phone: true,
    assigned_to: true,
    date: true,
    vehicle: true,
  };

  const columnRenderers: { [key in keyof typeof initialColumnsDef]: (el: DailySell) => any } = {
    customer: saleData => (
      <CustomerName
        customer={`${saleData.clients.first_name || ''} ${saleData.clients.last_name || ''}`}
        customerId={saleData.clients.id}
      />
    ),
    phone: saleData => (
      <CustomerContactFormat contact={saleData.clients.mobile_phone} customerId={saleData.clients.id} marginInlineAuto />
    ),
    assigned_to: saleData => (
      <UserAssignedName userName={saleData.sales_rep?.name || ''} userLastname={saleData.sales_rep?.last_name || ''} />
    ),
    date: saleData => dateFormatted(1, saleData.sold_created_at),
    vehicle: saleData => saleData.vehicle && (
      <VehicleFormatName
        brand={saleData.vehicle?.vehicle_brands?.brand}
        model={saleData.vehicle?.vehicle_models?.model}
        year={saleData.vehicle?.vehicle_manufacture_years?.year}
        lastSixVin={saleData.vehicle?.vehicle_identification_numbers?.vin.slice(-6)}
      />
    ),
  };

  const { columns } = useDynamicTableColumns<DailySell, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    columnRenderers,
    accessorFnMapper: {
      customer: (saleData: DailySell) => `${saleData.clients.first_name || ''} ${saleData.clients.last_name || ''}`,
      phone: (saleData: DailySell) => saleData.clients.mobile_phone,
      assigned_to: (saleData: DailySell) => `${saleData.sales_rep?.name || ''} ${saleData.sales_rep?.last_name || ''}`,
      date: (saleData: DailySell) => saleData.sold_created_at,
      vehicle: (saleData: DailySell) =>
        `${saleData.vehicle?.vehicle_brands.brand} ${saleData.vehicle?.vehicle_models.model} ${
          saleData.vehicle?.vehicle_manufacture_years?.year
        } ${saleData.vehicle?.vehicle_identification_numbers.vin.slice(-6)}`,
    },
    columnDataTypes: {
      date: 'date',
    }
  });

  // useEffect(() => {
  //   if (dailySells && dailySells.length > 0) {
  //     const newData: any[] = [];

  //     for (let i = 0; i < dailySells.length; i++) {
  //       const saleData = dailySells[i];

  //       newData.push({
  //         id: saleData.id,
  //         customer: (
  //           <CustomerName
  //             customer={`${saleData.customer.first_name || ''} ${
  //               saleData.customer.last_name || ''
  //             }`}
  //             customerId={saleData.id}
  //           />
  //         ),
  //         phone: (
  //           <CustomerContactFormat
  //             contact={saleData.customer.mobile_phone}
  //             customerId={saleData.id}
  //             marginInlineAuto
  //           />
  //         ),
  //         assigned_to: (
  //           <UserAssignedName
  //             userName={saleData.sales_rep?.name || ''}
  //             userLastname={saleData.sales_rep?.last_name || ''}
  //           />
  //         ),
  //         date: dateFormatted(1, saleData.created_at),
  //         vehicle: (
  //           <VehicleFormatName
  //             brand={saleData.vehicle?.vehicle_brands.brand}
  //             model={saleData.vehicle?.vehicle_models.model}
  //             year={saleData.vehicle?.vehicle_manufacture_years?.year}
  //             lastSixVin={saleData.vehicle?.vehicle_identification_numbers.vin.slice(-6)}
  //           />
  //         ),
  //       });
  //     }

  //     setTableData(newData);
  //   } else {
  //     setTableData([
  //       {
  //         id: '',
  //         customer: '',
  //         phone: '',
  //         assigned_to: '',
  //         date: '',
  //         vehicle: '',
  //       },
  //     ]);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [dailySells]);

  return (
    <ModalWindow top={0} positionFixed>
      <ModalContainer marginTop={6} width={86.510417}>
        <ModalContainerTitle title="Daily Sales" closeWindowFunction={closeDailySells} openNewTab />
        <ModalContent>
          <ColoredTableV2
            data={dailySells || []}
            columns={columns}
            initialColumnsDef={initialColumnsDef}
            itemsPerPage={8}
            loading={loading}
            paginationIsActive
            textColor="#FFF"
            height={66.851852}
            rowSelectionIsActive={false}
          />
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
