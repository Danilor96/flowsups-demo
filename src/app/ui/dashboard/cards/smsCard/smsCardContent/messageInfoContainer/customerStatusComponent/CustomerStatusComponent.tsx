export function CustomerStatusComponent({ customerStatus }: { customerStatus: string }) {
  // ----- global states -----

  // ----- local states -----

  return (
    <aside className="w-fit capitalize h-fit flex justify-center items-center px-[0.5vw] py-[0.8vh] border-[0.052083vw] border-[#FFF] rounded-[1.041667vw]">
      <p className="text-[1.666667vh] text-[#FFF]">{customerStatus}</p>
    </aside>
  );
}
