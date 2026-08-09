export function LeadBackground({ children }: { children: React.ReactNode }) {
  // ----- global states -----

  // ----- local states -----

  return (
    <section className="relative w-full h-fit flex flex-col gap-[3vh] bg-[#DEF2FF] pt-[1.018519vh] px-[0.885417vw] pb-[1.388889vh] rounded-[0.520833vw]">
      {children}
    </section>
  );
}
