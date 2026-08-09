import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { HorizontalLine } from '&/miscellaneous/separators/HorizontalLine';
import { CustomCheckbox } from '&/inputs/customCheckbox/CustomCheckbox';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { motion } from 'framer-motion';

export function InteractionTypeFilter({
  onChange,
  onClick,
  checkboxes1,
  checkboxes2,
}: {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checkboxes1: {
    key: number;
    identity: string;
    text: string;
    checked: boolean;
    icon: React.ReactNode;
    iconBorder?: boolean;
    total?: string;
    fontSize?: number;
  }[];
  checkboxes2: {
    key: number;
    identity: string;
    text: string;
    checked: boolean;
    icon: React.ReactNode;
    iconBorder?: boolean;
    total?: string;
    fontSize?: number;
  }[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute top-[8vh] w-[18.28125vw] h-fit px-[1.432292vw] py-[1.527778vh] flex flex-col bg-[#FFF] rounded-[0.520833vw] shadow-crmFormShadow"
      style={{
        zIndex: 50,
      }}
    >
      <ButtonContainer marginTop={0} widthFull justify="space-between">
        <Paragraph fontSize={2.5} color="#00A78B">
          Filter
        </Paragraph>
        <Button
          buttonTextSize={2.5}
          height={3.5}
          width={4}
          backgroundColor="#C9EBE6"
          identity="resetFilter"
          onClick={onClick}
          textColor="#00A78B"
          buttonText="Reset"
          borderRadius={0.2}
        />
      </ButtonContainer>
      <Paragraph fontSize={2} color="#00A78B" fontWeight={600} marginTop={1.5}>
        Activity Type
      </Paragraph>
      <HorizontalLine width={10.052083} marginBottom={1.853704} />
      <ContentRow cols={1} gap={1}>
        {checkboxes1.map((el) => (
          <CustomCheckbox
            key={el.key}
            checked={el.checked}
            identity={el.identity}
            text={el.text}
            datakey={el.key}
            icon={el.icon}
            total={el.total}
            iconBorder={el.iconBorder}
            onClick={onClick}
            onCheckboxChange={onChange}
            fontSize={el.fontSize}
          />
        ))}
      </ContentRow>
      <Paragraph fontSize={2} color="#00A78B" fontWeight={600} marginTop={1.5}>
        Miscellaneous
      </Paragraph>
      <HorizontalLine width={10.052083} marginBottom={1.853704} />
      <ContentRow cols={1} gap={1}>
        {checkboxes2.map((el) => (
          <CustomCheckbox
            key={el.key}
            checked={el.checked}
            identity={el.identity}
            text={el.text}
            datakey={el.key}
            icon={el.icon}
            total={el.total}
            iconBorder={el.iconBorder}
            onClick={onClick}
            onCheckboxChange={onChange}
            fontSize={el.fontSize}
          />
        ))}
      </ContentRow>
    </motion.div>
  );
}
