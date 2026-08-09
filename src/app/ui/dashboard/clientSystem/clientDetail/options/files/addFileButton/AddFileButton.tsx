import { PlusIcon } from '&/icons/Icons';

export function AddFileButton({
  value,
  onChange,
}: {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <aside>
      <label
        htmlFor="fileInput"
        className="w-full h-[5.740741vh] flex flex-row justify-center items-center bg-[#c7e2dd75] cursor-pointer hover:bg-[#94afab75] transition-colors rounded-b-[0.520833vw]"
      >
        <PlusIcon />
        <p className="ml-[0.260416vw] text-[1.851852vh] font-normal leading-[1.805556vh] text-[#00A78B]">
          Add a File
        </p>
      </label>
      <input onChange={onChange} value={value} type="file" name="fileInput" id="fileInput" hidden />
    </aside>
  );
}
