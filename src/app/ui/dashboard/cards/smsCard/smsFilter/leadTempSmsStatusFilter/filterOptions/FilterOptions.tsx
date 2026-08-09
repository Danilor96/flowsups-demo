import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { HorizontalLine } from '&/miscellaneous/separators/HorizontalLine';
import { Input } from '&/inputs/Input';
import { OneTaskFires, ThreeTaskFires, TwoTaskFires } from '&/icons/Icons';
import { motion } from 'framer-motion';

export function FilterOptions({
  inputDataOne,
  inputDataTwo,
  inputDataThree,
  onChange,
}: {
  inputDataOne: {
    id: number;
    label: string;
    name: string;
    type: string;
    width: number;
    value: string;
    chekcboxText: string;
    temp?: number;
    leadIcon?: boolean;
  }[];
  inputDataTwo: {
    id: number;
    label: string;
    name: string;
    type: string;
    width: number;
    value: string;
    chekcboxText: string;
  }[];
  inputDataThree: {
    id: number;
    label: string;
    name: string;
    type: string;
    width: number;
    value: string;
    chekcboxText: string;
  }[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <motion.div
      onClick={(e) => e.stopPropagation()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute left-[50%] top-[7.5vh] z-10 w-[12.291667vw] flex flex-col justify-center items-center gap-[1vh] px-[0.8vw] py-[1.1vh] bg-white rounded-[0.520833vw] translate-x-[-50%]"
    >
      <aside className="w-full h-fit">
        <Paragraph color="#00A78B" fontSize={1.851852}>
          Filter
        </Paragraph>
      </aside>
      {inputDataThree &&
        inputDataThree.length > 0 &&
        inputDataThree.map((el, index) => (
          <aside key={`${el.id * 3}()_${index}`} className="w-full">
            <Input
              label={el.label}
              name={el.name}
              type={el.type}
              width={el.width}
              value={el.value}
              chekcboxText={el.chekcboxText}
              onChange={onChange}
            />
          </aside>
        ))}
      <aside className="w-full h-fit">
        <Paragraph color="#00A78B" fontSize={1.666667}>
          Lead Temp
        </Paragraph>
      </aside>
      <HorizontalLine />
      {inputDataOne &&
        inputDataOne.length > 0 &&
        inputDataOne.map((el, index) => {
          if (!el.leadIcon) {
            return (
              <aside key={`${el.id * 3}()_${index}`} className="w-full">
                <Input
                  label={el.label}
                  name={el.name}
                  type={el.type}
                  width={el.width}
                  value={el.value}
                  chekcboxText={el.chekcboxText}
                  onChange={onChange}
                />
              </aside>
            );
          } else {
            return (
              <aside
                key={`${el.id * 3}()_${index}`}
                className="w-full flex flex-row justify-between"
              >
                <Input
                  label={el.label}
                  name={el.name}
                  type={el.type}
                  width={el.width}
                  value={el.value}
                  chekcboxText={el.chekcboxText}
                  onChange={onChange}
                />
                {el.leadIcon && el.temp === 1 ? (
                  <OneTaskFires />
                ) : el.temp === 2 ? (
                  <TwoTaskFires />
                ) : (
                  <ThreeTaskFires />
                )}
              </aside>
            );
          }
        })}
      <aside className="w-full mt-[1vh]">
        <Paragraph color="#00A78B" fontSize={1.666667}>
          Sms Status
        </Paragraph>
      </aside>
      <HorizontalLine />
      {inputDataTwo &&
        inputDataTwo.length > 0 &&
        inputDataTwo.map((el, index) => (
          <aside key={`${el.id * 3}()_${index}`} className="w-full">
            <Input
              label={el.label}
              name={el.name}
              type={el.type}
              width={el.width}
              value={el.value}
              chekcboxText={el.chekcboxText}
              onChange={onChange}
            />
          </aside>
        ))}
    </motion.div>
  );
}
