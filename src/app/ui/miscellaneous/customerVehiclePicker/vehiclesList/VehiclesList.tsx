import { VehiclesData } from '@/app/libs/definitions';
import { VehicleCard } from './vehicleCard/VehicleCard';

export function VehiclesList({
  filteredList,
  identity,
  onClick,
  toggleOpen,
}: {
  filteredList: VehiclesData;
  identity: string;
  onClick: (event: React.MouseEvent<HTMLLIElement>) => void;
  toggleOpen: () => void;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <ul className="absolute z-20 w-[24vw] h-[35vh] top-[5.5vh] left-0 text-[1.666667vh] text-[#585858] rounded-[0.4vw] text-center overflow-y-scroll">
      {filteredList && filteredList.length > 0 ? (
        filteredList.map((el, index) => (
          <li
            key={`${el.id * index}vehiclelist${(index + index) * 3}`}
            onClick={(e) => {
              onClick(e);
              toggleOpen();
            }}
            data-id={el.id}
            data-brand={el.vehicle_brands.brand}
            data-model={el.vehicle_models.model}
            data-identity={identity}
            className="z-50 w-full h-fit flex justify-center items-center transition-colors odd:bg-[#E6F6F3] even:bg-[#FFF] py-[1vh] px-[0.7vw] odd:hover:bg-[#c4e9e2] even:hover:bg-[#f1ecec] cursor-pointer"
          >
            <VehicleCard
              brand={el.vehicle_brands?.brand || ''}
              model={el.vehicle_models?.model || ''}
              year={el.vehicle_manufacture_years?.year || ''}
              extColor={el.exterior_vehicle_colors?.color || ''}
              mileage={el.vehicle_mileages?.mileage || ''}
              price={el.vehicle_prices?.price || ''}
              status={el.vehicle_status?.status || ''}
              vin={el.vehicle_identification_numbers?.vin || ''}
              stockNo={el.stock_no || ''}
            />
          </li>
        ))
      ) : (
        <li className="z-50 w-fit h-fit bg-[#E6F6F3]">
          <p className="w-fit px-[0.5vw] py-[0.7vh] text-[2vh] text-[#00A78B] font-bold">
            No vehicle found
          </p>
        </li>
      )}
    </ul>
  );
}
