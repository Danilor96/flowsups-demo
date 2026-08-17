import { ThreeGreenDots } from '../icons/Icons';
import useUiHandler from '../../../hooks/closeComponentsHandler';
import { adminDashboardStore } from '../../../store/adminDashboard';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export interface InputsAddresType {
  currentAddress: string;
  street: string;
  city: string;
  state: string;
  stateId?: number | null;
  zip?: string | null;
  county?: string | null;
}

interface props {
  label: string;
  inputsAddress: InputsAddresType;
  fieldErrors?: {
    [key: string]: [string | undefined];
  };
  setInputsAddress: React.Dispatch<React.SetStateAction<InputsAddresType>>;
}

const AddressInput = ({ label, inputsAddress, fieldErrors, setInputsAddress }: props) => {
  const statesData = adminDashboardStore(state => state.statesData);
  const getStates = adminDashboardStore(state => state.getStates);

  useEffect(() => {
    if(!statesData || statesData.length === 0) {
      getStates();
    }
  }, [getStates]);

  const { isOpen, ref, toggleOpen } = useUiHandler();
  const [stateId, setStateId] = useState<any>(inputsAddress?.stateId || null);

  const handleAddress = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;

    setInputsAddress(prevState => {
      let newState = { ...prevState };

      switch (name) {
        case 'currentAddress':
          newState.currentAddress = value;

          newState.street = handleCurrentAddress(newState.currentAddress).street;
          newState.city = handleCurrentAddress(newState.currentAddress).city;
          newState.state = handleCurrentAddress(newState.currentAddress).state;
          setStateId(handleCurrentAddress(newState.currentAddress).stateId);
          newState.zip = handleCurrentAddress(newState.currentAddress).zip;
          newState.county = handleCurrentAddress(newState.currentAddress).county;
          break;

        case 'street':
          newState.street = value;
          break;

        case 'city':
          newState.city = value;
          break;

        case 'state':
          const stateId = parseInt(value);
          newState.state = statesData?.find(el => el.id === parseInt(value))?.state || '';
          newState.stateId = stateId;
          setStateId(stateId);
          break;

        case 'zip':
          newState.zip = value;
          break;

        case 'county':
          newState.county = value;
          break;
      }

      if (name !== 'currentAddress') {
        newState.currentAddress = `${newState.street ? `${newState.street}, ` : ''}${
          newState.city ? `${newState.city}` : ''
        }${newState.state ? `, ${newState.state}` : ''}${newState.zip ? `, ${newState.zip}` : ''}${
          newState.county ? `, ${newState.county}` : ''
        }`;
      }

      return newState;
    });
  };

  const handleCurrentAddress = (currentAddress: string) => {
    let newVal = {
      street: '',
      city: '',
      state: '',
      zip: '',
      county: '',
      stateId: '',
    };

    const addressArray = currentAddress.split(',');

    switch (addressArray.length) {
      case 1:
        newVal.street = addressArray[0].replace(',', '');
        break;

      case 2:
        newVal.street = addressArray[0].replace(',', '');
        newVal.city = addressArray[1].replace(',', '');
        break;

      case 3:
        newVal.street = addressArray[0].replace(',', '');
        newVal.city = addressArray[1].replace(',', '');
        newVal.state =
          statesData?.find(
            el =>
              el.state?.trim().toLowerCase() === addressArray[2].replace(',', '').trim().toLowerCase() ||
              el.state_code.toLowerCase() === addressArray[2].replace(',', '').trim().toLowerCase(),
          )?.state || '';
        newVal.stateId =
          statesData
            ?.find(
              el =>
                el.state?.trim().toLowerCase() === addressArray[2].replace(',', '').trim().toLowerCase() ||
                el.state_code.toLowerCase() === addressArray[2].replace(',', '').trim().toLowerCase(),
            )
            ?.id?.toString() || '';
        break;

      case 4:
        newVal.street = addressArray[0].replace(',', '');
        newVal.city = addressArray[1].replace(',', '');
        newVal.state =
          statesData?.find(
            el =>
              el.state?.trim().toLowerCase() === addressArray[2].replace(',', '').trim().toLowerCase() ||
              el.state_code.toLowerCase() === addressArray[2].replace(',', '').trim().toLowerCase(),
          )?.state || '';
        newVal.stateId =
          statesData
            ?.find(
              el =>
                el.state?.trim().toLowerCase() === addressArray[2].replace(',', '').trim().toLowerCase() ||
                el.state_code.toLowerCase() === addressArray[2].replace(',', '').trim().toLowerCase(),
            )
            ?.id?.toString() || '';
        newVal.zip = addressArray[3].replace(',', '');
        break;

      case 5:
        newVal.street = addressArray[0].replace(',', '');
        newVal.city = addressArray[1].replace(',', '');
        newVal.state =
          statesData?.find(
            el =>
              el.state?.trim().toLowerCase() === addressArray[2].replace(',', '').trim().toLowerCase() ||
              el.state_code.toLowerCase() === addressArray[2].replace(',', '').trim().toLowerCase(),
          )?.state || '';
        newVal.stateId =
          statesData
            ?.find(
              el =>
                el.state?.trim().toLowerCase() === addressArray[2].replace(',', '').trim().toLowerCase() ||
                el.state_code.toLowerCase() === addressArray[2].replace(',', '').trim().toLowerCase(),
            )
            ?.id?.toString() || '';
        newVal.zip = addressArray[3].replace(',', '');
        newVal.county = addressArray[4].replace(',', '');
        break;
    }

    return newVal;
  };

  useEffect(() => {
    if(inputsAddress.stateId && !stateId) {
      setStateId(inputsAddress.stateId);
    }
  }, [inputsAddress]);

  return (
    <div className="relative flex flex-col w-full" ref={ref}>
      <label
        htmlFor="currentAddress"
        className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
      >
        {label || 'Address'}
      </label>
      <aside className="flex flex-row">
        <input
          type="text"
          onChange={handleAddress}
          value={inputsAddress.currentAddress}
          name="currentAddress"
          autoComplete="off"
          id="currentAddress"
          placeholder="Street, City, State, ZIP, County"
          className="w-[92%] h-[5.277778vh] bg-[#F4F4F4] rounded-l-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw] outline-none"
        />
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            toggleOpen();
          }}
          className="w-[8%] h-[5.277778vh] bg-[#F4F4F4] flex justify-center items-center rounded-r-[0.520833vw]"
        >
          <ThreeGreenDots />
        </button>
      </aside>
      <AnimatePresence>
        {fieldErrors && fieldErrors.current_address && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute top-[100%] text-[1.666667vh] text-[#F00] bg-white px-2"
          >
            {fieldErrors && fieldErrors.current_address[0]}
          </motion.p>
        )}
      </AnimatePresence>
      {/* -------------- start modal address options -------------- */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            onClick={e => e.stopPropagation()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-[100%]/ bottom-[70%] mt-1 z-40 w-full min-w-[30rem] bg-[#FFF] rounded-[0.520833vw] border-[0.2vw] border-[#C9EBE6] max-lg:min-w-0"
          >
            <article className="flex flex-col gap-y-4 pb-3">
              {/* first row */}
              <section className="flex flex-row justify-center mt-[1vh]">
                <div className="relative flex flex-col w-[90%]">
                  <label
                    htmlFor="street"
                    className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                  >
                    Street
                  </label>
                  <input
                    type="text"
                    onChange={handleAddress}
                    value={inputsAddress.street}
                    name="street"
                    id="street"
                    className="w-full h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                  />
                  <AnimatePresence>
                    {fieldErrors && fieldErrors.street && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                      >
                        {fieldErrors && fieldErrors.street[0]}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </section>
              {/* second row */}
              <section className="flex flex-row justify-center mt-[1vh]">
                <div className="relative flex flex-col w-[90%]">
                  <label
                    htmlFor="city"
                    className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    onChange={handleAddress}
                    value={inputsAddress.city}
                    name="city"
                    id="city"
                    className="w-full h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                  />
                  <AnimatePresence>
                    {fieldErrors && fieldErrors.city && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                      >
                        {fieldErrors && fieldErrors.city[0]}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </section>
              {/* third row */}
              <section className="flex flex-row justify-around mt-[1vh] mb-[1vh] max-lg:flex-col max-lg:items-center max-lg:gap-3">
                <div className="relative flex flex-col w-[28%]">
                  <label
                    htmlFor="state"
                    className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                  >
                    State
                  </label>
                  <select
                    onChange={handleAddress}
                    value={stateId}
                    name="state"
                    id="state"
                    className="w-full h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                  >
                    <option value="" key="">
                      Select state
                    </option>
                    {statesData &&
                      statesData.map(el => (
                        <option key={el.id} value={el.id}>
                          {el.state}
                        </option>
                      ))}
                  </select>
                  <AnimatePresence>
                    {fieldErrors && fieldErrors.state && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                      >
                        {fieldErrors && fieldErrors.state[0]}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <div className="relative flex flex-col w-[28%]">
                  <label
                    htmlFor="zip"
                    className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                  >
                    ZIP
                  </label>
                  <input
                    type="text"
                    onChange={handleAddress}
                    value={inputsAddress.zip || ''}
                    name="zip"
                    id="zip"
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                    className="w-full h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                  />
                  <AnimatePresence>
                    {fieldErrors && fieldErrors.zip && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                      >
                        {fieldErrors && fieldErrors.zip[0]}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <div className="relative flex flex-col w-[28%]">
                  <label
                    htmlFor="county"
                    className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                  >
                    County
                  </label>
                  <input
                    type="text"
                    onChange={handleAddress}
                    value={inputsAddress.county || ''}
                    name="county"
                    id="county"
                    className="w-full h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                  />
                  <AnimatePresence>
                    {fieldErrors && fieldErrors.county && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                      >
                        {fieldErrors && fieldErrors.county[0]}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </section>
            </article>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddressInput;
