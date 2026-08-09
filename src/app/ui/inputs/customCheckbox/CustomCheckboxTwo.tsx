import { CheckedIcon } from '&/icons/Icons';
import { useEffect, useRef, useState } from 'react';

export function CustomCheckboxTwo({
  checked,
  width,
  mobile,
}: {
  checked: boolean;
  width?: number;
  mobile?: boolean;
}) {
  // ----- global states -----

  // ----- local states -----

  const [parentElementWidth, setParentElementWidth] = useState<number>();

  const checkbox = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const curretnRef = checkbox.current;

    if (curretnRef) {
      const parentElement = curretnRef.parentElement?.parentElement?.parentElement;

      if (!parentElement) return;

      setParentElementWidth(curretnRef.parentElement?.clientWidth);

      const observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setParentElementWidth(entry.contentRect.width);
        }
      });

      observer.observe(parentElement);

      return () => {
        observer.unobserve(parentElement);
        observer.disconnect();
      };
    }
  }, [checkbox]);

  const checkboxWidthRules = () => {
    return mobile
      ? parentElementWidth && parentElementWidth >= 600 && parentElementWidth <= 997
        ? '2.5vw'
        : parentElementWidth && parentElementWidth > 997
        ? '1.25vw'
        : '6vw'
      : width
      ? `${width}vw`
      : '1.25vw';

    // return mobile
    //   ? parentElementWidth && parentElementWidth >= 600 && parentElementWidth <= 997
    //     ? '4.5vw'
    //     : parentElementWidth && parentElementWidth > 997
    //     ? '2vw'
    //     : width
    //     ? `${width}vw`
    //     : '2vw'
    //   : width
    //   ? `${width}vw`
    //   : '1.25vw';
  };

  return (
    <span
      ref={checkbox}
      className="w-[6vw] h-[6vw] md:w-[1.14375vw] md:h-[1.14375vw] flex justify-center items-center px-[0.1vw] py-[0.2vh] rounded-[0.3125vw] bg-[#C9EBE6] hover:bg-[#aadad2] transition-colors"
      // className={` flex justify-center items-center px-[0.1vw] py-[0.2vh] rounded-[0.3125vw] bg-[#C9EBE6] hover:bg-[#aadad2] transition-colors ${
      //   mobile && 'md:w-[1.25vw]'
      // }`}
      style={
        {
          // width: checkboxWidthRules(),
          // height: checkboxWidthRules(),
        }
      }
    >
      {checked && <CheckedIcon width="80%" height="80%" />}
    </span>
  );
}
