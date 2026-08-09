export function NoReadMessageCount({ noReadMessageCount }: { noReadMessageCount: number }) {
  // ----- global states -----

  // ----- local states -----

  return (
    <aside className="w-[1.302083vw] h-[1.302083vw] flex justify-center items-center bg-[#C9EBE6] rounded-full">
      <p className="text-[1.666667vh] text-[#00A78B]">{noReadMessageCount}</p>
    </aside>
  );
}
