import { Input } from '&/inputs/Input';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { motion } from 'framer-motion';

export function ExtendedInfo({
  firstname,
  lastname,
  middleInitials,
  nickname,
  salutation,
  suffix,
  onChange,
}: {
  firstname: string;
  salutation: string;
  nickname: string;
  middleInitials: string;
  lastname: string;
  suffix: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  const inputData = [
    {
      id: 1,
      name: 'salutation',
      value: salutation,
      label: 'Salutation',
      type: 'text',
      width: 16.458333,
      onChange: onChange,
    },
    {
      id: 2,
      name: 'nickname',
      value: nickname,
      label: 'Nickname',
      type: 'text',
      width: 16.458333,
      onChange: onChange,
    },
    {
      id: 3,
      name: 'firstname',
      value: firstname,
      label: 'First Name',
      type: 'text',
      width: 16.458333,
      onChange: onChange,
    },
    {
      id: 4,
      name: 'middleInitials',
      value: middleInitials,
      label: 'Middle Initials',
      type: 'text',
      width: 16.458333,
      onChange: onChange,
    },
    {
      id: 5,
      name: 'lastname',
      value: lastname,
      label: 'Last Name',
      type: 'text',
      width: 16.458333,
      onChange: onChange,
    },
    {
      id: 6,
      name: 'suffix',
      value: suffix,
      label: 'Suffix',
      type: 'text',
      width: 16.458333,
      onChange: onChange,
    },
  ];

  return (
    <motion.aside
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute top-[6vh] z-40 py-[2.453704vh] px-[1.458333vw] bg-[#FFF] rounded-[0.520833vw] border-[0.2vw] border-[#C9EBE6]"
    >
      <ContentRow cols={2} gap={2}>
        {inputData.map((el, index) => (
          <Input
            key={`${el.id + 9}extendedinfo${index - 90}`}
            label={el.label}
            name={el.name}
            type={el.type}
            value={el.value}
            width={el.width}
            capitalString
            onChange={el.onChange}
          />
        ))}
      </ContentRow>
    </motion.aside>
  );
}
