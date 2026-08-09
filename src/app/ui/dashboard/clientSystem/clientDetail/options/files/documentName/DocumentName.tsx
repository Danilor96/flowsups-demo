import { ImageFileIcon, SheetFileIcon } from '&/icons/Icons';

export function DocumentName({
  filename,
  contentType,
  path,
}: {
  filename: string;
  contentType: string;
  path?: string;
}) {
  // ----- global states -----

  // ----- local states -----

  const returnIcon = (contentType: string) => {
    const imageFormats = [
      'image/jpeg',
      'image/jpg',
      'image/gif',
      'image/png',
      'image/heic',
      'image/heif',
      'image/tiff',
      'image/bmp',
    ];

    return imageFormats.includes(contentType) ? <ImageFileIcon /> : <SheetFileIcon />;
  };

  return (
    <aside className="w-fit h-fit flex flex-row justify-center items-center gap-[0.5vw] mx-auto">
      {returnIcon(contentType)}
      {path ? (
        <a href={path} target="_blank">
          {filename}
        </a>
      ) : (
        <p>{filename}</p>
      )}
    </aside>
  );
}
