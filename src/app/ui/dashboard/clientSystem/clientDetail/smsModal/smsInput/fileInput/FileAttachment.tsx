interface FileAttachmentProps {
  files: File[] | null;
  setFiles: (files: File[] | null) => void;
}

export const AttachmentIcon = () => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 30 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.8426 2.17645L3.08686 13.9321C0.304378 16.7146 0.304378 21.2259 3.08686 24.0084C5.86933 26.7909 10.3806 26.7909 13.1631 24.0084L27.158 10.0135C29.0129 8.15859 29.0129 5.15105 27.158 3.29601C25.303 1.44104 22.2955 1.44104 20.4404 3.29601L6.44566 17.2909C5.51814 18.2184 5.51814 19.7221 6.44566 20.6496C7.3731 21.5771 8.87687 21.5771 9.80439 20.6496L21.56 8.89397"
        stroke="currentColor"
        strokeOpacity="0.31"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const FileAttachment = ({ files, setFiles }: FileAttachmentProps) => {
  const hasFiles = files && files.length > 0;
  if (!hasFiles) return;

  return (
    <div className="h-full w-full flex items-center justify-center gap-2 bg-zinc-200 rounded-xl py-1 px-2">
      <div className="text-gray-800 flex items-center justify-center w-4 h-4">
        <AttachmentIcon />
      </div>
      <span className="text-[1.5vh] leading-3 font-semibold text-gray-600">
        {files[0]?.name.slice(0, 57) + `${files[0]?.name.length > 57 ? '...' : ''}`}
        <span className="text-[1.5vh] leading-3 font-semibold text-[#00A78B]">{files.length > 1 ? ` (+${files.length - 1})` : ''}</span>
      </span>
      <button // remove attachment
        onClick={() => setFiles(null)}
        className="rounded-md p-1  hover:bg-gray-300 text-gray-600"
        title="Remove attachment"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6l-12 12" /> <path d="M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default FileAttachment;
