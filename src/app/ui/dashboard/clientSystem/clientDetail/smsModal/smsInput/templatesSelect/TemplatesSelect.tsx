import { AdderSelect } from '&/select/adderSelect/AdderSelect';
import { adminDashboardStore } from '@/store/adminDashboard';

export function TemplatesSelect({
  handleChangeSmsTemplate,
  handleBlurSmsTemplate,
  handleClickSmsTemplate,
  smsTemplateValue,
  width,
  label,
  optionsBottom,
  optionsTop,
  optionsZIndex,
  border,
  optionsHeight,
  optionsContainerHeight,
}: {
  smsTemplateValue: string;
  handleChangeSmsTemplate: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClickSmsTemplate: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleBlurSmsTemplate: (event: React.FocusEvent<HTMLInputElement>) => void;
  width?: number;
  label?: string;
  optionsBottom?: number;
  optionsTop?: number;
  border?: boolean;
  optionsZIndex?: number;
  optionsHeight?: number;
  optionsContainerHeight?: number;
}) {
  // ----- global states -----

  const { smsTemplates } = adminDashboardStore();

  // ----- local states -----

  return (
    <AdderSelect
      iconTextGap={0}
      label={label ? label : ''}
      defaultText='Templates'
      name="smsTemplates"
      onChange={handleChangeSmsTemplate}
      onClick={handleClickSmsTemplate}
      // onBlur={handleBlurSmsTemplate}
      optionsBackgroundColor="#FFF"
      optionsHeight={optionsHeight ? optionsHeight : 5}
      optionsHeightFit               
      optionsNameColor="#00A78B"
      optionsRadius={0.5}
      optionsWidth={width ? (width >= 100 ? 15 : width) : 15}
      textAlign='left'
      value={smsTemplateValue}
      border={border ? 0.05 : undefined}
      borderColor="#00A78B"
      width={width ? (width >= 100 ? 9 : width) : 9}
      optionsBottom={optionsTop ? undefined : optionsBottom ? optionsBottom : 5.5}
      height={5.092593}
      flex
      optionsTop={optionsTop}
      optionsZIndex={optionsZIndex}
      optionsContainerHeight={optionsContainerHeight ? optionsContainerHeight : 20}
      widthFull={width ? (width >= 100 ? true : false) : false}
      flexColReverse
      options={smsTemplates?.map((el) => {
        return { value: el.template, name: el.name, identity: 'template' };
      })}
    />
  );
}