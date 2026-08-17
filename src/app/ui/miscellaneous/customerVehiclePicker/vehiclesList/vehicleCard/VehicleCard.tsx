import { OptionsButton } from '&/miscellaneous/optionsButton/OptionsButton';
import { EditIcon, InventoryNotiIcon } from '@/app/ui/icons/Icons';
import { editVehicleStore, userActionStore } from '@/store/inventory';
import { useCan } from '@/hooks/permissions';
import { messagesStore, modalWindowStore } from '@/store/adminDashboard';

export function VehicleCard({
  brand,
  model,
  price,
  year,
  vin,
  status,
  extColor,
  mileage,
  stockNo,
  options,
}: {
  year: string;
  brand: string;
  model: string;
  price: string;
  vin: string;
  status: string;
  extColor: string;
  mileage: string;
  stockNo: string;
  options?: React.ReactNode;
}) {
  return (
    <aside
      className="w-full relative py-[1.8vh] px-[0.9vw] max-lg:px-3 max-lg:py-3"
      style={{
        boxShadow: 'soft: "0 4px 20px rgba(0, 0, 0, 0.08)"',
      }}
    >
      <section className="w-full flex flex-row justify-between items-start mb-[2vh] max-lg:flex-col max-lg:gap-2 max-lg:mb-3">
        <div className="flex flex-col gap-1 pr-12 max-lg:pr-0">
          <h2 className="text-[2.2vh] font-bold text-[#0f2b3f] leading-tight capitalize max-lg:text-base">{`${year} ${brand} ${model}`}</h2>
          <p className="text-[2vh] font-bold text-[#00A78B] max-lg:text-sm">{`$${price || 0}`}</p>
        </div>
        {options && <div className="absolute top-[1.8vh] right-[1.5vh] h-[1vh] max-lg:top-2 max-lg:right-2">{options}</div>}
      </section>
      <section className="w-full grid grid-cols-2 gap-y-[1vh] gap-x-[2vh] text-[1.7vh] font-medium text-[#2D3748] max-lg:grid-cols-2 max-lg:gap-y-2 max-lg:text-xs">
        <div className="flex items-center gap-[1.2vh]">
          <InventoryNotiIcon />
          <p className="truncate">
            <span className="text-[#4A5568] font-bold">Stock #:</span> {stockNo || ''}
          </p>
        </div>
        <div className="flex items-center gap-[1.2vh]">
          <SpeedometerIcon />
          <p className="truncate">
            <span className="text-[#4A5568] font-bold">Mileage:</span> {mileage || ''}
          </p>
        </div>
        <div className="flex items-center gap-[1.2vh]">
          <VinIcon />
          <p className="truncate">
            <span className="text-[#4A5568] font-bold">Last 6 VIN:</span> {vin ? vin.slice(-6) : ''}
          </p>
        </div>
        <div className="flex items-center gap-[1.2vh]">
          <PaletteIcon />
          <p className="truncate">
            <span className="text-[#4A5568] font-bold">Ex.Color:</span> {extColor || ''}
          </p>
        </div>
        <div className="flex items-center gap-[1.2vh]">
          <TagIcon />
          <p className="truncate">
            <span className="text-[#4A5568] font-bold">Status:</span> {status}
          </p>
        </div>
      </section>
    </aside>
  );
}

