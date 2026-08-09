import { SetStateAction } from 'react';

export function SearchableComponent({
  value,
  onClick,
}: {
  value: string;
  onClick: (value: SetStateAction<string>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <aside className="h-fit flex flex-row items-end gap-[0.4vw] mb-[0.4vh]">
      <p className="text-primaryColor text-[2vh]">Search:</p>
      <input
        type="text"
        name=""
        id=""
        value={value}
        onChange={(e) => onClick(e.currentTarget.value)}
        className="h-fit text-primaryColor text-[2vh] border border-primaryColor px-[0.2vw] outline-none"
      />
    </aside>
  );
}
