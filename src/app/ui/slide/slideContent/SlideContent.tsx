export function SlideContent({
  children,
  paddingX,
  paddingTop,
  paddingBottom,
}: {
  children: React.ReactNode;
  paddingX?: number;
  paddingTop?: number;
  paddingBottom?: number;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <article
      className="w-full h-full py-[0.8vh]"
      style={{
        paddingInline: paddingX ? `${paddingX}vw` : '0.5vw',
        paddingTop: paddingTop ? `${paddingTop}vh` : '0.8vh',
        paddingBottom: paddingBottom ? `${paddingBottom}vh` : '0.8vh',
      }}
    >
      {children}
    </article>
  );
}
