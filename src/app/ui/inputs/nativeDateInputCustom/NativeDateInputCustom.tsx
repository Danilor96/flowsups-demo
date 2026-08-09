import { IsLoadingComponent } from '../isLoadingComponent/IsLoadingComponent';

export function NativeDateInputCustom({
  name,
  label,
  value,
  maxDateAvailable,
  minDateAvailable,
  loading,
  fieldErrors,
  disabled,
  onChange,
}: {
  name: string;
  label?: string;
  value: string;
  maxDateAvailable?: Date;
  minDateAvailable?: Date;
  loading?: boolean;
  disabled?: boolean;
  fieldErrors?: {
    [key: string]: [string | undefined];
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) {
  // global states

  // local states

  return (
    <div className="relative flex flex-col">
      {label && (
        <label
          htmlFor={name}
          className="w-fit mb-[1.666667vh] font-medium text-[1.626852vh] text-[#B3B3B3]"
        >
          {label}
        </label>
      )}
      <input
        type="date"
        name={name}
        id={name}
        onChange={onChange}
        value={value}
        className="w-full h-[5.277778vh] px-[0.125rem] bg-[#F4F4F4] text-[#585858] text-[1.666667vh] customInputDate outline-none rounded-[0.520833vw] disabled:bg-[#C9EBE6] transition-colors"
        max={maxDateAvailable?.toISOString().split('T')[0]}
        min={minDateAvailable?.toISOString().split('T')[0]}
        disabled={disabled || loading}
      />
      {fieldErrors?.[name] && (
        <p className="absolute top-[100%] text-red-500 text-[1.6vh]">{fieldErrors[name]}</p>
      )}
      {loading && <IsLoadingComponent />}
    </div>
  );
}
