import { adminDashboardStore, currentSectionStore, modalWindowStore } from '@/store/adminDashboard';
import { useCallback, useEffect, useState } from 'react';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { CustomerName } from '&/miscellaneous/customerName/CustomerName';
import { CustomerContactFormat } from '&/miscellaneous/customerContactFormat/CustomerContactFormat';
import { dateFormatsStore } from '@/store/dateFormats';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { VehicleFormat } from '../miscellaneous/vehicleFormat/VehicleFormat';
import { useDynamicTableColumns } from '../table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '../table/coloredTable/v2';
import { DailyMadeLeadWithCreditApp } from '@/app/libs/definitions';

export function DailyMadeCreditApp() {
  // ----- global states -----

  const { closeDailyMadeCreditApp } = modalWindowStore();

  const { dailyMadeCreditApp } = adminDashboardStore();
  const { getDailyMadeCreditApp } = adminDashboardStore();

  const { getCurrentSection } = currentSectionStore();

  const { dateFormatted } = dateFormatsStore();

  useEffect(() => {
    getCurrentSection('Daily made credit app');
  }, [getCurrentSection]);

  const getPromiseData = useCallback(() => {
    return [getDailyMadeCreditApp()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { error, loading } = useLoadingGetData(getPromiseData);

  // ----- local states -----

  const [tableData, setTableData] = useState<any[]>([
    {
      id: '',
      customer: '',
      phone: '',
      assigned_to: '',
      appointment_time: '',
      vehicle: '',
      visit: '',
      status: '',
    },
  ]);

  const initialColumnsDef = {
    customer: true,
    phone: true,
    assigned_to: true,
    appointment_time: true,
    vehicle: true,
    visit: true,
    status: true,
  };

  const columnRenderers: { [key in keyof typeof initialColumnsDef]: (el: DailyMadeLeadWithCreditApp) => any } = {
    customer: creditApp => {
      const customerName = `${creditApp.clients?.first_name || ''} ${creditApp.clients?.last_name || ''}`;
      return <CustomerName customer={customerName} customerId={creditApp.clients?.id} />;
    },
    phone: creditApp => creditApp.clients?.mobile_phone && (
      <CustomerContactFormat
        contact={creditApp.clients?.mobile_phone}
        customerId={creditApp.clients?.id}
        marginInlineAuto
      />
    ),
    assigned_to: creditApp =>
      `${creditApp.sales_rep?.name || ''} ${creditApp.sales_rep?.last_name || ''}${
        creditApp.sales_rep?.username ? ` - ${creditApp.sales_rep?.username}` : ''
      }`,
    appointment_time: creditApp => {
      const appTime = creditApp.clients?.appointment.find(el => el.start_date);
      return dateFormatted(5, appTime?.start_date);
    },
    vehicle: creditApp => creditApp.vehicle ? <VehicleFormat interestedVehicle={creditApp.vehicle} /> : '',
    visit: creditApp => {
      const appTime = creditApp.clients?.appointment.find(el => el.start_date);
      if(!appTime) return '';
      return appTime?.client_accept_appointment ? 'Confirmed' : 'Not Confirmed';
    },
    status: lead => {
      const status = lead.customer_credit_app_list?.status || lead.clients?.credit_app_list_status?.status;
      return status ? status.replace(status[0], status[0].toUpperCase()) : '';
    },
  };

  const { columns } = useDynamicTableColumns<DailyMadeLeadWithCreditApp, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    columnRenderers,
    accessorFnMapper: {
      customer: el => `${el.clients?.first_name || ''} ${el.clients?.last_name || ''}`,
      phone: el => el.clients?.mobile_phone || '',
      assigned_to: creditApp =>
      `${creditApp.sales_rep?.name || ''} ${creditApp.sales_rep?.last_name || ''}${
        creditApp.sales_rep?.username ? ` - ${creditApp.sales_rep?.username}` : ''
      }`,
      appointment_time: creditApp => {
        const appTime = creditApp.clients?.appointment.find(el => el.start_date);
        return appTime?.start_date;
      },
      vehicle: creditApp => {
        const interestedVehicle = creditApp.vehicle;
        if(interestedVehicle){
          const year = interestedVehicle?.vehicle_manufacture_years?.year;
          const brand = interestedVehicle?.vehicle_brands.brand.toUpperCase();
          const model = interestedVehicle?.vehicle_models.model;
          const vin = interestedVehicle?.vehicle_identification_numbers.vin;
          const lastSixVin = vin?.slice(vin.length - 6, vin.length);
          return `${year} ${brand} ${model} [${lastSixVin}]`;
        }
        return '';
      },
      visit: creditApp => {
        const appTime = creditApp.clients?.appointment.find(el => el.start_date);
        return appTime?.client_accept_appointment ? 'Confirmed' : 'Not Confirmed';
      },
      status: creditApp => {
        const status = creditApp.customer_credit_app_list?.status || creditApp.clients?.credit_app_list_status?.status;
        return status ? status.replace(status[0], status[0].toUpperCase()) : '';
      },
    },
  });

  // useEffect(() => {
  //   if (dailyMadeCreditApp && dailyMadeCreditApp.length > 0) {
  //     const newState: any[] = [];

  //     for (let i = 0; i < dailyMadeCreditApp.length; i++) {
  //       const creditApp = dailyMadeCreditApp[i];

  //       const customerName = `${creditApp.client.first_name || ''} ${creditApp.client.last_name || ''}`;
  //       const userName = `${creditApp.client.seller?.name || ''} ${creditApp.client.seller?.last_name || ''}${
  //         creditApp.client.seller?.username ? ` - ${creditApp.client.seller?.username}` : ''
  //       }`;
  //       const appTime = creditApp.client.appointment.find(el => el.start_date);
  //       const status = creditApp.client.credit_app_list_status?.status;

  //       newState.push({
  //         id: creditApp.id,
  //         customer: <CustomerName customer={customerName} customerId={creditApp.client.id} />,
  //         phone: (
  //           <CustomerContactFormat
  //             contact={creditApp.client.mobile_phone}
  //             customerId={creditApp.client.id}
  //             marginInlineAuto
  //           />
  //         ),
  //         assigned_to: userName,
  //         appointment_time: dateFormatted(5, appTime?.start_date),
  //         vehicle: <VehicleFormat interestedVehicle={creditApp.client.interested_vehicle} />,
  //         visit: appTime?.client_accept_appointment ? 'Confirmed' : 'Not Confirmed',
  //         status: status ? status.replace(status[0], status[0].toUpperCase()) : '',
  //       });
  //     }

  //     setTableData(newState);
  //   }
  // }, [dailyMadeCreditApp, dateFormatted]);

  return (
    <ModalWindow top={0} positionFixed>
      <ModalContainer marginTop={7.592593} width={86.510417}>
        <ModalContainerTitle title="Daily Made Credit Apps" closeWindowFunction={closeDailyMadeCreditApp} openNewTab />
        <ModalContent loading={loading}>
          {/* <ColoredTable
            tableData={tableData}
            height={65}
            textColor="#FFF"
            paginationTable
            headTextCenter
            bodyTextCenter
            itemsPerPage={12}
          /> */}
          <ColoredTableV2
            data={dailyMadeCreditApp || []}
            columns={columns}
            initialColumnsDef={initialColumnsDef}
            itemsPerPage={12}
            loading={loading}
            paginationIsActive
            textColor="#FFF"
            height={65}
            rowSelectionIsActive={false}
          />
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
