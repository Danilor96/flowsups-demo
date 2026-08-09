export function ModalContainer({
  children,
  width,
  height,
  marginTop,
  positionRelative,
}: {
  children: React.ReactNode;
  width: number;
  height?: number;
  marginTop: number;
  positionRelative?: boolean;
}) {
  return (
    <article
      className="rounded-[0.520833vw] bg-[#FFF] mx-auto mb-[2vh]"
      style={{
        position: positionRelative ? 'relative' : 'static',
        width: `${width}vw`,
        height: `${height ? `${height}vh` : 'fit-content'}`,
        marginTop: `${marginTop}vh`,
      }}
    >
      {children}
    </article>
  );
}
