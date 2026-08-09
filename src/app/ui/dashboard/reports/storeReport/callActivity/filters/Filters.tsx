import { Input } from '&/inputs/Input';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { IconedSelect } from '&/select/iconedSelect/IconedSelect';
import { dateOptions } from '@/app/ui/miscellaneous/filterGroup/FilterGroup';
import { BetweenFilter } from './betweenFilter/BetweenFilter';
import { Button } from '@/app/ui/buttons/Button';

export function Filters({
  createdDateAlterInput,
  defaultCreatedDateText,
  onChange,
  onClick,
  previousUpcomingOptions,
  betweenFrom,
  betweenTo,
  onDayPickFrom,
  onDayPickTo,
  salesRep,
  onInputChange,
  onPreviousUpcomingPick,
  resetFilters,
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onInputChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  defaultCreatedDateText: string;
  createdDateAlterInput: string;
  previousUpcomingOptions: string;
  betweenFrom: string;
  betweenTo: string;
  salesRep?: string;
  onDayPickFrom: (e: Date, index?: number) => void;
  onDayPickTo: (e: Date, index?: number) => void;
  onPreviousUpcomingPick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  resetFilters: () => void;
}) {
  // ----- global states -----

  // ----- local states -----

  const createdDateShowAlterTextInput = ['Last X Days', 'Last X Months'];
  const createdDateShowAlterSelectInput = ['Previous', 'Upcoming'];
  const createdDateShowAlterBetweenInputs = ['Between'];

  const createdDateFilterData = {
    id: 1,
    height: 6,
    width: 12,
    iconTextGap: 0.5,
    onClick: onClick,
    options: dateOptions,
    optionsBackgroundColor: '#FFF',
    optionsHeight: 6,
    optionsNameColor: '#00a78b',
    optionsRadius: 0.5,
    optionsWidth: 12,
    defaultText: defaultCreatedDateText,
    backgroundColor: '#FFF',
    borderRadius: 1.5,
    textColor: '#00a78b',
    borderColor: '#00a78b',
    border: 0.02,
  };

  const createdDateAlterInputData = {
    label: '',
    name: 'createdDateAlterInput',
    value: createdDateAlterInput,
    type: 'text',
    width: 8,
    onChange: onChange,
  };

  const previousUpcomingSelectData = {
    defaultText: previousUpcomingOptions,
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

  return (
    <ContentRow cols={5} gap={1.2}>
      <IconedSelect
        height={createdDateFilterData.height}
        iconTextGap={createdDateFilterData.iconTextGap}
        onClick={createdDateFilterData.onClick}
        options={createdDateFilterData.options}
        optionsBackgroundColor={createdDateFilterData.optionsBackgroundColor}
        optionsHeight={createdDateFilterData.optionsHeight}
        optionsNameColor={createdDateFilterData.optionsNameColor}
        optionsRadius={createdDateFilterData.optionsRadius}
        defaultText={createdDateFilterData.defaultText}
        optionsWidth={createdDateFilterData.optionsWidth}
        width={createdDateFilterData.width}
        backgroundColor={createdDateFilterData.backgroundColor}
        borderRadius={createdDateFilterData.borderRadius}
        textColor={createdDateFilterData.textColor}
        borderColor={createdDateFilterData.borderColor}
        border={createdDateFilterData.border}
        optionsContainerHeight={60}
        optionsTextAlignCenter
        optionsParagraphWidthFull
        fontSize={2}
        labelBottom={1.666667}
        label="Date"
      />
      {createdDateShowAlterTextInput.some(el => el.includes(createdDateFilterData.defaultText)) && (
        <Input
          label={createdDateAlterInputData.label}
          name={createdDateAlterInputData.name}
          type={createdDateAlterInputData.type}
          value={createdDateAlterInputData.value}
          width={createdDateAlterInputData.width}
          onChange={createdDateAlterInputData.onChange}
        />
      )}
      {createdDateShowAlterSelectInput.some(el => el.includes(createdDateFilterData.defaultText)) && (
        <IconedSelect
          height={5}
          iconTextGap={0.5}
          width={8}
          options={previousUpcomingSelectData.option.map(el => {
            return { value: el.value, name: el.name, identity: el.identity };
          })}
          defaultText={previousUpcomingSelectData.defaultText}
          optionsBackgroundColor="#92CEC3"
          optionsHeight={5}
          borderRadius={1.01}
          backgroundColor="#92CEC3"
          optionsNameColor="#FFF"
          textColor="#FFF"
          borderColor="#FFF"
          optionsRadius={0.3}
          optionsWidth={8}
          onClick={onPreviousUpcomingPick}
        />
      )}
      {createdDateShowAlterBetweenInputs.includes(createdDateFilterData.defaultText) && (
        <BetweenFilter
          betweenFrom={betweenFrom}
          betweenTo={betweenTo}
          onChange={onChange}
          onDayPickFrom={onDayPickFrom}
          onDayPickTo={onDayPickTo}
        />
      )}
      {onInputChange && (
        <Input
          label="Sales Rep"
          name="salesRep"
          onChange={onInputChange}
          type="text"
          width={12}
          value={salesRep}
          backgroundColor="#FFF"
          border={0.02}
          borderColor="#00a78b"
          borderRadius={1.5}
          labelSameColor
          height={6}
          labelFontSize={2}
          labelColor="#00a78b"
          textAlterColor="#00a78b"
          fontSize={2}
          labelBottom={0.1}
        />
      )}
      <div className="flex items-end h-full self-end bg-gray-300/">
        <Button
          backgroundColor="#00A78B"
          identity="clear"
          textColor="#FFF"
          buttonText="Reset"
          border={0.104166}
          borderColor="#00A78B"
          borderRadius={1.302083}
          fontWeight={400}
          buttonTextSize={2}
          width={5}
          height={6}
          onClick={() => {
            resetFilters();
          }}
        />
      </div>
    </ContentRow>
  );
}
