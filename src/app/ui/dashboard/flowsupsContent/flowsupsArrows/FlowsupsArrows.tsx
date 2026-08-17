import { ArrowIcon, LargeArrowIcon } from '&/icons/Icons';

export function FlowsupsArrows() {
  // ----- global states -----

  // ----- local states -----

  return (
    <>
      <div className="absolute top-[29vh] left-[12vw] rotate-45 max-lg:hidden">
        <ArrowIcon />
      </div>
      <div className="absolute top-[29vh] left-[19vw] -rotate-[76deg] max-lg:hidden">
        <ArrowIcon />
      </div>
      <div className="absolute top-[14vh] left-[27vw] rotate-12 max-lg:hidden">
        <ArrowIcon />
      </div>
      <div className="absolute top-[28vh] left-[27vw] rotate-45 max-lg:hidden">
        <ArrowIcon />
      </div>
      <div className="absolute top-[13.5vh] left-[41.4vw] rotate-[15deg] max-lg:hidden">
        <ArrowIcon />
      </div>
      <div className="absolute top-[35vh] left-[41.4vw] rotate-[15deg] max-lg:hidden">
        <ArrowIcon />
      </div>
      <div className="absolute top-[47vh] left-[41.4vw] rotate-[48deg] max-lg:hidden">
        <ArrowIcon />
      </div>
      <div className="absolute top-[13vh] left-[57.3vw] rotate-[3deg] max-lg:hidden">
        <LargeArrowIcon />
      </div>
      <div className="absolute top-[21vh] left-[57.3vw] rotate-[20deg] max-lg:hidden">
        <LargeArrowIcon />
      </div>
      <div className="absolute top-[35vh] left-[55.4vw] rotate-[15deg] max-lg:hidden">
        <ArrowIcon />
      </div>
      <div className="absolute top-[35vh] left-[68.5vw] rotate-[15deg] max-lg:hidden">
        <ArrowIcon />
      </div>
      <div className="absolute top-[46.7vh] left-[75vw] rotate-[105deg] max-lg:hidden">
        <ArrowIcon />
      </div>
    </>
  );
}
