import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Input } from '&/inputs/Input';
import { Button } from '&/buttons/Button';
import { adminDashboardStore } from '@/store/adminDashboard';
import { IconedSelect } from '@/app/ui/select/iconedSelect/IconedSelect';

export function Filter({
  customerName,
  createdDate,
  leadSource,
  leadType,
  customerStatus,
  assignedTo,
  previousUpcomingOptions,
  createdDateAlterInput,
  onChange,
  onClear,
}: {
  customerName: string;
  leadSource: string;
  leadType: string;
  customerStatus: string;
  assignedTo: string;
  createdDate: {
    height: number;
    iconTextGap: number;
    options?: { value: string; name: string }[];
    optionsBackgroundColor: string;
    optionsHeight: number;
    optionsNameColor: string;
    optionsRadius: number;
    optionsWidth: number;
    width: number;
    defaultText: string;
    backgroundColor: string;
    borderRadius: number;
    textColor: string;
    borderColor: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  };
  previousUpcomingOptions: {
    defaultText: string;
    option: {
      value: string;
      name: string;
      identity: string;
    }[];
  };
  createdDateAlterInput: {
    label: string;
    name: string;
    value: string;
    type: string;
    width: number;
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  };
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onClear: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  // ----- global states -----

  const { leadSourcesData, leadTypesData, clientStatusesData } = adminDashboardStore();

  // ----- local states -----

  const inputsData = [
    {
      key: 1,
      label: 'Customer Name',
      name: 'customerName',
      value: customerName,
      type: 'text',
      width: 13,
      backgroundColor: '#FFF',
      border: 0.104166,
      borderColor: '#00A78B',
      placeholder: 'Search',
      borderRadius: 1.302083,
      textAlterColor: '#00A78B',
      labelSameColor: true,
    },
    // {
    //   key: 2,
    //   label: 'Created Date',
    //   name: 'createdDate',
    //   value: createdDate,
    //   type: 'date',
    //   width: 9.114583,
    //   backgroundColor: '#FFF',
    //   border: 0.104166,
    //   borderColor: '#00A78B',
    //   borderRadius: 1.302083,
    //   textAlterColor: '#00A78B',
    //   labelSameColor: true,
    // },
    {
      key: 3,
      label: 'Lead Source',
      name: 'leadSource',
      value: leadSource,
      type: 'select',
      width: 10,
      backgroundColor: '#FFF',
      border: 0.104166,
      borderColor: '#00A78B',
      borderRadius: 1.302083,
      textAlterColor: '#00A78B',
      labelSameColor: true,
      options: leadSourcesData.map((el) => {
        return { value: el.id, option: el.source };
      }),
    },
    {
      key: 4,
      label: 'Lead Type',
      name: 'leadType',
      value: leadType,
      type: 'select',
      width: 10,
      backgroundColor: '#FFF',
      border: 0.104166,
      borderColor: '#00A78B',
      borderRadius: 1.302083,
      textAlterColor: '#00A78B',
      labelSameColor: true,
      options: leadTypesData.map((el) => {
        return { value: el.id, option: el.type };
      }),
    },
    {
      key: 5,
      label: 'Customer Status',
      name: 'customerStatus',
      value: customerStatus,
      type: 'select',
      width: 10,
      backgroundColor: '#FFF',
      border: 0.104166,
      borderColor: '#00A78B',
      borderRadius: 1.302083,
      textAlterColor: '#00A78B',
      labelSameColor: true,
      options: clientStatusesData?.map((el) => {
        return { value: el.id, option: el.status };
      }),
    },
    {
      key: 6,
      label: 'Assigned To',
      name: 'assignedTo',
      value: assignedTo,
      type: 'text',
      width: 9.114583,
      placeholder: 'Search',
      backgroundColor: '#FFF',
      border: 0.104166,
      borderColor: '#00A78B',
      borderRadius: 1.302083,
      textAlterColor: '#00A78B',
      labelSameColor: true,
    },
  ];

  const createdDateShowAlterTextInput = ['Last X Days', 'Last X Months'];
  const createdDateShowAlterSelectInput = ['Previous', 'Upcoming'];

  return (
    <ButtonContainer marginTop={0} gap={1} alignContentEnd>
      {inputsData.map((el, index) => (
        <Input
          key={`${el.key}--${index}`}
          label={el.label}
          name={el.name}
          type={el.type}
          value={el.value}
          width={el.width}
          backgroundColor={el.backgroundColor}
          border={el.border}
          borderColor={el.borderColor}
          placeholder={el.placeholder}
          borderRadius={el.borderRadius}
          textAlterColor={el.textAlterColor}
          labelSameColor={el.labelSameColor}
          options={el.options}
          onChange={onChange}
        />
      ))}
      {createdDateShowAlterTextInput.some((el) => el.includes(createdDate.defaultText)) && (
        <Input
          label={createdDateAlterInput.label}
          name={createdDateAlterInput.name}
          type={createdDateAlterInput.type}
          value={createdDateAlterInput.value}
          width={createdDateAlterInput.width}
          onChange={createdDateAlterInput.onChange}
        />
      )}
      {createdDateShowAlterSelectInput.some((el) => el.includes(createdDate.defaultText)) && (
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
          borderColor="#FFF"
          optionsRadius={0.3}
          optionsWidth={8}
          onClick={createdDate.onClick}
        />
      )}
      <IconedSelect
        height={createdDate.height}
        iconTextGap={createdDate.iconTextGap}
        onClick={createdDate.onClick}
        options={createdDate.options}
        optionsBackgroundColor={createdDate.optionsBackgroundColor}
        optionsHeight={createdDate.optionsHeight}
        optionsNameColor={createdDate.optionsNameColor}
        optionsRadius={createdDate.optionsRadius}
        defaultText={createdDate.defaultText}
        optionsWidth={createdDate.optionsWidth}
        width={createdDate.width}
        backgroundColor={createdDate.backgroundColor}
        borderRadius={createdDate.borderRadius}
        textColor={createdDate.textColor}
        borderColor={createdDate.borderColor}
        optionsTextAlignCenter
        optionsParagraphWidthFull
      />
      <Button
        backgroundColor="#FFF"
        identity="clear"
        textColor="#00A78B"
        buttonText="Clear Filter"
        border={0.104166}
        borderColor="#00A78B"
        borderRadius={1.302083}
        fontWeight={500}
        width={9.114583}
        buttonTextSize={2}
        heightFitContent
        onClick={onClear}
      />
    </ButtonContainer>
  );
}
