export function OptionCheckbox({
  lead,
  id,
  checked,
  onChange,
}: {
  lead: string;
  id: number;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <label
      htmlFor={`${id}`}
      className="flex flex-row items-center justify-center gap-[0.653646vw] w-fit"
    >
      <aside
        className={`w-[1.14375vw] h-[1.14375vw] rounded-[0.15625vw] ${
          checked ? 'bg-[#00A78B]' : 'bg-[#D9D9D9]'
        }`}
      ></aside>
      <p className="text-[2vh] text-[#B3B3B3]">{lead}</p>
      <input
        type="checkbox"
        name={`${id}`}
        id={`${id}`}
        className="hidden"
        onChange={onChange}
        checked={checked}
      />
    </label>
  );
}
