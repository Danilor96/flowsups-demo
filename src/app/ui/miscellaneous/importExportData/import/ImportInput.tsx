import { CsvIcon } from '&/icons/Icons';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';

export function ImportInput({
  handleChange,
  filename,
}: {
  handleChange: (event: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => void;
  filename?: string;
}) {
  // ----- global states -----

  // ----- local state -----

  return (
    <>
      <label
        htmlFor="excell"
        draggable
        className="cursor-pointer"
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleChange(e);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <aside className="w-full h-[32.5vh] flex flex-col justify-center items-center gap-[1vh] border-[0.15625vw] border-[#C9EBE6] rounded-[1.041667vw] border-dashed">
          <CsvIcon />
          <Paragraph fontSize={2}>
            Drop your CSV file here, or <span className="text-[#00A78B]">Browse</span>
          </Paragraph>
          <Paragraph>(maximum file size 50 MB)</Paragraph>
          <Paragraph marginTop={1}>Not sure how to configure your file?</Paragraph>
          <Paragraph>Download the sample CSV</Paragraph>
          {filename && (
            <Paragraph fontSize={2.2}>
              <span className="text-[#00A78B]">File uploaded:</span>
              {` ${filename}`}
            </Paragraph>
          )}
        </aside>
      </label>
      <input
        type="file"
        name=""
        id="excell"
        accept=".xlsx"
        className="hidden"
        onChange={handleChange}
      />
    </>
  );
}
