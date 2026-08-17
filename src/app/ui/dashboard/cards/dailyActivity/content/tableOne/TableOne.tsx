import { CustomerName } from '&/miscellaneous/customerName/CustomerName';
import { adminDashboardStore } from '@/store/adminDashboard';
import { CustomerContactFormat } from '&/miscellaneous/customerContactFormat/CustomerContactFormat';
import { dateFormatsStore } from '@/store/dateFormats';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { StatusBtn } from './statusBtn/StatusBtn';
import { SpecialBtn } from './specialBtn/SpecialBtn';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { VehiclePicker } from '&/miscellaneous/vehicelPicker/VehiclePicker';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { UserPicker } from '&/miscellaneous/userPicker/UserPicker';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { DailyActivityAppointment } from '@/app/libs/definitions';
import { Can } from '@/app/ui/auth/Can';

export function TableOne({
  loading,
  assignedFilter,
  customerFilter,
}: {
  loading: boolean;
  customerFilter: string;
  assignedFilter: string;
}) {
  // ----- global states -----

  const { dailyActivityAppointments } = adminDashboardStore();

  const { dateFormatted } = dateFormatsStore();

  const { extractDigits } = phoneNumbersFormatStore();

  // const { can } = useCan();

  const [tableOne, setTableOne] = useState<typeof dailyActivityAppointments>([]);

  let initialColumnsDef = {
    assigned: true,
    customer: true,
    phone: true,
    appointment_time: true,
    vehicle: true,
    status: true,
    _blank_button: true,
  };

  const columnRenderers: {
    [key: string]: (el: any) => React.ReactNode | string | number | boolean | Date;
  } = {
    assigned: (el) => (
      <UserPicker
        customerId={el.customer_id}
        salesRep={{
          id: el.user_id,
          name: el.users.name || '',
          lastname: el.users.last_name || '',
          appId: el.id,
        }}
      />
    ),
    customer: (el) => (
      <CustomerName
        customer={`${el.customers.first_name} ${el.customers.last_name}`}
        customerId={el.customers.id}
      />
    ),
    phone: (el) => (
      <CustomerContactFormat
        contact={el.customers.mobile_phone}
        customerId={el.customer_id}
        marginInlineAuto
      />
    ),
    appointment_time: (el) =>
      `${dateFormatted(1, el.start_date)} - ${dateFormatted(1, el.end_date)}`,
    vehicle: (el) => {
      const vehicleFullNameResult = vehicleFullName(el);

      return (
        <VehiclePicker
          customerId={el.customer_id}
          interestedVehicleId={el.customers.interested_vehicle?.id}
          vehicleName={vehicleFullNameResult || ''}
        />
      );
    },
    status: (el) =>
      !el.waiting_aprove && (
        <StatusBtn
          appointmentId={el.id}
          customerId={el.customer_id}
          customerVisit={customerVisit}
        />
      ),
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

  const { columns, columnVisibility } = useDynamicTableColumns<
    DailyActivityAppointment,
    typeof initialColumnsDef
  >({
    initialColumnsDef,
    excludeKeys: ['id'],
    columnStyles: { status: { size: 75 }, _blank_button: { size: 120 } },
    hideHeaderFor: ['_blank_button'],
    disableTruncateOnColumns: ['assigned', 'vehicle', 'status', '_blank_button'],
    columnRenderers: columnRenderers,
    permissionsById: { status: [2, 3, 4] },
    sortableColumns: ['assigned', 'customer', 'phone', 'appointment_time', 'vehicle'],
    accessorFnMapper: {
      assigned: (el) => `${el?.users?.name} ${el?.users?.last_name || ''}`,
      customer: (el) => `${el.customers.first_name} ${el.customers.last_name || ''}`,
      phone: (el) => el.customers.mobile_phone,
      vehicle: (el) => vehicleFullName(el) || '',
      appointment_time: (el) => el.start_date,
    },
    filterableColumns: ['assigned', 'customer', 'phone', 'appointment_time', 'vehicle'],
    columnDataTypes: {
      appointment_time: 'date',
      assigned: 'text',
    },
  });

  const [customerVisit, setCustomerVisit] = useState(false);

  useEffect(() => {
    if (dailyActivityAppointments && dailyActivityAppointments.length > 0) {
      const ignoreAppointment = [5, 2];

      const assignedSearchParams = assignedFilter.toLowerCase().split(' ');
      const customerSearchParams = customerFilter.toLowerCase().split(' ');

      const acceptedAppointment = dailyActivityAppointments.filter((el) => {
        const assignedName = el?.users?.name?.toLowerCase() || '';
        const assignedLastName = el?.users?.last_name?.toLowerCase() || '';
        const assignedBdcName = el.customers.bdc?.name?.toLowerCase();
        const assignedBdcLastName = el.customers.bdc?.last_name?.toLowerCase();
        const customerName = el.customers.first_name?.toLowerCase();
        const customerLastName = el.customers.last_name?.toLowerCase();
        const customerEmail = el.customers.email?.toLowerCase();
        const customerMobilePhone = extractDigits(el.customers.mobile_phone || '');

        const firstCondition = !ignoreAppointment.includes(el.status_id);
        const secondCondition =
          assignedFilter === '' ||
          assignedSearchParams.every(
            (word) =>
              assignedName?.includes(word) ||
              assignedLastName?.includes(word) ||
              assignedBdcName?.includes(word) ||
              assignedBdcLastName?.includes(word),
          );
        const thirdCondition =
          customerFilter === '' ||
          customerSearchParams.every(
            (word) =>
              customerName?.includes(word) ||
              customerLastName?.includes(word) ||
              customerEmail?.includes(word) ||
              customerMobilePhone?.includes(word),
          );

        return firstCondition && secondCondition && thirdCondition;
      });

      const visitAppointment = dailyActivityAppointments.filter(
        (el) => el.status_id === 5 || el.status_id === 2,
      );

      if (visitAppointment && visitAppointment.length > 0) {
        setCustomerVisit(true);
      }

      if (acceptedAppointment && acceptedAppointment.length > 0) {
        setTableOne(acceptedAppointment);
      } else {
        setTableOne([]);
      }
    } else {
      setTableOne([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dailyActivityAppointments]);

  // const tableData = useTableData({
  //   data: tableOne,
  //   initialItem: {
  //     id: '',
  //     assigned: '',
  //     customer: '',
  //     phone: '',
  //     appointment_time: '',
  //     vehicle: '',
  //     status_CAN_2_3_4_: '',
  //     _blank_button_CAN_5_6_7_: '',
  //   },
  //   mapper: (el) => {
  //     const noSpecialBtn = [3, 7];

  //     const interestedVehicle = el.customers.interested_vehicle;
  //     const year = interestedVehicle?.vehicle_manufacture_years?.year || '';
  //     const brand = interestedVehicle?.vehicle_brands.brand?.toUpperCase() || '';
  //     const model = interestedVehicle?.vehicle_models.model || '';
  //     const vin = interestedVehicle?.vehicle_identification_numbers.vin || '';
  //     const lastSixVin = vin ? `[${vin?.slice(-6)}]` : '';
  //     const vehicleFullName = `${brand} ${year} ${model} - ${lastSixVin}`;
  //     const defaultHomePhoneNumber = el.customers.home_default;
  //     const homePhone = el.customers.home_phone;
  //     const mobilePhone = el.customers.mobile_phone;

  //     return {
  //       id: el.id,
  //       assigned: (
  //         <UserPicker
  //           customerId={el.customer_id}
  //           salesRep={{
  //             id: el.user_id,
  //             name: el.users.name || '',
  //             lastname: el.users.last_name || '',
  //             appId: el.id,
  //           }}
  //         />
  //       ),
  //       customer: (
  //         <CustomerName
  //           customer={`${el.customers.first_name} ${el.customers.last_name}`}
  //           customerId={el.customers.id}
  //         />
  //       ),
  //       phone: (
  //         <CustomerContactFormat
  //           contact={el.customers.mobile_phone}
  //           customerId={el.customer_id}
  //           marginInlineAuto
  //         />
  //       ),
  //       appointment_time: `${dateFormatted(1, el.start_date)} - ${dateFormatted(1, el.end_date)}`,
  //       vehicle: (
  //         <VehiclePicker
  //           customerId={el.customer_id}
  //           interestedVehicleId={el.customers.interested_vehicle?.id}
  //           vehicleName={vehicleFullName}
  //         />
  //       ),
  //       status_CAN_2_3_4_: !el.waiting_aprove && (can(2) || can(3) || can(4)) && (
  //         <StatusBtn
  //           appointmentId={el.id}
  //           customerId={el.customer_id}
  //           customerVisit={customerVisit}
  //         />
  //       ),
  //       [noSpecialBtn.includes(el.status_id) ? '_blank_button' : '_blank_button_CAN_5_6_7_']:
  //         noSpecialBtn.includes(el.status_id) ? (
  //           <p className="w-[7.03125vw] mx-auto">{el.appointments_status?.status}</p>
  //         ) : (
  //           (can(5) || can(6) || can(7)) && (
  //             <SpecialBtn
  //               appointmentId={el.id}
  //               customerId={el.customer_id}
  //               changeReason={el.change_reason}
  //               preventedEndDate={el.prevented_end_date}
  //               preventedStartDate={el.prevented_start_date}
  //               waitingAprove={el.waiting_aprove}
  //               appointmentAccepted={el.client_accept_appointment}
  //               confirmationSent={el.confirmation_sent}
  //               defaultHomePhoneNumber={defaultHomePhoneNumber}
  //               homePhone={homePhone}
  //               mobilePhone={mobilePhone}
  //             />
  //           )
  //         ),
  //     };
  //   },
  // });

  return (
    <motion.aside
      initial={{ width: '100%', marginInline: '' }}
      animate={{
        width: customerVisit ? '41.75vw' : '96%',
        marginInline: customerVisit ? '' : 'auto',
      }}
      className="!max-lg:w-full"
    >
      <Paragraph marginBottom={2.5} fontSize={2.314815} color="#FFF">
        Appointment
      </Paragraph>
      {/* <ColoredTable
        textColor="#FFF"
        height={45}
        tableData={tableOne}
        paginationTable
        headTextCenter
        bodyTextCenter
        itemsPerPage={8}
        fontSize={2}
        loading={loading}
        printButton
        lazyPrinting
        paginationControlWidth={25.5}
      /> */}
      <ColoredTableV2
        data={tableOne ? tableOne : []}
        columns={columns}
        initialColumnsDef={columnVisibility}
        height={45}
        itemsPerPage={8}
        loading={loading}
        paginationIsActive
        paginationTextColor="#FFF"
        textColor="#FFF"
        rowSelectionIsActive={false}
        printButtonIsActive
        lazyPrinting
      />
    </motion.aside>
  );
}

function vehicleFullName(el: DailyActivityAppointment) {
  if (!el.customers.interested_vehicle) return null;
  const interestedVehicle = el.customers.interested_vehicle;
  const year = interestedVehicle?.vehicle_manufacture_years?.year || '';
  const brand = interestedVehicle?.vehicle_brands.brand?.toUpperCase() || '';
  const model = interestedVehicle?.vehicle_models.model || '';
  const vin = interestedVehicle?.vehicle_identification_numbers.vin || '';
  const lastSixVin = vin ? `[${vin?.slice(-6)}]` : '';
  const vehicleFullName = `${brand} ${year} ${model} - ${lastSixVin}`;
  return vehicleFullName;
}
