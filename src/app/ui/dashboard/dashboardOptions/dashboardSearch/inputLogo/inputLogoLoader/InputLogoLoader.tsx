import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';

export function InputLogoLoader() {
  // ----- global states -----

  // ----- local states -----

  return (
    <aside className="absolute top-0 right-0 w-full h-full flex justify-center items-center bg-[#a7dacd] rounded-[1vw]">
      <div className="w-fit h-fit animate-pulse">
        <Paragraph color="#FFF">Searching...</Paragraph>
      </div>
    </aside>
  );
}
