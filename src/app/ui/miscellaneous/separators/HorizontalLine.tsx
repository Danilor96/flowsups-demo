export function HorizontalLine({
  marginBottom,
  marginTop,
  lineColor,
  columnSpan,
  width,
  height,
}: {
  marginTop?: number;
  marginBottom?: number;
  lineColor?: string;
  columnSpan?: number;
  width?: number;
  height?: number;
}) {
  return (
    <div
      style={{
        width: width ? `${width}vw` : '100%',
        height: height ? `${height}vh` : '0.5px',
        marginTop: `${marginTop}vh`,
        marginBottom: `${marginBottom}vh`,
        backgroundColor: `${lineColor ? `${lineColor}` : '#92CEC3'}`,
        gridColumn: columnSpan ? `span ${columnSpan} / span ${columnSpan}` : 1,
      }}
    ></div>
  );
}
