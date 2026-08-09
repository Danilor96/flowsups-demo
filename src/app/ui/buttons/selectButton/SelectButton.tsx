import { SelectDropIcon } from '&/icons/Icons';

export function SelectButton({
  border,
  borderColor,
  borderRadius,
  height,
  onClick,
  text,
  textColor,
  width,
  backgroundColor,
}: {
  width: number;
  height: number;
  border: number;
  borderColor: string;
  borderRadius: number;
  backgroundColor?: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  textColor: string;
  text: string;
}) {
  return (
    <button
      type="button"
      className="flex flex-row justify-between items-center px-[0.6vw] cursor-default"
      style={{
        width: `${width}vw`,
        height: `${height}vh`,
        borderRadius: `${borderRadius}vw`,
        borderWidth: `${border}vw`,
        borderColor: `${borderColor}`,
        backgroundColor: `${backgroundColor}`,
      }}
      onClick={onClick}
    >
      <p className="text-[1.8vh] font-medium" style={{ color: `${textColor}` }}>
        {text}
      </p>
      <SelectDropIcon color={borderColor} />
    </button>
  );
}
