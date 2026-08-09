import { useState } from 'react';

const FileInput = ({
  fileInputRef,
  onChange,
}: {
  fileInputRef: React.RefObject<HTMLInputElement>;
  onChange: (file: File[] | null) => void;
}) => {

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const file = files ? Array.from(files) : null;
    onChange(file);
  };

  return (
    <>
      <input
        onChange={handleFileChange}
        className="hidden"
        type="file"
        id="file"
        accept="image/*"
        multiple={true}
        ref={fileInputRef}
      />
    </>
  );
};

export default FileInput;
