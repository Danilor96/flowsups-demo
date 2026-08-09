import { useRef, useState } from 'react';
import { CheckedIcon } from '&/icons/Icons';

export function SlideTableCheckbox({
  name,
  identity,
  onCheckboxChange,
}: {
  name: string;
  identity: string;
  onCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const input = useRef<HTMLInputElement>(null);

  const [checked, setChecked] = useState<boolean>(false);

  return (
    <div className="w-fit h-fit">
      <input
        ref={input}
        type="checkbox"
        name={name}
        id={name}
        className="hidden"
        data-identity={identity}
        onChange={(e) => {
          onCheckboxChange(e);
          if (input.current) {
            setChecked(input.current.checked.valueOf());
          }
        }}
      />
      <label htmlFor={name} className="w-fit h-fit">
        <aside className="w-[1.2vw] h-[1.2vw] flex justify-center items-center rounded-[0.3125vw] bg-[#C9EBE6]">
          {checked && <CheckedIcon />}
        </aside>
      </label>
    </div>
  );
}
