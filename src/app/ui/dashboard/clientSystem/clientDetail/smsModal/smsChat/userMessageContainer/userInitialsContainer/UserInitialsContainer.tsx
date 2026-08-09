export function UserInitialsContainer({ name }: { name: string }) {
  // ----- global states -----

  // ----- local states -----

  const handleNameInitials = (name: string) => {
    const nameArray = name.split(' ');

    const initials = `${nameArray[0].slice(0, 1)}${nameArray[1].slice(0, 1)}`;

    return initials.toUpperCase();
  };

  return (
    <aside className="w-[15%]">
      <p className="w-[2.523958vw] h-[2.523958vw] flex justify-center items-center rounded-full bg-[#00A78B] text-[1.851852vh] font-normal leading-[1.805556vh] text-[#FFFFFF]">
        {handleNameInitials(name)}
      </p>
    </aside>
  );
}
