import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';

export function CalendarInfo() {
  // ----- global states -----

  // ----- local states -----

  return (
    <div className="w-fit h-fit flex flex-col justify-start items-start gap-[0.5vh]">
      <aside className="w-fit h-fit flex flex-row justify-center items-center gap-[0.5vw]">
        <section className="w-[0.5vw] h-[0.5vw] rounded-full bg-[#c9a516]"></section>
        <Paragraph>Waiting for confirmation</Paragraph>
      </aside>
      <aside className="w-fit h-fit flex flex-row justify-center items-center gap-[0.5vw]">
        <section className="w-[0.5vw] h-[0.5vw] rounded-full bg-[#00A78B]"></section>
        <Paragraph>Confirmed</Paragraph>
      </aside>
      <aside className="w-fit h-fit flex flex-row justify-center items-center gap-[0.5vw]">
        <section className="w-[0.5vw] h-[0.5vw] rounded-full bg-[#ef4444]"></section>
        <Paragraph>Canceled</Paragraph>
      </aside>
    </div>
  );
}