export const VehicleCardWithOptions = ({
  vehicle,
  changeVehicleOnClick,
  editVehicleOnClick,
  editVehicleOnClickEffect,
}: {
  vehicle: any;
  changeVehicleOnClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  editVehicleOnClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  editVehicleOnClickEffect?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  const { can } = useCan();
  const setAddNewVehicle = userActionStore(store => store.setAddNewVehicle);
  const openInventorySystem = modalWindowStore(store => store.openInventorySystem);
  const getVehicleData = editVehicleStore(store => store.getVehicleData);
  const setMessage = messagesStore(store => store.setMessages);

  const vehicleAsigned = vehicle;

  return (
    <VehicleCard
      vin={vehicleAsigned.vehicle_identification_numbers?.vin || ''}
      stockNo={vehicleAsigned.stock_no || ''}
      brand={vehicleAsigned.vehicle_brands?.brand || ''}
      model={vehicleAsigned.vehicle_models?.model || ''}
      year={vehicleAsigned.vehicle_manufacture_years?.year || ''}
      extColor={vehicleAsigned.exterior_vehicle_colors?.color || ''}
      mileage={vehicleAsigned.vehicle_mileages?.mileage || ''}
      price={vehicleAsigned.vehicle_prices?.price || vehicleAsigned.title_license?.asking_price || ''}
      status={vehicleAsigned.vehicle_status?.status || ''}
      options={
        <OptionsButton
          identity="change-vehicle"
          itemId={vehicleAsigned.id}
          options={[
            { id: 1, option: 'Change Vehicle', icon: <ReplaceIcon /> },
            ...(can(25) ? [{ id: 2, option: 'Edit', icon: <EditIcon /> }] : []),
          ]}
          optionsBackgroundColor="#fff"
          buttonColor="#707070"
          optionsHeight={5}
          optionsRadius={0.5}
          optionsWidth={0}
          optionsZIndex={10000}
          optionsBottom={100}
          placement="right"
          onClick={e => {
            e.stopPropagation();
            const { value, name } = e.currentTarget;
            if (value === '1') {
              // change vehicle
              changeVehicleOnClick?.(e);
            }
            if (value === '2' && vehicleAsigned && can(25)) {
              getVehicleData(vehicleAsigned.id.toString());
              setAddNewVehicle(false);
              openInventorySystem();
              editVehicleOnClickEffect?.(e);
            }
          }}
        />
      }
    />
  );
};

const TagIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="2.2vh"
    height="2.2vh"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#00A78B"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
    <path d="M7 7h.01" />
  </svg>
);

const SpeedometerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="2.2vh"
    height="2.2vh"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#00A78B"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5.636 19.364a9 9 0 1 1 12.728 0" />
    <path d="M16 9l-4 4" />
  </svg>
);

const PaletteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="2.2vh"
    height="2.2vh"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#00A78B"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 21a9 9 0 0 1 0 -18c4.97 0 9 3.582 9 8c0 1.06 -.474 2.078 -1.318 2.828c-.844 .75 -1.989 1.172 -3.182 1.172h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25" />
    <path d="M8.5 10.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <path d="M12.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <path d="M16.5 10.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  </svg>
);

const VinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="2.5vh" height="2vh" viewBox="0 0 32 20" fill="none">
    <rect x="0.75" y="0.75" width="30.5" height="18.5" rx="3.25" stroke="#00A78B" strokeWidth="1.5" />
    <text x="16" y="13.5" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#00A78B" textAnchor="middle">
      VIN
    </text>
  </svg>
);


const ReplaceIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1.4vw" height="2.4vh" viewBox="0 0 24 24" fill="#00A78B">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M8 2h-4a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2z" />
      <path d="M20 14h-4a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2z" />
      <path d="M16.707 2.293a1 1 0 0 1 .083 1.32l-.083 .094l-1.293 1.293h3.586a3 3 0 0 1 2.995 2.824l.005 .176v3a1 1 0 0 1 -1.993 .117l-.007 -.117v-3a1 1 0 0 0 -.883 -.993l-.117 -.007h-3.585l1.292 1.293a1 1 0 0 1 -1.32 1.497l-.094 -.083l-3 -3a.98 .98 0 0 1 -.28 -.872l.036 -.146l.04 -.104c.058 -.126 .14 -.24 .245 -.334l2.959 -2.958a1 1 0 0 1 1.414 0z" />
      <path d="M3 12a1 1 0 0 1 .993 .883l.007 .117v3a1 1 0 0 0 .883 .993l.117 .007h3.585l-1.292 -1.293a1 1 0 0 1 -.083 -1.32l.083 -.094a1 1 0 0 1 1.32 -.083l.094 .083l3 3a.98 .98 0 0 1 .28 .872l-.036 .146l-.04 .104a1.02 1.02 0 0 1 -.245 .334l-2.959 2.958a1 1 0 0 1 -1.497 -1.32l.083 -.094l1.291 -1.293h-3.584a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-3a1 1 0 0 1 1 -1z" />
    </svg>
  );
};
