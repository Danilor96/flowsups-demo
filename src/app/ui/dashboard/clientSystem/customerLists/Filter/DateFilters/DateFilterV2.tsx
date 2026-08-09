import { Input } from '@/app/ui/inputs/Input';
import { IconedSelect } from '@/app/ui/select/iconedSelect/IconedSelect';
import { Datefilter } from '@/store/customerList/types';

export type availablePropOptions =
  | 'Between'
  | 'All'
  | 'Today'
  | 'Yesterday'
  | 'Tomorrow'
  | 'Previous'
  | 'Upcoming'
  | 'Occurs in First Quarter'
  | 'Occurs in Second Quarter'
  | 'Occurs in Third Quarter'
  | 'Occurs in Fourth Quarter'
  | 'Last X Days'
  | 'Last X Months';

interface props {
  labelText: string;
  updateFilter: (dateFilter: Partial<Datefilter>) => void;
  dateFilters: Datefilter;
  width?: number;
  height?: number;
  disabledOptions?: availablePropOptions[];
}

const DateFiltersV2 = ({
  updateFilter,
  dateFilters,
  labelText,
  height,
  width,
  disabledOptions,
}: props) => {
  const { defaultText, previousUpcomingInputs } = dateFilters;
  const handleClickTimeInterval = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name, value } = e.currentTarget;
    const { identity } = e.currentTarget.dataset;

    if (identity === 'createdDateFilter') {
      const nullishFromAndTo = value != '13' ? null : undefined;

      const alterOpt = ['10', '11'];
      const nullishAlterInput = !alterOpt.includes(value) ? 0 : undefined;
      const upcomingPrevOpt = ['4', '5'];
      const nullishPrevUpcoming = { optionSelectedValue: '', optionSelectedName: 'Select' };

      updateFilter({
        createdDate: value,
        defaultText: name,
        fromDate: nullishFromAndTo,
        toDate: nullishFromAndTo,
        createdDateAlterInput: nullishAlterInput,
        previousUpcomingInputs: nullishPrevUpcoming,
      });
    }

    if (identity === 'previousUpcoming') {
      updateFilter({
        previousUpcomingInputs: {
          optionSelectedValue: value,
          optionSelectedName: name,
        },
      });
    }
  };

  const createdDateIputData = {
    id: 1,
    height: height ? height : 6,
    width: width ? width : 12,
    iconTextGap: 0.5,
    onClick: handleClickTimeInterval,
    options: [
      { value: '13', name: 'Between', identity: 'createdDateFilter' },
      { value: '1', name: 'All', identity: 'createdDateFilter' },
      { value: '2', name: 'Today', identity: 'createdDateFilter' },
      { value: '12', name: 'Yesterday', identity: 'createdDateFilter' },
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
    optionsBackgroundColor: '#FFF',
    optionsHeight: 6,
    optionsNameColor: '#00a78b',
    optionsRadius: 0.5,
    optionsWidth: 12,
    defaultText: defaultText,
    backgroundColor: '#fff',
    // borderRadius: 1.01,
    borderRadius: 1.5,
    textColor: '#00A78B',
    optionsContainerHeight: 60,
    borderColor: '#00A78B',
    border: 0.02,
    labelSameColor: true,
  };

  const createdDateAlterInputData = {
    label: '',
    name: 'createdDateAlterInput',
    value: dateFilters.createdDateAlterInput,
    type: 'text',
    width: 4,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = Number(e.target.value);

      if (isNaN(value)) return;

      updateFilter({
        createdDateAlterInput: value,
      });
    },
  };

  const previousUpcomingOptions = {
    defaultText: previousUpcomingInputs?.optionSelectedName,
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

  const createdDateShowAlterTextInput = ['Last X Days', 'Last X Months'];
  const createdDateShowAlterSelectInput = ['Previous', 'Upcoming'];

  return (
    <div className="flex flex-col gap-[1.64vh]">
      <label className="text-[1.626852vh] font-medium leading-[2.440741vh] text-[rgb(0,167,139)]">
        {labelText}
      </label>
      <div className="flex gap-3">
        <IconedSelect
          height={createdDateIputData.height}
          iconTextGap={createdDateIputData.iconTextGap}
          onClick={createdDateIputData.onClick}
          options={createdDateIputData.options.filter((option) => {
            if (disabledOptions && disabledOptions.length > 0) {
              return !disabledOptions.includes(option.name as availablePropOptions);
            }

            return option;
          })}
          optionsBackgroundColor={createdDateIputData.optionsBackgroundColor}
          optionsHeight={createdDateIputData.optionsHeight}
          optionsNameColor={createdDateIputData.optionsNameColor}
          optionsRadius={createdDateIputData.optionsRadius}
          defaultText={createdDateIputData.defaultText}
          optionsWidth={createdDateIputData.optionsWidth}
          width={createdDateIputData.width}
          backgroundColor={createdDateIputData.backgroundColor}
          borderRadius={createdDateIputData.borderRadius}
          textColor={
            createdDateIputData.defaultText === 'Created Date' ||
            createdDateIputData.defaultText === 'Days in' ||
            createdDateIputData.defaultText === 'Lost Date' ||
            createdDateIputData.defaultText === 'Sold Date' ||
            createdDateIputData.defaultText === 'Last Contacted Date' ||
            createdDateIputData.defaultText === 'Visit Date' ||
            createdDateIputData.defaultText === 'Delivery time' ||
            createdDateIputData.defaultText === 'Last Activity' ||
            createdDateIputData.defaultText === 'Deposit Date'
              ? '#9ca3af'
              : createdDateIputData.textColor
          }
          borderColor={createdDateIputData.borderColor}
          border={0.13}
          optionsTextAlignCenter
          optionsParagraphWidthFull
          fontSize={2}
          optionsContainerHeight={createdDateIputData.optionsContainerHeight}
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
                    fromDate: new Date(e.target.value),
                  });
                }}
                type={'date'}
                value={dateFilters.fromDate ? dateFilters.fromDate.toISOString().split('T')[0] : ''}
                width={8}
                placeholder={'From'}
              />
            </div>
            <div className="relative">
              <label className="text-[0.7rem] absolute left-[0.2rem] top-[-1rem] text-gray-500">
                To
              </label>
              <Input
                label={''}
                name={'to'}
                onChange={(e) => {
                  if (!e.target.value) return;
                  updateFilter({
                    toDate: new Date(e.target.value),
                    createdDate: '13',
                  });
                }}
                type={'date'}
                value={dateFilters.toDate ? dateFilters.toDate.toISOString().split('T')[0] : ''}
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

export default DateFiltersV2;
