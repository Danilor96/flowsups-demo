export function CustomerStatusIndicator({ status }: { status?: string }) {
  // ----- global status -----

  // ----- local status -----

  if (status) {
    return (
      <aside className="w-fit px-[1.2vw] py-[0.8vh] flex justify-center items-center bg-[#C9EBE6] rounded-[0.520833vw]">
        <p className="w-fit text-[2.777778vh] text-[#00A78B] font-semibold capitalize">{status}</p>
      </aside>
    );
  } else {
    return (
      <aside className="w-fit px-[1.640625vw] py-[1.805556vh] flex justify-center items-center bg-[#C9EBE6] rounded-[0.520833vw]">
        <p className="w-fit text-[2.777778vh] text-[#00A78B] font-semibold">No status stablished</p>
      </aside>
    );
  }
}
