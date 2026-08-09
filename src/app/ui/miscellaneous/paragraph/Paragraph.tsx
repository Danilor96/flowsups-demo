export function Paragraph({
  children,
  fontSize,
  color,
  fontWeight,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  maxWidth,
  underline,
  hoverOpacity,
  cursorPointer,
  id,
  email,
  widthFitContent,
  displayInline,
  textNoWrap,
  textAlignCenter,
  onClick,
}: {
  children: React.ReactNode;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  maxWidth?: number;
  underline?: boolean;
  hoverOpacity?: boolean;
  cursorPointer?: boolean;
  id?: number;
  email?: string;
  displayInline?: boolean;
  widthFitContent?: boolean;
  textNoWrap?: boolean;
  textAlignCenter?: boolean;
  onClick?: (event: React.MouseEvent<HTMLParagraphElement>) => void;
}) {
  return (
    <p
      onClick={onClick}
      data-id={id}
      data-email={email}
      className={`leading-none ${hoverOpacity && 'hover:opacity-80 transition-opacity'}`}
      style={{
        display: displayInline ? 'inline' : 'block',
        fontSize: `${fontSize ? `${fontSize}vh` : '1.8vh'}`,
        color: `${color ? `${color}` : '#B3B3B3'}`,
        fontWeight: `${fontWeight ? `${fontWeight}` : 400}`,
        marginTop: marginTop && `${marginTop}vh`,
        marginBottom: marginBottom && `${marginBottom}vh`,
        marginLeft: marginLeft && `${marginLeft}vw`,
        marginRight: marginRight && `${marginRight}vw`,
        maxWidth: `${maxWidth}vw`,
        textAlign: textAlignCenter ? 'center' : 'left',
        textDecorationLine: underline ? 'underline' : 'none',
        cursor: cursorPointer ? 'pointer' : 'default',
        width: widthFitContent ? 'fit-content' : '',
        textWrap: textNoWrap ? 'nowrap' : 'wrap',
      }}
    >
      {children}
    </p>
  );
}
