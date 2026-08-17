import { ButtonContainer } from '&/buttons/ButtonContainer';

export function ContentRow({
  children,
  cols,
  gap,
  marginLeft,
  marginTop,
  marginBottom,
  centerContent,
  elementSameSpace,
  sameSpaceGap,
  alignItems,
  positionRelative,
  justifyContent,
  widthFull,
  overflowHidden,
  paddingX,
  gridTrack,
}: {
  children: React.ReactNode;
  cols: number;
  gap: number;
  widthFull?: boolean;
  marginLeft?: number;
  marginTop?: number;
  marginBottom?: number;
  centerContent?: boolean;
  elementSameSpace?: boolean;
  sameSpaceGap?: number;
  alignItems?: string;
  justifyContent?: string;
  positionRelative?: boolean;
  overflowHidden?: boolean;
  paddingX?: number;
  gridTrack?: string;
}) {
  return (
    <section
      className="grid items-end grid-col !max-lg:grid-cols-1 !max-lg:gap-3"
      style={{
        width: widthFull ? '100%' : 'fit-content',
        marginLeft: `${marginLeft}vw`,
        marginInline: `${centerContent && 'auto'}`,
        marginTop: `${marginTop}vh`,
        marginBottom: `${marginBottom}vh`,
        gridTemplateColumns: `repeat(${cols}, ${gridTrack ? gridTrack : 'auto'})`,
        gap: `${gap}vh`,
        alignItems: alignItems,
        justifyContent: justifyContent,
        position: positionRelative ? 'relative' : 'static',
        overflow: overflowHidden ? 'hidden' : '',
        paddingLeft: paddingX ? `${paddingX}vw` : '',
        paddingRight: paddingX ? `${paddingX}vw` : '',
      }}
    >
      {!elementSameSpace ? (
        children
      ) : (
        <ButtonContainer marginTop={0} gap={sameSpaceGap}>
          {children}
        </ButtonContainer>
      )}
    </section>
  );
}
