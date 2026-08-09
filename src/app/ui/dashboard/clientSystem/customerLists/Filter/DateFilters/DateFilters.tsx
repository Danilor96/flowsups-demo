import { Input } from '@/app/ui/inputs/Input';
import { IconedSelect } from '@/app/ui/select/iconedSelect/IconedSelect';
import { filter } from '@/store/customerList/types';

interface props {
  filters: filter;
  updateFilter: (filters: Partial<filter>) => void;
}

const DateFilters = ({ filters, updateFilter }: props) => {
  const { defaultText, previousUpcomingInputs } = filters.dateFilter;
  const handleClickTimeInterval = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name, value } = e.currentTarget;
    const { identity } = e.currentTarget.dataset;

    if (identity === 'createdDateFilter') {
      updateFilter({
        dateFilter: {
          ...filters.dateFilter,
          createdDate: value,
          defaultText: name,
        },
      });
    }

    if (identity === 'previousUpcoming') {
      updateFilter({
        dateFilter: {
          ...filters.dateFilter,
          previousUpcomingInputs: {
            optionSelectedValue: value,
            optionSelectedName: name,
          },
        },
      });
    }
  };

  const createdDateIputData = {
    id: 1,
    height: 5.55,
    width: 10,
    iconTextGap: 0.5,
    onClick: handleClickTimeInterval,
    options: [
      { value: '12', name: 'Between', identity: 'createdDateFilter' },
      { value: '1', name: 'All', identity: 'createdDateFilter' },
      { value: '2', name: 'Today', identity: 'createdDateFilter' },
      { value: '13', name: 'Yesterday', identity: 'createdDateFilter' },
      { value: '3', name: 'Tomorrow', identity: 'createdDateFilter' },
      { value: '4', name: 'Previous', identity: 'createdDateFilter' },
      { value: '5', name: 'Upcoming', identity: 'createdDateFilter' },
      { value: '6', name: 'Occurs in First Quarter', identity: 'createdDateFilter' },
      { value: '7', name: 'Occurs in Second Quarter', identity: 'createdDateFilter' },
      { value: '8', name: 'Occurs in Third Quarter', identity: 'createdDateFilter' },
      { value: '9', name: 'Occurs in Fourth Quarter', identity: 'createdDateFilter' },
      { value: '10', name: 'Last X Days', identity: 'createdDateFilter' },
      { value: '11', name: 'Last X Months', identity: 'createdDateFilter' },
    ],
    optionsBackgroundColor: '#92CEC3',
    optionsHeight: 5,
    optionsNameColor: '#FFF',
    optionsRadius: 0.3,
    optionsWidth: 10,
    defaultText: defaultText,
    backgroundColor: '#fff',
    // borderRadius: 1.01,
    borderRadius: 1.302083,
    textColor: '#00A78B',
    borderColor: '#00A78B',
    labelSameColor: true,
  };

  const createdDateAlterInputData = {
    label: '',
    name: 'createdDateAlterInput',
    value: filters.dateFilter.createdDateAlterInput,
    type: 'text',
    width: 4,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      updateFilter({
        dateFilter: {
          ...filters.dateFilter,
          createdDateAlterInput: Number(e.target.value) || 0,
        },
      });
    },
  };

  const previousUpcomingOptions = {
    defaultText: previousUpcomingInputs.optionSelectedName,
    option: [
      {
        value: '1',
        name: 'week',
        identity: 'previousUpcoming',
      },
      {
        value: '2',
        name: 'month',
        identity: 'previousUpcoming',
      },
      {
        value: '3',
        name: 'quarter',
        identity: 'previousUpcoming',
      },
      {
        value: '4',
        name: 'year',
        identity: 'previousUpcoming',
      },
    ],
  };

  const createdDateShowAlterTextInput = [
    'Last X Days',
    'Last X Months',
    'Next X Days',
    'Next X Months',
  ];
  const createdDateShowAlterSelectInput = ['Previous', 'Upcoming'];

  return (
    <div className="flex flex-col gap-[1.64vh]">
      <label className="text-[1.626852vh] font-medium leading-[2.440741vh] text-[rgb(0,167,139)]">
        Created Date
      </label>
      <div className="flex gap-3 justify-end">
        <IconedSelect
          height={createdDateIputData.height}
          iconTextGap={createdDateIputData.iconTextGap}
          onClick={createdDateIputData.onClick}
          options={createdDateIputData.options}
          optionsBackgroundColor={createdDateIputData.optionsBackgroundColor}
          optionsHeight={createdDateIputData.optionsHeight}
          optionsNameColor={createdDateIputData.optionsNameColor}
          optionsRadius={createdDateIputData.optionsRadius}
          defaultText={createdDateIputData.defaultText}
          optionsWidth={createdDateIputData.optionsWidth}
          width={createdDateIputData.width}
          backgroundColor={createdDateIputData.backgroundColor}
          borderRadius={createdDateIputData.borderRadius}
          textColor={createdDateIputData.defaultText === 'Created Date' ? '#9ca3af' : createdDateIputData.textColor }
          borderColor={createdDateIputData.borderColor}
          border={0.13}
          optionsTextAlignCenter
          optionsParagraphWidthFull
        />
        {createdDateShowAlterTextInput.some((el) =>
          el.includes(createdDateIputData.defaultText),
        ) && (
          <Input
            label={createdDateAlterInputData.label}
            name={createdDateAlterInputData.name}
            type={createdDateAlterInputData.type}
            value={createdDateAlterInputData.value?.toString()}
            width={createdDateAlterInputData.width}
            onChange={createdDateAlterInputData.onChange}
          />
        )}
        {createdDateIputData.defaultText === 'Between' && (
          <div className="flex gap-1 items-center">
            <div className="relative">
              <label className="text-[0.7rem] absolute left-[0.2rem] top-[-1rem] text-gray-500">
                From
              </label>
              <Input
                label={''}
                name={'from'}
                onChange={(e) => {
                  if (!e.target.value) return;
                  updateFilter({
                    dateFilter: {
                      ...filters.dateFilter,
                      fromDate: new Date(e.target.value),
                      createdDate: '12',
                    },
                  });
                }}
                type={'date'}
                value={
                  filters.dateFilter.fromDate
                    ? filters.dateFilter.fromDate.toISOString().split('T')[0]
                    : ''
                }
                width={8}
                placeholder={'From'}
              />
            </div>
            <div className="relative">
              <label className="text-[0.7rem] absolute left-[0.2rem] top-[-1rem] text-gray-500">
                To
              </label>
              <Input
                onChange={(e) => {
                  if (!e.target.value) return;
                  updateFilter({
                    dateFilter: {
                      ...filters.dateFilter,
                      toDate: new Date(e.target.value),
                      createdDate: '12',
                    },
                  });
                }}
                label={''}
                name={'to'}
                type={'date'}
                value={
                  filters.dateFilter.toDate
                    ? filters.dateFilter.toDate.toISOString().split('T')[0]
                    : ''
                }
                width={8}
                placeholder={'To'}
              />
            </div>
          </div>
        )}
        {createdDateShowAlterSelectInput.some((el) =>
          el.includes(createdDateIputData.defaultText),
        ) && (
          <IconedSelect
            height={5}
            iconTextGap={0.5}
            width={8}
            options={previousUpcomingOptions.option.map((el) => {
              return { value: el.value, name: el.name, identity: el.identity };
            })}
            defaultText={previousUpcomingOptions.defaultText}
            optionsBackgroundColor="#92CEC3"
            optionsHeight={5}
            borderRadius={1.01}
            backgroundColor="#92CEC3"
            optionsNameColor="#FFF"
            textColor="#FFF"
            optionsRadius={0.3}
            optionsWidth={8}
            onClick={createdDateIputData.onClick}
          />
        )}
      </div>
    </div>
  );
};

export default DateFilters;
