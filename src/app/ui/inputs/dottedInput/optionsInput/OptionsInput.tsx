import { motion } from 'framer-motion';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { Input } from '&/inputs/Input';

export function OptionsInput({
  width,
  height,
  right,
  bottom,
  top,
  left,
  inputs,
  zIndex,
  columns,
  columnsGap,
  fieldErrors,
  heightContentFit,
}: {
  width: number;
  height: number;
  heightContentFit?: boolean;
  right?: boolean;
  left?: boolean;
  top?: number;
  bottom?: number;
  zIndex?: number;
  columns: number;
  columnsGap: number;
  inputs: {
    key: number;
    label: string;
    colGridSpan?: number;
    marginLeft?: number;
    value: string;
    name: string;
    width: number;
    index?: number;
    disabled?: boolean;
    type: string;
    options?:
      | {
          value: number | undefined;
          option: string | undefined;
        }[]
      | undefined;
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  }[];
  fieldErrors?: { [key: string]: [string | undefined] };
}) {
  // ----- local state -----

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute flex justify-center items-center bg-white rounded-[0.52vw] shadow-crmFormShadow px-[1vw] py-[1vh]"
      style={{
        width: `${width}vw`,
        height: heightContentFit ? 'fit-content' : `${height}vh`,
        right: `${right && '0px'}`,
        left: `${left && '0px'}`,
        top: top ? `${top}vh` : '10vh',
        bottom: `${bottom}vh`,
        zIndex: zIndex ? zIndex : 10,
      }}
    >
      <ContentRow cols={columns} gap={columnsGap}>
        {inputs?.map((el) => (
          <Input
            key={el.key}
            label={el.label}
            name={el.name}
            value={el.value}
            width={el.width}
            type={el.type}
            index={el.index}
            disabled={el.disabled}
            options={el.options}
            onChange={el.onChange}
            colGridSpan={el.colGridSpan}
            marginLeft={el.marginLeft}
            fieldErrors={fieldErrors}
          />
        ))}
      </ContentRow>
    </motion.div>
  );
}
