import { useEffect, useState } from 'react';
import { Details } from '@/app/ui/dashboard/cards/inventory/details/Details';
import { messagesStore, modalWindowStore } from '@/store/adminDashboard';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { AddNewVehicle } from '&/dashboard/inventorySystem/addNewVehicle/AddNewVehicle';
import { AnimatePresence } from 'framer-motion';
import {
  addVehicleStore,
  clearAllInventorySystemFieldsStore,
  detailsInventorySystemIndexStore,
  editVehicleStore,
  inventorySystemIndexStore,
  userActionStore,
  vehiclesDataStore,
} from '@/store/inventory';
import { AddOtherVehicleModal } from '../reports/salesLog/salesLogStatistics/salesScore/addOther/AddVehicleModal';

export function InventorySystem() {
  // ----- global states -----

  const { closeNewTab } = modalWindowStore();
  const { closeInventorySystem } = modalWindowStore();

  const { vehicleAdded } = addVehicleStore();

  const { vehicleData } = editVehicleStore();
  const { clearVehicleData } = editVehicleStore();

  const { index } = inventorySystemIndexStore();
  const { setIndex } = inventorySystemIndexStore();

  const { setDetailsIndex } = detailsInventorySystemIndexStore();

  const { messages } = messagesStore();

  const { clearAllFields } = clearAllInventorySystemFieldsStore();

  const { setAddNewVehicle } = userActionStore();

  const { getVehiclesData } = vehiclesDataStore();

  // ----- local states -----

  const [title, setTitle] = useState<string>('');
  const [vehicleInfo, setVehicleInfo] = useState<string>('');

  useEffect(() => {
    vehicleData?.id
      ? setTitle('Edit Vehicle')
      : index === 1
      ? setTitle('Add New Vehicle')
      : index === 2 && setTitle('Details');
  }, [index, vehicleData]);

  useEffect(() => {
    if (vehicleData && vehicleData.id) {
      setVehicleInfo(
        `${vehicleData.vehicle_brands?.brand} ${vehicleData.vehicle_models?.model} ${
          vehicleData.vehicle_trim?.trim ? vehicleData.vehicle_trim?.trim : ''
        }`,
      );
    } else {
      setVehicleInfo(`${vehicleAdded.make2} ${vehicleAdded.model} ${vehicleAdded.trim || ''}`);
    }
  }, [vehicleAdded, vehicleData]);

  return (
    // <ModalWindow top={-13.8} successMessage={messages.successMessage} failMessage={messages.serverError} zIndex={60}>
    //   <ModalContainer positionRelative width={82.552083} marginTop={5.833333}>
    //     {/* <ModalContainerTitle
    //       title={title}
    //       closeWindowFunction={() => {
    //         // if (closeNewTab) {
    //         //   window.close();
    //         // }

    //         setAddNewVehicle(false);
    //         setDetailsIndex(1);
    //         setIndex(1);
    //         clearVehicleData();
    //         clearAllFields();
    //         closeInventorySystem();
    //       }}
    //       extraComponent={<p className="text-[3vh] text-[#999999] font-medium">{vehicleInfo}</p>}
    //       openNewTab={vehicleData ? true : false}
    //       directOpenUrl={vehicleData ? `/dashboard/inventory-${vehicleData.id}` : ''}
    //     /> */}
    //     <AnimatePresence>
    //       {index === 1 && <AddOtherVehicleModal onClose={() => setIndex(0)} onSave={() => {}} />}
    //       {index === 2 && <Details />}
    //     </AnimatePresence>
    //   </ModalContainer>
    // </ModalWindow>
    
      <AnimatePresence>
        {index === 1 && (
          <AddOtherVehicleModal
            onClose={() => {
              if (closeNewTab) {
                window.close();
              }
              setAddNewVehicle(false);
              setDetailsIndex(1);
              setIndex(1);
              clearVehicleData();
              clearAllFields();
              closeInventorySystem();
            }}
            onSave={() => {
              getVehiclesData();
            }}
            vehicleId={vehicleData?.id}
          />
        )}
        {/* {index === 2 && <Details />} */}
      </AnimatePresence>
  );
}
