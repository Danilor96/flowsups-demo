import { ShowInfo } from '&/icons/Icons';

export function Header({
  showContent,
  children,
  onClick,
}: {
  showContent: boolean;
  children: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <aside
      onClick={onClick}
      className={`w-full flex flex-row justify-between py-[2.314815vh] px-[2.083333vw] bg-[#C9EBE6] group rounded-t-[1.041667vw] max-lg:px-3 max-lg:py-3 ${
        !showContent && 'rounded-b-[1.041667vw]'
      }`}
    >
      <p className="text-[2.777778vh] font-semibold leading-[1.805556vh] text-[#00A78B] max-lg:text-base max-lg:leading-normal">
        {children}
      </p>
      <p
        className={`transition-all ${
          showContent ? 'rotate-0 group-hover:-rotate-90' : '-rotate-90 group-hover:rotate-0'
        }`}
      >
        <ShowInfo />
      </p>
    </aside>
  );
}
