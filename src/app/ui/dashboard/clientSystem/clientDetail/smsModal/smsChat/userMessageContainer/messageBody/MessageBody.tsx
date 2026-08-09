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
    <aside className="relative w-[85%] min-h-[7.5vh] flex flex-row">
      <div className="w-full text-[1.666667vh] font-normal leading-[1.805556vh] text-[#959595] rounded-tr-[1.8vw] rounded-l-[1.8vw] bg-[#daf3ef] px-[1.5vw] py-[1.5vh] break-words text-wrap">
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
              <span className="text-[1.5vh] text-[#00A78B]">
                {fileAttachment.name.slice(0, 27) +
                  `${fileAttachment.name.length > 27 ? '...' : ''}`}
              </span>
            </a>
          ))}
      </div>
      <div className="absolute bottom-0 right-[-0.9vw] w-[3vw] h-0 border-b-[1.4vw] border-b-[#daf3ef] border-l-[1vw] border-l-transparent border-r-[1vw] border-r-transparent"></div>
    </aside>
  );
}
