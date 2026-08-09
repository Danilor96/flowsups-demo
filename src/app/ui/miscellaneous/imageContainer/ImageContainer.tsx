/* eslint-disable @next/next/no-img-element */
export function ImageContainer({
  img,
  height,
  width,
}: {
  img?: string;
  width: number;
  height: number;
}) {
  return (
    <img
      width={`${width}vw`}
      height={`${height}vh`}
      src={`${img ? img : '/users/flowsups_default_avatar.png'}`}
      alt="Image of the user"
      className="object-contain object-center rounded-full bg-[#C9EBE6]"
      style={{
        width: `${width}vw`,
        height: `${height}vh`,
      }}
    />
  );
}
