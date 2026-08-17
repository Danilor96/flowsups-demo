import { Loader } from '../miscellaneous/loader/Loader';

export function BorderedContent({
  children,
  title,
  marginBottom,
  marginTop,
  marginLeft,
  width,
  height,
  centerComponent,
  overflowVisible,
  dottedBorder,
  positionRelative,
  loading,
}: {
  children: React.ReactNode;
  title?: string;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  width?: number;
  height?: number;
  centerComponent?: boolean;
  overflowVisible?: boolean;
  dottedBorder?: boolean;
  positionRelative?: boolean;
  loading?: boolean;
}) {
  return (
    <aside
      className={`w-full border-[0.15625vw] border-[#C9EBE6] rounded-[1.041667vw] !max-lg:w-full !max-lg:ml-0 !max-lg:rounded-xl ${
        dottedBorder && 'border-dashed'
      }`}
      style={{
        position: positionRelative ? 'relative' : 'static',
        marginBottom: `${marginBottom}vh`,
        marginTop: `${marginTop}vh`,
        marginLeft: `${marginLeft}vw`,
        width: `${width}vw`,
        height: height && `${height}vh`,
        marginInline: centerComponent ? 'auto' : '',
        overflow: overflowVisible ? 'visible' : 'hidden',
      }}
    >
      {title && (
        <h3 className="w-full h-[6.944444vh] pl-[1.5vw] flex items-center text-[2.222222vh] text-[#00A78B] font-semibold bg-[#C9EBE6] rounded-t-[0.8vw] max-lg:h-auto max-lg:min-h-[3rem] max-lg:py-2 max-lg:px-3 max-lg:text-base max-lg:leading-normal">
          {title}
        </h3>
      )}
      <section className="my-[1.5vh] mx-[1.5vw] max-lg:my-3 max-lg:mx-2">{children}</section>
      {positionRelative && loading && (
        <Loader
          props={{
            style: {
              borderRadius: overflowVisible ? '1.041667vw' : '',
            },
          }}
        />
      )}
    </aside>
  );
}
