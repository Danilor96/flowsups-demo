import { ButtonContainer } from '&/buttons/ButtonContainer';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { IconedSelect } from '&/select/iconedSelect/IconedSelect';
import { Button } from '&/buttons/Button';
import { Input } from '&/inputs/Input';
import { StatusFilter } from './statusFilter/StatusFilter';
import { BetweenFilter } from './betweenFilter/BetweenFilter';
import { SearchInput } from './searchInput/SearchInput';
import { Can } from '@/app/ui/auth/Can';

export function TaskFilters({
  buttonData,
  createdDate,
  createdDateAlterInput,
  previousUpcomingOptions,
}: {
  buttonData: {
    id: number;
    identity: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    backgroundColor: string;
    textColor: string;
    border: number;
    borderColor: string;
    borderRadius: number;
    buttonText: string;
    width: number;
    can: number;
  }[];
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
  createdDateAlterInput: {
    label: string;
    name: string;
    value: string;
    type: string;
    width: number;
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  };
  previousUpcomingOptions: {
    defaultText: string;
    option: { value: string; name: string; identity: string }[];
  };
}) {
  // ----- global states -----

  // ----- local states -----

  const createdDateShowAlterTextInput = ['Last X Days', 'Last X Months'];
  const createdDateShowAlterSelectInput = ['Previous', 'Upcoming'];
  const createdDateShowAlterBetweenInputs = ['Between'];

  return (
    <ButtonContainer marginTop={0} widthFull justify="space-between" marginBottom={3}>
      <ContentRow cols={2} gap={2}>
        <SearchInput />
        <StatusFilter />
      </ContentRow>
      <ContentRow cols={5} gap={2}>
        {buttonData.map((el) => (
          <Can key={el.id} requiredPermission={el.can}>
            <Button
              identity={el.identity}
              backgroundColor={el.backgroundColor}
              textColor={el.textColor}
              border={el.border}
              borderColor={el.borderColor}
              borderRadius={el.borderRadius}
              buttonText={el.buttonText}
              width={el.width}
              onClick={el.onClick}
            />
          </Can>
        ))}
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
          optionsContainerHeight={60}
          optionsTextAlignCenter
          optionsParagraphWidthFull
        />
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
        {createdDateShowAlterBetweenInputs.includes(createdDate.defaultText) && <BetweenFilter />}
        <Button
          identity="reset"
          backgroundColor="#FFF"
          textColor="#00A78B"
          border={0.03}
          borderColor="#FFF"
          borderRadius={1.01}
          buttonText="Reset"
          width={3.5}
          onClick={createdDate.onClick}
        />
      </ContentRow>
    </ButtonContainer>
  );
}
