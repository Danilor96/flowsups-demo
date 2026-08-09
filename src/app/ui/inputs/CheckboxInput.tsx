export function CheckboxInput({
  name,
  value,
  chekcboxText,
  checked,
  onChange,
  onClick = () => {},
}: {
  name: string;
  value?: string | undefined;
  chekcboxText: string;
  checked?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void | null;
}) {
  const valueCheck = checked !== undefined ? checked : value ? true : false;
  return (
    <div className="flex flex-row gap-[0.653646vw] items-center">
      <input
        type="checkbox"
        name={name}
        id={name}
        value={value !== undefined ? value : ''}
        onChange={onChange}
        checked={valueCheck}
        className="w-[1.14375vw] h-[1.14375vw] accent-[#00A78B]"
        onClick={onClick}
      />
      <p className="text-[1.8vh] font-medium text-[#B3B3B3]">{chekcboxText}</p>
    </div>
  );
}
