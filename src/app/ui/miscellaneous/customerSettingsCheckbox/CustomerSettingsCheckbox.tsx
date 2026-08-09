export function CustomerSettingsCheckbox({
  checkboxText,
  name,
  checked,
  onChange,
}: {
  checkboxText: string;
  name: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div
      className={`flex flex-row gap-[0.677083vw] justify-center items-center border-[0.052083vw] border-[#00A78B] rounded-[1.041667vw] p-[0.5vw] overflow-hidden ${
        checked ? 'bg-[#00A78B]' : ''
      }`}
    >
      <input
        type="checkbox"
        onChange={onChange}
        name={name}
        id={name}
        checked={checked}
        className="peer w-[0.9375vw] h-[0.9375vw] accent-[#C9EBE6]"
      />
      <p className="text-[2vh] text-[#999999] font-medium peer-checked:text-[#FFFFFF] transition-colors ease-in-out">
        {checkboxText}
      </p>
    </div>
  );
}
