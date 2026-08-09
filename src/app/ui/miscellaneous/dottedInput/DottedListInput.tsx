import { ThreeGreenDots } from '&/icons/Icons';
import useUiHandler from '@/hooks/closeComponentsHandler';
import { List } from './list/List';
import { OnValueClickInput } from './onValueClickInput/OnValueClickInput';
import { handlingCapitalWords } from '@/app/libs/functions/inputs/inputsFunction';

export function DottedListInput({
  width,
  label,
  value,
  name,
  listItems,
  addNewProspect,
  disabled,
  onChange,
  onSelect,
  onAddNewProspect,
  onValueClick,
  capitalWords,
}: {
  width: number;
  label?: string;
  value: string;
  name: string;
  listItems?: { value: number; option: string }[];
  addNewProspect?: boolean;
  disabled?: boolean;
  capitalWords?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect?: (event: React.MouseEvent<HTMLLIElement>) => void;
  onAddNewProspect?: (event: React.MouseEvent<HTMLLIElement>) => void;
  onValueClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  const { isOpen, ref, toggleOpen } = useUiHandler();

  if (onValueClick) {
    return (
      <OnValueClickInput
        name={name}
        value={value}
        width={width}
        label={label}
        onValueClick={onValueClick}
      />
    );
  } else {
    return (
      <div
        ref={ref}
        className="relative flex flex-col justify-center gap-[1.666667vh]"
        style={{
          width: `${width}vw`,
        }}
      >
        <label htmlFor={name} className="w-fit h-fit text-[1.626852vh] font-medium text-[#B3B3B3]">
          {label}
        </label>
        <aside className="flex flex-row w-full h-[5.277778vh]">
          <input
            onChange={(e) => {
              onChange && onChange(e);
              if (value.length > 1 && !isOpen) toggleOpen();
            }}
            onClick={onValueClick}
            type="text"
            name={name}
            id={name}
            value={capitalWords ? handlingCapitalWords(value) : value}
            disabled={disabled}
            className="w-[85%] h-full rounded-l-[0.520833vw] outline-none px-[0.6vw] text-[1.666667vh] font-medium text-[#585858] bg-[#F4F4F4]"
            style={{
              textDecoration: onValueClick ? 'underline' : '',
              cursor: onValueClick ? 'pointer' : '',
            }}
          />
          <button
            onClick={toggleOpen}
            disabled={disabled}
            className="w-[15%] h-full flex justify-center items-center rounded-r-[0.520833vw] bg-[#F4F4F4] outline-none"
          >
            <ThreeGreenDots />
          </button>
        </aside>
        {isOpen && onSelect && (
          <List
            listItems={listItems}
            addNewProspect={addNewProspect}
            onSelect={(e) => {
              onSelect(e);
              toggleOpen();
            }}
            onAddNewProspect={(e) => {
              onAddNewProspect && onAddNewProspect(e);
              toggleOpen();
            }}
          />
        )}
      </div>
    );
  }
}
