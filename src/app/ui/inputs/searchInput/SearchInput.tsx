import { SearchLens } from '&/icons/Icons';

export function SearchInput({
  onChange,
  label,
  height,
  width,
  placeholder,
  value,
  name,
  backgroundColor,
  textColor,
  borderRadius,
}: {
  label?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  width: number;
  height: number;
  value: string | undefined;
  name: string;
  placeholder: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: number;
}) {
  return (
    <div className="w-fit h-fit flex flex-col">
      {label && (
        <label htmlFor="" className="text-[#00A78B] text-[1.9vh] font-medium">
          {label}
        </label>
      )}
      <aside
        className="flex flex-row justify-center items-center border-[0.104167vw] border-[#00A78B] text-[1.7vh] font-normal px-[0.7vw]"
        style={{
          backgroundColor: backgroundColor ? backgroundColor : '#FFF',
          color: textColor ? textColor : '#00A78B',
          width: `${width}vw`,
          height: `${height}vh`,
          borderRadius: borderRadius ? `${borderRadius}vw` : '0.90vw',
        }}
      >
        <article className="w-[10%] h-fit">
          <SearchLens />
        </article>
        <input
          type="text"
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          name={name}
          autoComplete="off"
          className="w-[90%] outline-none placeholder:text-[#FFF] px-[0.5vw]"
          style={{
            backgroundColor: backgroundColor ? backgroundColor : '#FFF',
          }}
        />
      </aside>
    </div>
  );
}
