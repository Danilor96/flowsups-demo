export function ButtonContainer({
  children,
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
  marginInline,
  justify,
  gap,
  widthFull,
  alignContentCenter,
  block,
  alignContentEnd,
  backgroundColor,
  positionRelative,
  alignContentStart,
  colSpan,
  paddingTop,
  heightFull,
  paddingLeft,
  paddingRight,
  paddingBottom,
}: {
  children: React.ReactNode;
  marginTop: number;
  marginLeft?: number;
  marginRight?: number;
  marginBottom?: number;
  paddingTop?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingBottom?: number;
  marginInline?: boolean;
  justify?: string;
  widthFull?: boolean;
  heightFull?: boolean;
  gap?: number;
  alignContentCenter?: boolean;
  alignContentEnd?: boolean;
  alignContentStart?: boolean;
  block?: boolean;
  backgroundColor?: string;
  positionRelative?: boolean;
  colSpan?: number;
}) {
  return (
    <div
      className="flex-row"
      style={{
        position: positionRelative ? 'relative' : 'static',
        display: `${block ? 'block' : 'flex'}`,
        gap: `${gap && `${gap}vw`}`,
        marginLeft: `${marginLeft ? `${marginLeft}vw` : undefined}`,
        marginRight: `${marginRight ? `${marginRight}vw` : undefined}`,
        marginTop: `${marginTop}vh`,
        marginBottom: `${marginBottom ? `${marginBottom}vh` : undefined}`,
        paddingTop: paddingTop ? `${paddingTop}vh` : undefined,
        paddingLeft: paddingLeft ? `${paddingLeft}vw` : undefined,
        paddingRight: paddingRight ? `${paddingRight}vw` : undefined,
        paddingBottom: paddingBottom ? `${paddingBottom}vh` : undefined,
        marginInline: `${marginInline && 'auto'}`,
        justifyContent: `${justify}`,
        alignItems: `${
          alignContentCenter ? 'center' : alignContentEnd ? 'end' : alignContentStart ? 'start' : ''
        }`,
        width: `${widthFull ? '100%' : 'fit-content'}`,
        height: heightFull ? '100%' : 'fit-content',
        backgroundColor: backgroundColor,
        gridColumn: colSpan ? `span ${colSpan} / span ${colSpan}` : undefined,
      }}
    >
      {children}
    </div>
  );
}
