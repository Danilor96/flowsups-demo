export function CustomerNameAndDateContainer({
  name,
  clientPhoneNumber,
  date
}: {
  name: string;
  date: Date | null;
  clientPhoneNumber: string | null;
}) {
  // ----- global states -----

  // ----- local states -----

  const handleDate = (date: Date) => {
    const formattedDate = new Date(date).toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    return formattedDate;
  };

  return (
    <aside className="w-[95%] flex flex-row flex-wrap justify-start ml-8 items-end gap-[0.3vw]">
      <p className="w-fit text-[1.5vh] font-semibold leading-[1.805556vh] text-[#959595]">
        <b>{name + ' ' + `${clientPhoneNumber ? `(${clientPhoneNumber})` : ''}`}</b>
      </p>
      <p className="w-fit text-[1.5vh] font-semibold/ leading-[1.805556vh] text-[#959595]">
        {date && handleDate(date)}
      </p>
    </aside>
  );
}
