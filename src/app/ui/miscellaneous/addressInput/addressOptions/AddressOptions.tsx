import { Input } from '&/inputs/Input';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { adminDashboardStore } from '@/store/adminDashboard';
import { motion } from 'framer-motion';

export function AddressOptions({
  addressOptions,
  manualStates,
}: {
  addressOptions: {
    street: string;
    streetName: string;
    city: string;
    cityName: string;
    state: string;
    stateName: string;
    zip: string;
    zipName: string;
    county: string;
    countyName: string;
    handleChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
      index?: number,
    ) => void;
  };
  manualStates?:
    | {
        id: number;
        state: string;
      }[];
}) {
  // ----- global states -----

  const { statesData } = adminDashboardStore();

  // ----- local states -----

  const handleAvailableStates = () => {
    if (manualStates) return manualStates;

    return statesData;
  };

  const inputDataOne = [
    {
      id: 1,
      label: 'Street',
      name: addressOptions.streetName,
      value: addressOptions.street,
      type: 'text',
      width: 0,
      onChange: addressOptions.handleChange,
    },
    {
      id: 2,
      label: 'City',
      name: addressOptions.cityName,
      value: addressOptions.city,
      type: 'text',
      width: 0,
      onChange: addressOptions.handleChange,
    },
  ];

  const inputDataTwo = [
    {
      id: 3,
      label: 'State',
      name: addressOptions.stateName,
      value: addressOptions.state,
      type: 'select',
      width: 0,
      options: handleAvailableStates()?.map((el) => {
        return { value: el.id, option: el.state };
      }),
      onChange: addressOptions.handleChange,
    },
    {
      id: 4,
      label: 'ZIP',
      name: addressOptions.zipName,
      value: addressOptions.zip,
      type: 'text',
      width: 0,
      onChange: addressOptions.handleChange,
    },
    {
      id: 5,
      label: 'County',
      name: addressOptions.countyName,
      value: addressOptions.county,
      type: 'text',
      width: 0,
      onChange: addressOptions.handleChange,
    },
  ];

  return (
    <motion.aside
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute top-[11.5vh] z-50 w-full px-[1vw] py-[1vh] bg-[#FFF] rounded-[0.520833vw] border-[0.2vw] border-[#C9EBE6]"
    >
      <ContentRow cols={1} gap={1} widthFull>
        {inputDataOne.map((el, index) => (
          <Input
            key={`${el.id * 86}__==2@${index * index}`}
            label={el.label}
            name={el.name}
            width={el.width}
            value={el.value}
            type={el.type}
            onChange={el.onChange}
          />
        ))}
      </ContentRow>
      <ContentRow cols={3} gap={1.5} marginTop={1} widthFull>
        {inputDataTwo.map((el, index) => (
          <Input
            key={`${el.id * 86}__==2@${index * index}`}
            label={el.label}
            name={el.name}
            width={el.width}
            value={el.value}
            type={el.type}
            onChange={el.onChange}
            options={el.options}
          />
        ))}
      </ContentRow>
    </motion.aside>
  );
}
