export function LeadCreator({ name }: { name: string }) {
  // ----- global states -----

  // ----- local states -----

  const nameExists = name.replaceAll(' ', '');

  return (
    <p className="text-[1.7vh] text-[#585858] font-bold leading-[1.805556.vh]">
      {nameExists ? name : 'System'}
    </p>
  );
}
