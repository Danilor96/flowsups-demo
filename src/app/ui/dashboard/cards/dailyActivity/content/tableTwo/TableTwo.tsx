import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
// import { ColoredTable } from '&/table/coloredTable/ColoredTable';
import { CustomerName } from '&/miscellaneous/customerName/CustomerName';
import { adminDashboardStore } from '@/store/adminDashboard';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { SpecialBtn } from './specialBtn/SpecialBtn';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { VehiclePicker } from '&/miscellaneous/vehicelPicker/VehiclePicker';
import { vehiclesDataStore } from '@/store/inventory';
import { UserPicker } from '&/miscellaneous/userPicker/UserPicker';
import { useCan } from '@/hooks/permissions';
import { Can } from '@/app/ui/auth/Can';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { useTableData } from '@/hooks/tableData';

export function TableTwo({
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

  const { formatPhoneNumber, extractDigits } = phoneNumbersFormatStore();

  const { getVehiclesData } = vehiclesDataStore();

  useEffect(() => {
    getVehiclesData();
  }, [getVehiclesData]);

  // ----- local states -----

  const [visitAppt, setVisitAppt] = useState(false);

  const [tableTwo, setTableTwo] = useState<typeof dailyActivityAppointments>(undefined);

  let initialColumnsDef = {
    customer: true,
    assigned: true,
    manager: true,
    bdc: true,
    vehicle: true,
    _blank_specialBtn: true,
  };

  const columnRenderers = {
    customer: (el: any) => (
      <CustomerName
        customer={`${el.customers.first_name} ${el.customers.last_name}`}
        customerId={el.customers.id}
      />
    ),
    assigned: (el: any) => (
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
    manager: (el: any) => (
      <UserPicker
        customerId={el.customer_id}
        salesManager={{
          id: el.customers.sales_manager?.id,
          name: el.customers.sales_manager?.name || '',
          lastname: el.customers.sales_manager?.last_name || '',
        }}
      />
    ),
    bdc: (el: any) => (
      <UserPicker
        customerId={el.customer_id}
        bdc={{
          id: el.customers.bdc?.id,
          name: el.customers.bdc?.name || '',
          lastname: el.customers.bdc?.last_name || '',
        }}
      />
    ),
    vehicle: (el: any) => {
      const interestedVehicle = el.customers.interested_vehicle;
      if (!interestedVehicle) return null;
      const year = interestedVehicle.vehicle_manufacture_years?.year || '';
      const brand = interestedVehicle.vehicle_brands.brand?.toUpperCase() || '';
      const model = interestedVehicle.vehicle_models.model || '';
      const vin = interestedVehicle.vehicle_identification_numbers.vin || '';
      const lastSixVin = vin ? `[${vin.slice(-6)}]` : '';
      const vehicleFullName = `${brand} ${year} ${model} - ${lastSixVin}`;
      return (
        <VehiclePicker
          customerId={el.customer_id}
          interestedVehicleId={el.customers.interested_vehicle?.id}
          vehicleName={vehicleFullName}
        />
      );
    },
    _blank_specialBtn: (el: any) => {
      if (el.status_id === 2) {
        return <p>Completed</p>;
      }

      const salesRepName = `${el.users.name || ''} ${el.users.last_name || ''}`;
      const sellerId = el?.user_id;
      const customerName = `${el.customers.first_name || ''} ${el.customers.last_name || ''}`;
      const street = el.customers.client_address?.street;
      const city = el.customers.client_address?.city;
      const state = el.customers.client_address?.state?.state;
      const zip = el.customers.client_address?.zip;
      const customerAddress = street ? `${street}, ${city}, ${state}${zip ? `, ${zip}` : ''}` : '';

      return (
        <Can requiredPermission={[8]}>
          <SpecialBtn
            appointmentId={el.id}
            salesRep={salesRepName}
            leadType={el.customers.lead_type.type}
            customer={customerName}
            homePhone={formatPhoneNumber(el.customers.home_phone)}
            address={customerAddress}
            workPhone={formatPhoneNumber(el.customers.work_phone)}
            email={el.customers.email}
            mobilePhone={formatPhoneNumber(el.customers.mobile_phone)}
            vehicleId={el.customers.interested_vehicle?.id}
            salesManagerId={el.customers.sales_manager?.id}
            customerId={el.customer_id}
            sellerId={sellerId}
          />
        </Can>
      );
    },
  };

  const accessorFnMapper = {
    customer: (el: any) => `${el.customers.first_name} ${el.customers.last_name}`,
    assigned: (el: any) => `${el.users.name || ''} ${el.users.last_name || ''}`,
    manager: (el: any) =>
      `${el.customers.sales_manager?.name || ''} ${el.customers.sales_manager?.last_name || ''}`,
    bdc: (el: any) => `${el.customers.bdc?.name || ''} ${el.customers.bdc?.last_name || ''}`,
    vehicle: (el: any) => {
      const interestedVehicle = el.customers.interested_vehicle;
      if (!interestedVehicle) return '';
      const year = interestedVehicle.vehicle_manufacture_years?.year || '';
      const brand = interestedVehicle.vehicle_brands.brand?.toUpperCase() || '';
      const model = interestedVehicle.vehicle_models.model || '';
      const vin = interestedVehicle.vehicle_identification_numbers.vin || '';
      const lastSixVin = vin ? `[${vin.slice(-6)}]` : '';
      return `${brand} ${year} ${model} - ${lastSixVin}`;
    },
  };

  const { columns, columnVisibility } = useDynamicTableColumns({
    initialColumnsDef,
    excludeKeys: ['id'],
    hideHeaderFor: ['_blank_specialBtn'],
    disableTruncateOnColumns: ['_blank_specialBtn', 'assigned', 'manager', 'bdc', 'vehicle'],
    columnRenderers,
    accessorFnMapper,
    filterableColumns: ['customer', 'assigned', 'manager', 'bdc', 'vehicle'],
  });

  useEffect(() => {
    if (dailyActivityAppointments && dailyActivityAppointments.length > 0) {
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
        const customerMobilePhone = extractDigits(el.customers.mobile_phone);

        const firstCondition = el.status_id === 5 || el.status_id === 2;

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
              customerName.includes(word) ||
              customerLastName.includes(word) ||
              customerEmail.includes(word) ||
              customerMobilePhone.includes(word),
          );

        return firstCondition && secondCondition && thirdCondition;
      });

      if (acceptedAppointment && acceptedAppointment.length > 0) {
        setVisitAppt(true);

        setTableTwo(acceptedAppointment);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dailyActivityAppointments]);

  return (
    <motion.aside
      initial={{ width: 0, opacity: 0 }}
      animate={{
        width: visitAppt ? '41.75vw' : 0,
        opacity: visitAppt ? 1 : 0,
      }}
      className={`!max-lg:w-full ${!visitAppt ? 'max-lg:hidden' : ''}`}
    >
      <Paragraph marginBottom={2.5} fontSize={2.314815} color="#FFF">
        Showroom
      </Paragraph>
      <ColoredTableV2
        data={tableTwo || []}
        columns={columns}
        initialColumnsDef={columnVisibility}
        height={45}
        itemsPerPage={8}
        loading={loading}
        paginationIsActive
        textColor="#FFF"
        paginationTextColor="#FFF"
        rowSelectionIsActive={false}
        printButtonIsActive
        lazyPrinting
      />
    </motion.aside>
  );
}
