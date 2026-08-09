import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { HTMLAttributes } from 'react';

export function Loader({
  zIndex,
  props,
  rounded,
  fixed,
}: {
  zIndex?: number;
  props?: HTMLAttributes<HTMLDivElement>;
  rounded?: string;
  fixed?: boolean;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <div
      style={{
        position: fixed ? 'fixed' : 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#a7dacd',
        zIndex: zIndex,
        borderRadius: rounded,
      }}
      // {...props}
    >
      <aside className="w-fit h-fit animate-pulse">
        <Paragraph fontSize={3} color="#00A78B">
          Flows<span className="text-[#006a58]">ups</span>
        </Paragraph>
      </aside>
    </div>
  );
}
