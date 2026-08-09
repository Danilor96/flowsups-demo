import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { Input } from '&/inputs/Input';
import { IconedSelect } from '&/select/iconedSelect/IconedSelect';
import { BetweenFilter } from '&/dashboard/reports/storeReport/callActivity/filters/betweenFilter/BetweenFilter';
import { Button } from '@/app/ui/buttons/Button';

interface DateOptions {
  value: string;
  name: string;
  identity: 'createdDateFilter' | 'dueDateFilter';
}

export const dateOptions: DateOptions[] = [
  { value: '1', name: 'All', identity: 'createdDateFilter' },
  { value: '2', name: 'Today', identity: 'createdDateFilter' },
  { value: '3', name: 'Tomorrow', identity: 'createdDateFilter' },
  { value: '12', name: 'Yesterday', identity: 'createdDateFilter' },
  { value: '13', name: 'Between', identity: 'createdDateFilter' },
  { value: '4', name: 'Previous', identity: 'createdDateFilter' },
  { value: '5', name: 'Upcoming', identity: 'createdDateFilter' },
  { value: '6', name: 'Occurs in First Quarter', identity: 'createdDateFilter' },
  { value: '7', name: 'Occurs in Second Quarter', identity: 'createdDateFilter' },
  { value: '8', name: 'Occurs in Third Quarter', identity: 'createdDateFilter' },
  { value: '9', name: 'Occurs in Fourth Quarter', identity: 'createdDateFilter' },
  { value: '10', name: 'Last X Days', identity: 'createdDateFilter' },
  { value: '11', name: 'Last X Months', identity: 'createdDateFilter' },
];

type IconedSelectOption = {
  value?: string;
  icon?: React.ReactNode;
  name?: string;
  identity?: string;
};

type FilterFieldBase = {
  id: number;
  type?: 'input' | 'iconedSelect' | 'betweenFilter';
  label: string;
};

export type InputFieldConfig = FilterFieldBase & {
  type?: 'input';
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  label: string;
  width: number;
  inputType: string;
  height?: number;
  regularInput?: boolean;
};

export type IconedSelectConfig = FilterFieldBase & {
  type?: 'iconedSelect';
  options: IconedSelectOption[];
  defaultText: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  width: number;
  height: number;
  labelBottom?: number;
  label?: string;
  optionsWidth: number;
  optionsHeight: number;
  optionsContainerHeight?: number;
};

export type BetweenFilterConfig = FilterFieldBase & {
  type?: 'betweenFilter';
  betweenFrom: string;
  betweenTo: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDayPickFrom: (e: Date, index?: number) => void;
  onDayPickTo: (e: Date, index?: number) => void;
};

export type FilterConfig = InputFieldConfig | IconedSelectConfig | BetweenFilterConfig;

export function DynamicFilterGroup({ config, cols, resetFilters }: { config: FilterConfig[]; cols: number, resetFilters: () => void }) {
  // ----- global states -----

  // ----- local states -----

  return (
    <ContentRow cols={cols} gap={1.2}>
      {config.map((field) => {
        switch (field?.type) {
          case 'input':
            return (
              <Input
                key={`input---regular${field.id},,,,,`}
                label={field.label}
                name={field.name}
                onChange={field.onChange}
                type={field.inputType}
                width={field.width}
                height={field.height}
                value={field.value}
                labelFontSize={2}
                backgroundColor={field.regularInput ? undefined : '#FFF'}
                border={field.regularInput ? undefined : 0.02}
                borderColor={field.regularInput ? undefined : '#00a78b'}
                borderRadius={field.regularInput ? undefined : 1.5}
                labelColor={field.regularInput ? undefined : '#00a78b'}
                textAlterColor={field.regularInput ? undefined : '#00a78b'}
                fontSize={2}
                labelBottom={0.1}
                labelSameColor
              />
            );

          case 'iconedSelect':
            return (
              <IconedSelect
                key={`select.....iconed${field.id}dddddd`}
                label={field.label}
                options={field.options}
                defaultText={field.defaultText}
                onClick={field.onClick}
                width={field.width}
                height={field.height}
                borderRadius={1.5}
                border={0.02}
                borderColor="#00a78b"
                backgroundColor="#FFF"
                textColor="#00a78b"
                optionsWidth={field.optionsWidth}
                optionsHeight={field.optionsHeight}
                optionsBackgroundColor="#FFF"
                optionsNameColor="#00a78b"
                iconTextGap={0.5}
                optionsRadius={0.5}
                optionsTextAlignCenter
                optionsParagraphWidthFull
                optionsContainerHeight={field.optionsContainerHeight}
                fontSize={2}
                labelBottom={field.labelBottom}
              />
            );

          case 'betweenFilter':
            return (
              <BetweenFilter
                key={`betweenññññññfilter${field.id}rrrrr`}
                betweenFrom={field.betweenFrom}
                betweenTo={field.betweenTo}
                onChange={field.onChange}
                onDayPickFrom={field.onDayPickFrom}
                onDayPickTo={field.onDayPickTo}
              />
            );

          default:
            return null;
        }
      })}
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
                  resetFilters && resetFilters();
                }}
              />
            </div>
    </ContentRow>
  );
}
