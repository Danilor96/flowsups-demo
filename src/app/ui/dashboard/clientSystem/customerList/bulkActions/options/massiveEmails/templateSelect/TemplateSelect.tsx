import { AdderSelect } from '&/select/adderSelect/AdderSelect';
import { emailTemplateStore } from '@/store/emailTemplate';

export function TemplateSelect({
  emailTemplateValue,
  handleChangeEmailTemplate,
  handleClickEmailTemplate,
  handleBlurEmailTemplate,
}: {
  emailTemplateValue: string;
  handleChangeEmailTemplate: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClickEmailTemplate: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleBlurEmailTemplate?: (e: React.FocusEvent<HTMLInputElement>) => void;
}) {
  // ----- global states -----

  const { emailTemplates } = emailTemplateStore();

  // ----- local states -----

  return (
    <AdderSelect
      iconTextGap={0}
      label="Templates"
      name="emailTemplates"
      onChange={handleChangeEmailTemplate}
      onClick={handleClickEmailTemplate}
      onBlur={handleBlurEmailTemplate}
      optionsBackgroundColor="#FFF"
      optionsHeight={5}
      optionsNameColor="#00A78B"
      optionsRadius={0.5}
      optionsWidth={14}
      value={emailTemplateValue}
      width={14}
      optionsContainerHeight={20}
      optionsBottom={5.5}
      height={5.462963}
      flex
      flexColReverse
      options={emailTemplates?.map((el) => {
        return { value: el.body, name: el.name, identity: el.id.toString() };
      })}
    />
  );
}
