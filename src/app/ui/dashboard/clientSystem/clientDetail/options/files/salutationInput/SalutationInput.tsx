import { useState } from 'react';

export function SalutationInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  const [localValue, setLocalValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;

    onChange(e);

    setLocalValue(value);
  };

  return (
    <input
      onChange={handleChange}
      value={localValue}
      type="text"
      className="h-full text-[#00A78B] px-[0.2vw] outline-none border-[0.130208vw] border-[#00A78B]"
    />
  );
}
