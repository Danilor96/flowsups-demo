import { AttachmentIcon } from '../../../smsInput/fileInput/FileAttachment';

export function MessageBody({
  message,
  filesAttachment,
}: {
  message: string;
  filesAttachment?: { name: string; url: string }[] | null;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <aside className="relative w-[86.5%] min-h-[7.5vh] flex flex-row max-lg:max-w-[85%] max-lg:h-auto">
      <div className="w-full text-[1.666667vh] font-normal leading-[1.805556vh] text-[#959595] rounded-r-[1.8vw] rounded-tl-[1.8vw] bg-[#f3f1f1] px-[1.5vw] py-[1.5vh] break-words text-wrap !max-lg:text-sm max-lg:px-3 max-lg:py-2">
        <p>{message}</p>
        {filesAttachment &&
          filesAttachment.length > 0 &&
          filesAttachment.map((fileAttachment, index) => (
            <a
              key={index}
              target="_blank"
              href={fileAttachment.url}
              title="View attachment"
              className="mt-4 px-2 py-1 rounded-xl bg-[#c5e2dd] border border-[#00a78ba8] flex items-center justify-center gap-1"
            >
              <div className="text-gray-900 flex items-center justify-center w-4 h-4">
                <AttachmentIcon />
              </div>
              <span className="text-[1.5vh] text-[#00A78B] max-lg:text-xs">
                {fileAttachment.name.slice(0, 20) +
                  `${fileAttachment.name.length > 20 ? '...' : ''}`}
              </span>
            </a>
          ))}
      </div>
      <div className="absolute bottom-0 left-[-0.9vw] w-[3vw] h-0 border-b-[1.4vw] border-b-[#f3f1f1] border-l-[1vw] border-l-transparent border-r-[1vw] border-r-transparent"></div>
    </aside>
  );
}
