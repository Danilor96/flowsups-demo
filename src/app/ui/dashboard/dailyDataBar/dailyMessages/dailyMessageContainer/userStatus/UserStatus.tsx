export function UserStatus({ status }: { status: string }) {
  // ----- global states -----

  // ----- local states -----

  return (
    <section className="w-fit flex justify-center items-center px-[0.5vw] py-[0.8vh] border-[0.052083vw] border-white rounded-[1.041667vw]">
      <p className="text-[1.666667vh] text-white">{status}</p>
    </section>
  );
}
