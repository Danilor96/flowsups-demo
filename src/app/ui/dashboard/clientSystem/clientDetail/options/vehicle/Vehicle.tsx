import { AnimatePresence, motion } from 'framer-motion';
import { CloseWindow, ShowInfo } from '&/icons/Icons';
import {
  adminDashboardStore,
  messagesStore,
  modalWindowStore,
  singleCLientDataStore,
} from '@/store/adminDashboard';
import { createElement, useEffect, useState } from 'react';
import { VehicleOptions, VehiclesData } from '@/app/libs/definitions';
import { ModalWindow } from '@/app/ui/modalWindowsStructure/ModalWindow';

const vehiclePrice = [
  { id: 1, price: 50 },
  { id: 2, price: 100 },
  { id: 3, price: 150 },
];

export function Vehicle() {
  // ---------------- global states ----------------
  const { closeClientVehicle } = modalWindowStore();

  const { vehicleTypesData, vehicleMileagesData, vehicleOptions } = adminDashboardStore();
  const { getVehicleTypes, getVehicleMileages, getVehicleOptions } = adminDashboardStore();

  const { singleCLientData } = singleCLientDataStore();
  const { getSingleClientData } = singleCLientDataStore();

  // const { vehicles } = vehiclesDataStore();
  // const { getVehiclesData } = vehiclesDataStore();

  const { messages } = messagesStore();
  const { setMessages } = messagesStore();

  useEffect(() => {
    getVehicleTypes();
    getVehicleMileages();
    getVehicleOptions();
  }, [getVehicleTypes, getVehicleMileages, getVehicleOptions]);

  // ---------------- local states ----------------

  const [vehicleOptionsList, setVehicleOptionsList] = useState<VehicleOptions>();
  const [vehicleList, setVehicleList] = useState<VehiclesData>();
  const [filteredList, setFilteredList] = useState<VehiclesData>();
  const [vehicleColors, setVehicleColors] = useState<{ id?: number; color?: string }[]>([
    { id: undefined, color: undefined },
  ]);
  // ------------ wish list ------------
  const [showCustomerWishlistVehicles, setShowCustomerWishlistVehicles] = useState(false);
  const [vehicleTypeInput, setVehicleTypeInput] = useState('');
  const [wishlistVehicleSelected, setWishlistVehicleSelected] = useState<any>('');
  // max mileage --------
  const [vehicleMaxMileageInput, setVehicleMaxMileageInput] = useState('');
  const [showNewMaxMileageInput, setShowNewMaxMileageInput] = useState(false);
  const [newVehicleMaxmileageInput, setNewVehicleMaxmileageInput] = useState('');
  const [newMaxmileage, setNewMaxmileage] = useState(false);
  // max price --------
  const [vehicleMaxPriceInput, setVehicleMaxPriceInput] = useState('');
  const [showNewMaxPriceInput, setShowNewMaxPriceInput] = useState(false);
  const [newVehicleMaxPriceInput, setNewVehicleMaxPriceInput] = useState('');
  const [newMaxPrice, setNewMaxPrice] = useState(false);
  // min year
  const [minYearInput, setMinYearInput] = useState('');
  // exterior color --------
  const [vehicleExteriorColorInput, setVehicleExteriorColorInput] = useState('');
  const [showNewExteriorColorInput, setShowNewExteriorColorInput] = useState(false);
  const [newVehicleExteriorColorInput, setNewVehicleExteriorColorInput] = useState('');
  const [newExteriorColor, setNewExteriorColor] = useState(false);
  // body type --------
  const [vehicleBodyTypeInput, setVehicleBodyTypeInput] = useState('');
  // ------------ trade in ------------
  const [showVehicleOptions, setShowVehicleOptions] = useState(false);
  const [showCustomerTradeinVehicles, setShowCustomerTradeinVehicles] = useState(false);
  const [tradeinFilteredList, setTradeinFilteredList] = useState<VehiclesData>();
  const [tradeinSelectedVehicleInput, setTradeinSelectedVehicleInput] = useState<string>('');
  // vin --------
  const [vinInput, setVinInput] = useState('');
  // vehicle type --------
  const [tradeinVehicleTypeInput, setTradeinVehicleTypeInput] = useState('');
  // year --------
  const [tradeinVehicleYearInput, setTradeinVehicleYearInput] = useState('');
  // make --------
  const [tradeinVehicleMakeInput, setTradeinVehicleMakeInput] = useState('');
  // model --------
  const [tradeinVehicleModelInput, setTradeinVehicleModelInput] = useState('');
  // trim --------
  const [tradeinVehicleTrimInput, setTradeinVehicleTrimInput] = useState('');
  // mileage --------
  const [vehicleTradeinMileageInput, setVehicleTradeinMileageInput] = useState('');
  const [showNewTradeinMileageInput, setShowNewTradeinMileageInput] = useState(false);
  const [newVehicleTradeinmileageInput, setNewVehicleTradeinmileageInput] = useState('');
  const [newTradeinmileage, setNewTradeinmileage] = useState(false);
  // interior color --------
  const [vehicleTradeinInteriorColorInput, setVehicleTradeinInteriorColorInput] = useState('');
  const [showNewTradeinInteriorColorInput, setShowNewTradeinInteriorColorInput] = useState(false);
  const [newVehicleTradeinInteriorColorInput, setNewVehicleTradeinInteriorColorInput] =
    useState('');
  const [newTradeinInteriorColor, setNewTradeinInteriorColor] = useState(false);
  // exterior color --------
  const [vehicleTradeinExteriorColorInput, setVehicleTradeinExteriorColorInput] = useState('');
  const [showNewTradeinExteriorColorInput, setShowNewTradeinExteriorColorInput] = useState(false);
  const [newVehicleTradeinExteriorColorInput, setNewVehicleTradeinExteriorColorInput] =
    useState('');
  const [newTradeinExteriorColor, setNewTradeinExteriorColor] = useState(false);
  // book --------
  const [tradeinBookInput, setTradeinBookInput] = useState('');
  // allowance --------
  const [tradeinAllowanceInput, setTradeinAllowanceInput] = useState('');
  // payoff --------
  const [tradeinPayoffInput, setTradeinPayoffInput] = useState('');
  // comment --------
  const [tradeinCommentInput, setTradeinCommentInput] = useState('');
  // ------------ vehicle selected to sell ------------
  const [showVehiclesToSell, setShowVehiclesToSell] = useState(false);
  // ------------ server messages ------------
  // error messages
  const [fieldTradeinErrorMessage, setFieldTradeinErrorMessage] = useState<any>('');
  const [fieldWishlistErrorMessage, setFieldWishlistErrorMessage] = useState<any>('');

  useEffect(() => {
    if (singleCLientData) {
      if (singleCLientData?.tradein_client) {
        if (singleCLientData?.tradein_client.length > 0) {
          setVinInput(singleCLientData?.tradein_client[0].vin.vin);
          setTradeinVehicleTypeInput(`${singleCLientData?.tradein_client[0].vehicle_type_id}`);
          setTradeinVehicleYearInput(singleCLientData?.tradein_client[0].year.year);
          setTradeinVehicleMakeInput(singleCLientData?.tradein_client[0].make.brand);
          setTradeinVehicleModelInput(singleCLientData?.tradein_client[0].model.model);
          setTradeinVehicleTrimInput(singleCLientData?.tradein_client[0].trim.trim);
          setVehicleTradeinMileageInput(`${singleCLientData?.tradein_client[0].mileage_id}`);
          setVehicleTradeinInteriorColorInput(
            `${singleCLientData?.tradein_client[0].int_color_id}`,
          );
          setVehicleTradeinExteriorColorInput(
            `${singleCLientData?.tradein_client[0].ext_color_id}`,
          );
          setTradeinBookInput(`${singleCLientData?.tradein_client[0].book_value}`);
          setTradeinAllowanceInput(`${singleCLientData?.tradein_client[0].trade_allowance}`);
          setTradeinPayoffInput(`${singleCLientData?.tradein_client[0].trade_payoff}`);
          setTradeinCommentInput(`${singleCLientData?.tradein_client[0].comment || ''}`);
        }
      }
    }

    if (vehicleOptions && vehicleOptions.length > 0 && vehicleOptions[0].vehicle_colors) {
      setVehicleColors(vehicleOptions[0].vehicle_colors);
    }
  }, [singleCLientData, vehicleOptions]);

  const handleCloseWindow = () => {
    closeClientVehicle();
  };

  // --------------------- wishlist logic block ---------------------

  const handleChangeFilterCustomerWishList = (e: any) => {
    const value = e.target.value;

    if (e.target.id === 'vehicleType') {
      setVehicleTypeInput(value);
    }

    if (e.target.id === 'vehicleMakeAndModel') {
      setVehicleTypeInput(value);
      setWishlistVehicleSelected(value);
    }

    if (e.target.id === 'maxMileage') {
      setVehicleMaxMileageInput(value);
    }
  };

  useEffect(() => {
    if (vehicleTypeInput && vehicleList) {
      const searchTerm = vehicleTypeInput;
      const searchTermArray = searchTerm.split(' ');

      const filteredData = vehicleList.filter((vehicle) => {
        const type = (vehicle.vehicle_type?.id && vehicle.vehicle_type.id.toString()) || '';
        const brand =
          (vehicle.vehicle_brands?.brand && vehicle.vehicle_brands.brand.toLowerCase().trim()) ||
          '';
        const model =
          (vehicle.vehicle_models?.model && vehicle.vehicle_models.model.toLowerCase().trim()) ||
          '';

        return searchTermArray.every(
          (word: any) => type?.includes(word) || brand?.includes(word) || model?.includes(word),
        );
      });

      setFilteredList(filteredData);
    }
    if (!vehicleTypeInput && vehicleList) {
      setFilteredList(vehicleList);
    }
  }, [vehicleTypeInput, vehicleList]);

  const handleShowVehicles = (e: any) => {
    setShowCustomerWishlistVehicles(!showCustomerWishlistVehicles);
  };

  // max mileage --------

  const handleChangeMaxMileage = (e: any) => {
    setVehicleMaxMileageInput(e.target.value);
    if (e.target.value === 'add') {
      setShowNewMaxMileageInput(true);
    } else {
      setShowNewMaxMileageInput(false);
    }
  };

  const handleChangeNewMaxMileage = (e: any) => {
    setNewVehicleMaxmileageInput(e.target.value);
  };

  const handleSetNewMaxMileageValue = () => {
    setVehicleMaxMileageInput(newVehicleMaxmileageInput);
    setNewMaxmileage(true);
    setShowNewMaxMileageInput(false);
  };

  const maxMileageOpt = () => {
    return createElement(
      'option',
      { value: `${newVehicleMaxmileageInput}` },
      `${newVehicleMaxmileageInput}`,
    );
  };

  // max price --------

  const handleChangeMaxPrice = (e: any) => {
    setVehicleMaxPriceInput(e.target.value);
    if (e.target.value === 'add') {
      setShowNewMaxPriceInput(true);
    } else {
      setShowNewMaxPriceInput(false);
    }
  };

  const handleChangeNewMaxPrice = (e: any) => {
    setNewVehicleMaxPriceInput(e.target.value);
  };

  const handleSetNewMaxPriceValue = () => {
    setVehicleMaxPriceInput(newVehicleMaxPriceInput);
    setNewMaxPrice(true);
    setShowNewMaxPriceInput(false);
  };

  const maxPriceOpt = () => {
    return createElement(
      'option',
      { value: `${newVehicleMaxPriceInput}` },
      `${newVehicleMaxPriceInput}`,
    );
  };

  // min year --------

  const handleChangeMinYear = (e: any) => {
    setMinYearInput(e.target.value);
  };

  // exterior color --------

  const handleChangeExteriorColor = (e: any) => {
    setVehicleExteriorColorInput(e.target.value);
    if (e.target.value === 'add') {
      setShowNewExteriorColorInput(true);
    } else {
      setShowNewExteriorColorInput(false);
    }
  };

  const handleChangeNewExteriorColor = (e: any) => {
    setNewVehicleExteriorColorInput(e.target.value);
  };

  const handleSetNewExteriorColorValue = () => {
    setVehicleExteriorColorInput(newVehicleExteriorColorInput);
    setNewExteriorColor(true);
    setShowNewExteriorColorInput(false);
  };

  const exteriorColorOpt = () => {
    return createElement(
      'option',
      { value: `${newVehicleExteriorColorInput}` },
      `${newVehicleExteriorColorInput}`,
    );
  };

  // body type --------

  const handleChangeBodyType = (e: any) => {
    setVehicleBodyTypeInput(e.target.value);
  };

  const handleSelectAVehicle = (e: any) => {
    setShowCustomerWishlistVehicles(false);

    const li = e.target.closest('li');
    if (li) {
      const liId = li.getAttribute('data-id');
      const liBrand = li.getAttribute('data-brand');
      const liModel = li.getAttribute('data-model');

      setWishlistVehicleSelected({
        id: liId,
        brand: liBrand,
        model: liModel,
      });
    }
  };

  // --------------------- trade in logic block ---------------------

  const handleTradeinFirstInput = () => {
    if (showCustomerTradeinVehicles) {
      setShowVehicleOptions(false);
      setShowCustomerTradeinVehicles(false);
      return;
    }
    setShowVehicleOptions(!showVehicleOptions);
    setShowCustomerTradeinVehicles(false);
  };

  const handleSelectTradeinVehicle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;

    setTradeinSelectedVehicleInput(value);
  };

  const handleChangeTradeinVehicle = (e: any) => {
    setShowVehicleOptions(false);
    setShowCustomerTradeinVehicles(true);
    setTradeinSelectedVehicleInput(e.target.value);

    const searchTerm = e.target.value;
    const searchArray = searchTerm.toLowerCase().split(' ');

    if (searchTerm !== '') {
      const filteredData = vehicleList?.filter((vehicle) => {
        const model =
          (vehicle.vehicle_models?.model && vehicle.vehicle_models.model.toLowerCase().trim()) ||
          '';
        const brand =
          (vehicle.vehicle_brands?.brand && vehicle.vehicle_brands.brand.toLowerCase().trim()) ||
          '';

        return (
          searchArray.every((word: any) => model?.includes(word) || brand?.includes(word)) &&
          vehicle
        );
      });

      setTradeinFilteredList(filteredData);
    }
    if (!searchTerm && vehicleList) {
      setTradeinFilteredList(vehicleList);
    }
  };

  const [fieldErrors, setFieldErrors] = useState<{
    vinInput: [string];
    tradeinVehicleYearInput: [string];
    tradeinVehicleMakeInput: [string];
    tradeinVehicleModelInput: [string];
    tradeinVehicleTrimInput: [string];
    vehicleTradeinMileageInput: [string];
    vehicleTradeinInteriorColorInput: [string];
    vehicleTradeinExteriorColorInput: [string];
    tradeinCommentInput: [string];
    tradeinBookInput: [string];
    tradeinAllowanceInput: [string];
    tradeinVehicleTypeInput: [string];
    tradeinPayoffInput: [string];
  }>({
    vinInput: [''],
    tradeinVehicleYearInput: [''],
    tradeinVehicleMakeInput: [''],
    tradeinVehicleModelInput: [''],
    tradeinVehicleTrimInput: [''],
    vehicleTradeinMileageInput: [''],
    vehicleTradeinInteriorColorInput: [''],
    vehicleTradeinExteriorColorInput: [''],
    tradeinCommentInput: [''],
    tradeinBookInput: [''],
    tradeinAllowanceInput: [''],
    tradeinVehicleTypeInput: [''],
    tradeinPayoffInput: [''],
  });

  // vin --------

  const handleChangeVin = (e: any) => {
    setVinInput(e.target.value);
  };

  // vehicle type --------

  const handleChangetradeinVehicleTypeInput = (e: any) => {
    setTradeinVehicleTypeInput(e.target.value);
  };

  // year --------

  const handleChangeTradeinYear = (e: any) => {
    setTradeinVehicleYearInput(e.target.value);
  };

  // make --------

  const handleChangeTradeinMake = (e: any) => {
    setTradeinVehicleMakeInput(e.target.value);
  };

  // model --------
  const handleChangeTradeinModel = (e: any) => {
    setTradeinVehicleModelInput(e.target.value);
  };

  // trim --------

  const handleChangeTradeinTrim = (e: any) => {
    setTradeinVehicleTrimInput(e.target.value);
  };

  // mileage --------
  const handleChangeTradeinMileage = (e: any) => {
    setVehicleTradeinMileageInput(e.target.value);
    if (e.target.value === 'add') {
      setShowNewTradeinMileageInput(true);
    } else {
      setShowNewTradeinMileageInput(false);
    }
  };

  const handleChangeNewTradeinMileage = (e: any) => {
    setNewVehicleTradeinmileageInput(e.target.value);
  };

  const handleSetNewTradeinMileageValue = () => {
    setVehicleTradeinMileageInput(newVehicleTradeinmileageInput);
    setNewTradeinmileage(true);
    setShowNewTradeinMileageInput(false);
  };

  const tradeinMileageOpt = () => {
    return createElement(
      'option',
      { value: `${newVehicleTradeinmileageInput}` },
      `${newVehicleTradeinmileageInput}`,
    );
  };

  // interior color --------

  const handleChangeTradeinInteriorColor = (e: any) => {
    setVehicleTradeinInteriorColorInput(e.target.value);
    if (e.target.value === 'add') {
      setShowNewTradeinInteriorColorInput(true);
    } else {
      setShowNewTradeinInteriorColorInput(false);
    }
  };

  const handleChangeNewTradeinInteriorColor = (e: any) => {
    setNewVehicleTradeinInteriorColorInput(e.target.value);
  };

  const handleSetNewTradeinInteriorColorValue = () => {
    setVehicleTradeinInteriorColorInput(newVehicleTradeinInteriorColorInput);
    setNewTradeinInteriorColor(true);
    setShowNewTradeinInteriorColorInput(false);
  };

  const tradeinInteriorColorOpt = () => {
    return createElement(
      'option',
      { value: `${newVehicleTradeinInteriorColorInput}` },
      `${newVehicleTradeinInteriorColorInput}`,
    );
  };

  // exterior color --------

  const handleChangeTradeinExteriorColor = (e: any) => {
    setVehicleTradeinExteriorColorInput(e.target.value);
    if (e.target.value === 'add') {
      setShowNewTradeinExteriorColorInput(true);
    } else {
      setShowNewTradeinExteriorColorInput(false);
    }
  };

  const handleChangeNewTradeinExteriorColor = (e: any) => {
    setNewVehicleTradeinExteriorColorInput(e.target.value);
  };

  const handleSetNewTradeinExteriorColorValue = () => {
    setVehicleTradeinExteriorColorInput(newVehicleTradeinExteriorColorInput);
    setNewTradeinExteriorColor(true);
    setShowNewTradeinExteriorColorInput(false);
  };

  const tradeinExteriorColorOpt = () => {
    return createElement(
      'option',
      { value: `${newVehicleTradeinExteriorColorInput}` },
      `${newVehicleTradeinExteriorColorInput}`,
    );
  };

  // book value --------

  const handleChangeTradeinBookInputValue = (e: any) => {
    setTradeinBookInput(e.target.value);
  };

  // trade allowance --------

  const handleChangeTradeinAllowanceInput = (e: any) => {
    setTradeinAllowanceInput(e.target.value);
  };

  // trade payoff --------

  const handleChangeTradeinPayoffInput = (e: any) => {
    setTradeinPayoffInput(e.target.value);
  };

  // comment

  const handleChangeTradeinCommentInput = (e: any) => {
    setTradeinCommentInput(e.target.value);
  };

  // data fetching

  const handleSaveInfo = async () => {
    const formData = new FormData();

    // wishlist data

    // if (wishlistVehicleSelected) {
    //   formData.append('vehicle_id', wishlistVehicleSelected.id);
    //   formData.append('max_mileage', vehicleMaxMileageInput);
    //   formData.append('max_price', vehicleMaxPriceInput);
    //   formData.append('min_year', minYearInput);
    //   formData.append('exterior_color', vehicleExteriorColorInput);
    //   formData.append('body_type', vehicleBodyTypeInput);
    //   formData.append('client_id', `${singleCLientData?.id}`);
    //   formData.append('wishlist', '1');
    //   if (
    //     singleCLientData?.wishlist_client &&
    //     singleCLientData?.wishlist_client.length > 0 &&
    //     singleCLientData?.wishlist_client[0].id &&
    //     !wishlistVehicleSelected.id
    //   ) {
    //     formData.append('wishlistAlreadyExist', `${singleCLientData?.wishlist_client?.[0].id}`);
    //   }

    //   const res = await (
    //     await fetch('/api/adminDashboard/clientVehicle', {
    //       method: 'POST',
    //       body: formData,
    //     })
    //   ).json();

    //   console.log(res);

    //   if (res.successMessage) {
    //     setServerSuccessMessage({ successMessage: res.successMessage });
    //     setFieldWishlistErrorMessage('');
    //     getSingleClientData(`${singleCLientData?.id}`);
    //   }

    //   if (res.fieldErrors) {
    //     setFieldWishlistErrorMessage(res.fieldErrors);
    //   }

    //   if (res.serverError) {
    //     setServerErrorMessage({ serverError: res.serverError });
    //   }
    // } else {
    //   setFieldWishlistErrorMessage('');
    // }

    // trade in

    try {
      formData.append('vinInput', vinInput);
      formData.append('tradeinVehicleYearInput', tradeinVehicleYearInput);
      formData.append('tradeinVehicleMakeInput', tradeinVehicleMakeInput);
      formData.append('tradeinVehicleModelInput', tradeinVehicleModelInput);
      formData.append('tradeinVehicleTrimInput', tradeinVehicleTrimInput);
      formData.append('vehicleTradeinMileageInput', vehicleTradeinMileageInput);
      formData.append('vehicleTradeinInteriorColorInput', vehicleTradeinInteriorColorInput);
      formData.append('vehicleTradeinExteriorColorInput', vehicleTradeinExteriorColorInput);
      formData.append('tradeinCommentInput', tradeinCommentInput);
      formData.append('tradeinBookInput', tradeinBookInput);
      formData.append('tradeinAllowanceInput', tradeinAllowanceInput);
      formData.append('tradeinVehicleTypeInput', tradeinVehicleTypeInput);
      formData.append('tradeinPayoffInput', tradeinPayoffInput);
      formData.append('client_id', `${singleCLientData?.id}`);
      formData.append('tradein', '1');

      let res: any = '';

      if (singleCLientData?.tradein_client && singleCLientData?.tradein_client.length > 0) {
        res = await (
          await fetch(
            `/api/adminDashboard/clientVehicle/${singleCLientData.tradein_client[0].id}`,
            {
              method: 'PUT',
              body: formData,
            },
          )
        ).json();
      } else {
        res = await (
          await fetch('/api/adminDashboard/clientVehicle', { method: 'POST', body: formData })
        ).json();
      }

      if (res.fieldErrors) {
        setFieldErrors(res.fieldErrors);
      }

      if (res.successMessage) {
        singleCLientData?.id && getSingleClientData(singleCLientData?.id.toString());
        setMessages(undefined, res.successMessage);
        setFieldErrors({
          vinInput: [''],
          tradeinVehicleYearInput: [''],
          tradeinVehicleMakeInput: [''],
          tradeinVehicleModelInput: [''],
          tradeinVehicleTrimInput: [''],
          vehicleTradeinMileageInput: [''],
          vehicleTradeinInteriorColorInput: [''],
          vehicleTradeinExteriorColorInput: [''],
          tradeinCommentInput: [''],
          tradeinBookInput: [''],
          tradeinAllowanceInput: [''],
          tradeinVehicleTypeInput: [''],
          tradeinPayoffInput: [''],
        });
      }

      if (res.serverError) {
        setMessages(res.serverError);
      }
    } catch (error) {
      setMessages('An error occurred');
    }

    // if (
    //   singleCLientData?.tradein_client &&
    //   singleCLientData?.tradein_client.length > 0 &&
    //   singleCLientData?.tradein_client?.[0].id &&
    //   !wishlistVehicleSelected.id
    // ) {
    //   formData.append('tradeinAlreadyExist', `${singleCLientData?.wishlist_client?.[0].id}`);
    // }
  };

  const handleDeleteTradeinVehicle = async () => {};

  const handleSearchVehicle = () => {
    setTradeinFilteredList(vehicleList);
    setShowVehicleOptions(false);
    setShowCustomerTradeinVehicles(true);
  };

  return (
    <ModalWindow
      top={0}
      minSizeFull
      successMessage={messages.successMessage}
      failMessage={messages.serverError}
      positionFixed
    >
      {/* modal window main body block */}
      <article className="relative w-[82.8125vw] h-fit mt-[7.5vh] ml-[8.4375vw] bg-[#FFFFFF] rounded-[0.520833vw] pb-[3.055555vh]">
        {/* modal window header block */}
        <aside className="w-full h-[9.259259vh] shadow-crmFormShadow flex items-center justify-center pt-[2.037037vh] pb-[1.6vh]">
          <div className="w-[79.6875vw] flex flex-row items-center justify-between">
            <p className="text-[2.777778vh] font-semibold leading-[1.805556vh] text-[#00A78B]">
              Vehicle
            </p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={handleCloseWindow}
            >
              <CloseWindow />
            </motion.button>
          </div>
        </aside>
        {/* modal window content block */}

        {/* 2 */}
        <div className="w-[78.020833vw] ml-[2.5vw] mt-[2.777778vh]">
          <article className="w-full flex flex-row justify-between items-center py-[2.314815vh] px-[2.083333vw] bg-[#C9EBE6] rounded-t-[1.041667vw]">
            <p className="text-[2.777778vh] font-semibold leading-[1.805556vh] text-[#00A78B]">
              Trade-in
            </p>
            <ShowInfo />
          </article>
          <article className="w-full h-fit border-b-[0.15625vw] border-l-[0.15625vw] border-r-[0.15625vw] border-[#C9EBE6] rounded-b-[1.041667vw] pt-[3.333333vh] pl-[2.03125vw] pb-[3.611111vh]">
            {/* first inputs row */}
            <section className="">
              <div className="relative w-[27.634375vw]">
                {/* <aside className="flex flex-row">
                  <input
                    type="text"
                    name="tradeinFirstInput"
                    id="tradeinFirstInput"
                    onChange={handleChangeTradeinVehicle}
                    value={tradeinSelectedVehicleInput}
                    className="w-[90%] h-[5.277778vh] bg-[#F4F4F4] rounded-l-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleTradeinFirstInput}
                    className="w-[10%] h-[5.277778vh] bg-[#C9EBE6] flex justify-center items-center rounded-r-[0.520833vw]"
                  >
                    <ThreeGreenDots />
                  </button>
                </aside> */}
              </div>
            </section>
            {/* second inputs row */}
            <section className="mt-[3.703704vh] flex flex-row">
              <div className="relative w-[10.9375vw] flex flex-col">
                <label
                  htmlFor="vehicleVin"
                  className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                >
                  VIN
                </label>
                <input
                  onChange={handleChangeVin}
                  type="text"
                  name="vehicleVin"
                  value={vinInput}
                  id="vehicleVin"
                  className="h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                />
                <AnimatePresence>
                  {fieldErrors && fieldErrors.vinInput && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                      className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                    >
                      {fieldErrors.vinInput[0]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <div className="relative flex flex-col w-[10.208333vw] ml-[0.9375vw]">
                <label
                  htmlFor="tradeinVehicleTypeInput"
                  className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                >
                  Vehicle Type
                </label>
                <select
                  onChange={handleChangetradeinVehicleTypeInput}
                  name="tradeinVehicleTypeInput"
                  id="tradeinVehicleTypeInput"
                  value={tradeinVehicleTypeInput}
                  className="w-full h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                >
                  <option value="">Select a Type</option>
                  {vehicleTypesData &&
                    vehicleTypesData.map((el) => (
                      <option key={el.id} value={el.id}>
                        {el.type}
                      </option>
                    ))}
                </select>
                <AnimatePresence>
                  {fieldErrors && fieldErrors.tradeinVehicleTypeInput && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                      className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                    >
                      {fieldErrors.tradeinVehicleTypeInput[0]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              {/* <div className="w-[9vw] h-[5.277778vh] flex flex-row ml-[0.9375vw] items-center mt-auto">
                <input type="checkbox" name="" id="" className="w-[1.14375vw] h-[1.14375vw]" />
                <p className="w-fit text-[1.626852vh] font-medium leading-[2.440740vh] text-[#B3B3B3] ml-[0.653646vw]">
                  Auto-build Vehicle
                </p>
              </div> */}
              <div className="relative flex flex-col w-[16.041667vw] ml-[0.9375vw]">
                <label
                  htmlFor="tradeinBookInputValue"
                  className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                >
                  Book Value
                </label>
                <aside className="flex flex-row">
                  <input
                    type="text"
                    onChange={handleChangeTradeinBookInputValue}
                    name="tradeinBookInputValue"
                    id="tradeinBookInputValue"
                    value={tradeinBookInput}
                    className="w-[80%] h-[5.277778vh] bg-[#F4F4F4] rounded-l-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                  />
                  <button
                    type="button"
                    className="w-[20%] h-[5.277778vh] bg-[#C9EBE6] flex justify-center items-center rounded-r-[0.520833vw] text-[1.666667vh] font-medium leading-[1.805556vh] text-[#00A78B]"
                  >
                    Book
                  </button>
                </aside>
                <AnimatePresence>
                  {fieldErrors && fieldErrors.tradeinBookInput && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                      className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                    >
                      {fieldErrors.tradeinBookInput[0]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <div className="relative w-[10.052083vw] flex flex-col ml-[0.9375vw]">
                <label
                  htmlFor="tradeinInteriorColor"
                  className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                >
                  Trade Allowance
                </label>
                <input
                  onChange={handleChangeTradeinAllowanceInput}
                  value={tradeinAllowanceInput}
                  type="text"
                  name="tradeinInteriorColor"
                  id="tradeinInteriorColor"
                  className="h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                />
                <AnimatePresence>
                  {fieldErrors && fieldErrors.tradeinAllowanceInput && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                      className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                    >
                      {fieldErrors.tradeinAllowanceInput[0]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <div className="relative w-[10.052083vw] flex flex-col ml-[0.9375vw]">
                <label
                  htmlFor="tradeinInteriorColor"
                  className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                >
                  Trade Payoff
                </label>
                <input
                  onChange={handleChangeTradeinPayoffInput}
                  type="text"
                  value={tradeinPayoffInput}
                  name="tradeinInteriorColor"
                  id="tradeinInteriorColor"
                  className="h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                />
                <AnimatePresence>
                  {fieldErrors && fieldErrors.tradeinPayoffInput && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                      className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                    >
                      {fieldErrors.tradeinPayoffInput[0]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </section>
            {/* third inputs row */}
            <section className="mt-[3.703704vh] flex flex-row">
              <article className="flex flex-col gap-[3.703704vh]">
                {/* col 1 */}
                <aside className="flex flex-row">
                  <div className="relative w-[7.291667vw] flex flex-col">
                    <label
                      htmlFor="tradeinYear"
                      className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                    >
                      Year
                    </label>
                    <input
                      onChange={handleChangeTradeinYear}
                      type="text"
                      value={tradeinVehicleYearInput}
                      name="tradeinYear"
                      id="tradeinYear"
                      maxLength={4}
                      className="h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                    />
                    <AnimatePresence>
                      {fieldErrors && fieldErrors.tradeinVehicleYearInput && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1 }}
                          className="absolute bottom-[-4.5vh] text-[1.666667vh] text-[#F00]"
                        >
                          {fieldErrors.tradeinVehicleYearInput[0]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="relative w-[7.291667vw] flex flex-col ml-[0.9375vw]">
                    <label
                      htmlFor="tradeinMake"
                      className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                    >
                      Make
                    </label>
                    <input
                      onChange={handleChangeTradeinMake}
                      type="text"
                      name="tradeinMake"
                      value={tradeinVehicleMakeInput}
                      id="tradeinMake"
                      className="h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                    />
                    <AnimatePresence>
                      {fieldErrors && fieldErrors.tradeinVehicleMakeInput && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1 }}
                          className="absolute bottom-[-4.5vh] text-[1.666667vh] text-[#F00]"
                        >
                          {fieldErrors.tradeinVehicleMakeInput[0]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="relative w-[7.291667vw] flex flex-col ml-[0.9375vw]">
                    <label
                      htmlFor="tradeinModel"
                      className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                    >
                      Model
                    </label>
                    <input
                      onChange={handleChangeTradeinModel}
                      type="text"
                      name="tradeinModel"
                      value={tradeinVehicleModelInput}
                      id="tradeinModel"
                      className="h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                    />
                    <AnimatePresence>
                      {fieldErrors && fieldErrors.tradeinVehicleModelInput && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1 }}
                          className="absolute bottom-[-4.5vh] text-[1.666667vh] text-[#F00]"
                        >
                          {fieldErrors.tradeinVehicleModelInput[0]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="relative w-[7.291667vw] flex flex-col ml-[0.9375vw]">
                    <label
                      htmlFor="tradeinTrim"
                      className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                    >
                      Trim
                    </label>
                    <input
                      onChange={handleChangeTradeinTrim}
                      type="text"
                      name="tradeinTrim"
                      value={tradeinVehicleTrimInput}
                      id="tradeinTrim"
                      className="h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                    />
                    <AnimatePresence>
                      {fieldErrors && fieldErrors.tradeinVehicleTrimInput && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1 }}
                          className="absolute bottom-[-4.5vh] text-[1.666667vh] text-[#F00]"
                        >
                          {fieldErrors.tradeinVehicleTrimInput[0]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </aside>
                {/* col 2 */}
                <aside className="flex flex-row">
                  <div className="relative flex flex-col w-[10.46875vw]">
                    <label
                      htmlFor="tradeinMileage"
                      className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                    >
                      Mileage
                    </label>
                    <select
                      onChange={handleChangeTradeinMileage}
                      name="tradeinMileage"
                      id="tradeinMileage"
                      value={vehicleTradeinMileageInput}
                      className="w-full h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                    >
                      <option value="">Select a Mileage</option>
                      <option value="add">New Value</option>
                      {vehicleMileagesData &&
                        vehicleMileagesData.map((el) => (
                          <option key={el.id} value={el.id}>
                            {el.mileage}
                          </option>
                        ))}
                      {newTradeinmileage && tradeinMileageOpt()}
                    </select>
                    {showNewTradeinMileageInput && (
                      <aside className="absolute z-20 top-[9.55vh] flex flex-row w-full">
                        <input
                          type="text"
                          onChange={handleChangeNewTradeinMileage}
                          name="vehicleNewTradeinMileage"
                          id="vehicleNewTradeinMileage"
                          placeholder="New Tradein Mileage Here"
                          className="w-[80%] h-[5.277778vh] bg-[#F4F4F4] rounded-l-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw] placeholder:text-[#00A78B]"
                        />
                        <button
                          type="button"
                          onClick={handleSetNewTradeinMileageValue}
                          className="w-[20%] h-[5.277778vh] bg-[#C9EBE6] flex justify-center items-center rounded-r-[0.520833vw] text-[1.666667vh] font-medium leading-[1.805556vh] text-[#00A78B]"
                        >
                          Done
                        </button>
                      </aside>
                    )}
                    <AnimatePresence>
                      {fieldErrors && fieldErrors.vehicleTradeinMileageInput && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1 }}
                          className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                        >
                          {fieldErrors.vehicleTradeinMileageInput[0]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="relative flex flex-col w-[10.46875vw] ml-[0.9375vw]">
                    <label
                      htmlFor="tradeinInteriorColorSelect"
                      className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                    >
                      Interior Color
                    </label>
                    <select
                      onChange={handleChangeTradeinInteriorColor}
                      name="tradeinInteriorColorSelect"
                      id="tradeinInteriorColorSelect"
                      value={vehicleTradeinInteriorColorInput}
                      className="w-full h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                    >
                      <option value="">Select a Color</option>
                      <option value="add">New Value</option>
                      {vehicleColors &&
                        vehicleColors.map((el) => (
                          <option key={el.id} value={el.id}>
                            {el.color}
                          </option>
                        ))}
                      {newTradeinInteriorColor && tradeinInteriorColorOpt()}
                    </select>
                    {showNewTradeinInteriorColorInput && (
                      <aside className="absolute z-20 top-[9.55vh] flex flex-row w-full">
                        <input
                          type="text"
                          onChange={handleChangeNewTradeinInteriorColor}
                          name="vehicleNewMaxMileage"
                          id="vehicleNewMaxMileage"
                          placeholder="New Color Here"
                          className="w-[80%] h-[5.277778vh] bg-[#F4F4F4] rounded-l-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw] placeholder:text-[#00A78B]"
                        />
                        <button
                          type="button"
                          onClick={handleSetNewTradeinInteriorColorValue}
                          className="w-[20%] h-[5.277778vh] bg-[#C9EBE6] flex justify-center items-center rounded-r-[0.520833vw] text-[1.666667vh] font-medium leading-[1.805556vh] text-[#00A78B]"
                        >
                          Done
                        </button>
                      </aside>
                    )}
                    <AnimatePresence>
                      {fieldErrors && fieldErrors.vehicleTradeinInteriorColorInput && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1 }}
                          className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                        >
                          {fieldErrors.vehicleTradeinInteriorColorInput[0]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="relative flex flex-col w-[10.46875vw] ml-[0.9375vw]">
                    <label
                      htmlFor="tradeinExteriorColorSelect"
                      className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                    >
                      Exterior Color
                    </label>
                    <select
                      onChange={handleChangeTradeinExteriorColor}
                      name="tradeinExteriorColorSelect"
                      id="tradeinExteriorColorSelect"
                      value={vehicleTradeinExteriorColorInput}
                      className="w-full h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                    >
                      <option value="">Select a Color</option>
                      <option value="add">New Value</option>
                      {vehicleColors &&
                        vehicleColors.map((el) => (
                          <option key={el.id} value={el.id}>
                            {el.color}
                          </option>
                        ))}
                      {newTradeinExteriorColor && tradeinExteriorColorOpt()}
                    </select>
                    {showNewTradeinExteriorColorInput && (
                      <aside className="absolute z-20 top-[9.55vh] flex flex-row w-full">
                        <input
                          type="text"
                          onChange={handleChangeNewTradeinExteriorColor}
                          name="vehicleNewMaxMileage"
                          id="vehicleNewMaxMileage"
                          placeholder="New Color Here"
                          className="w-[80%] h-[5.277778vh] bg-[#F4F4F4] rounded-l-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw] placeholder:text-[#00A78B]"
                        />
                        <button
                          type="button"
                          onClick={handleSetNewTradeinExteriorColorValue}
                          className="w-[20%] h-[5.277778vh] bg-[#C9EBE6] flex justify-center items-center rounded-r-[0.520833vw] text-[1.666667vh] font-medium leading-[1.805556vh] text-[#00A78B]"
                        >
                          Done
                        </button>
                      </aside>
                    )}
                    <AnimatePresence>
                      {fieldErrors && fieldErrors.vehicleTradeinExteriorColorInput && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1 }}
                          className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                        >
                          {fieldErrors.vehicleTradeinExteriorColorInput[0]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </aside>
              </article>
              <article className="ml-[2.8125vw] h-full">
                <div className="relative w-[38.072916vw] flex flex-col">
                  <label
                    htmlFor="tradeinYear"
                    className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                  >
                    Comment
                  </label>
                  <textarea
                    onChange={handleChangeTradeinCommentInput}
                    value={tradeinCommentInput}
                    name="tradeinYear"
                    id="tradeinYear"
                    className="h-[17.962962vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw] resize-none outline-none px-[0.3vw] py-[0.7vh]"
                  />
                </div>
              </article>
            </section>
          </article>
        </div>
        <motion.button
          onClick={handleSaveInfo}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-[11.875vw] h-[5.462963vh] flex justify-center items-center mt-[6.018519vh] ml-[68.385417vw] text-[1.626852vh] font-semibold leading-[2.440741vh] rounded-[0.653646vw] bg-[#00A78B] text-[#FFFFFF]"
        >
          Save
        </motion.button>
      </article>
    </ModalWindow>
  );
}
