import { SmsDeliveredDoubleCheckIcon, SmsSentCheckIcon } from '@/app/ui/icons/Icons';

export function UserNameAndDateContainer({
  name,
  date,
  sending,
  sent,
  delivered,
  failed,
  clientPhoneNumber,
}: {
  name: string;
  date: Date | null;
  sending?: boolean;
  sent: boolean;
  delivered: boolean;
  failed: boolean;
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
      minute: '2-digit',
    });
    return formattedDate;
  };

  return (
    <aside className="w-[95%]/ w-fit flex flex-col flex-wrap justify-start/ items-start/ gap-[0.3vw] ml-[1.2vw]">
      <p className="w-fit text-[1.5vh] font-semibold leading-[1.805556vh] text-[#959595] ">
        <b>{name + ' ' + `${clientPhoneNumber ? `to (${clientPhoneNumber})` : ''}` }</b>
      </p>
      <p
        className={`relative w-fit text-[1.5vh] leading-[1.805556vh] text-[#959595] ${
          (sending || !sent) && 'animate-pulse'
        }`}
      >
        {sending ? 'Sending' : !sent ? 'Sending' : date ? handleDate(date) : 'Sending'}

        {sent && !delivered && !failed && (
          <span className="absolute top-0 right-[-1.5vw] w-fit h-fit">
            <SmsSentCheckIcon width={1.5} height={2} />
          </span>
        )}
        {delivered && !failed && (
          <span className="absolute top-[-0.25vh] right-[-1.5vw] w-fit h-fit">
            <SmsDeliveredDoubleCheckIcon width={1.5} height={2.5} />
          </span>
        )}
                { failed && !delivered && (
          <span className="text-[1.5vh] ml-[0.5vw] font-semibold w-fit h-fit text-[#B94343]">
            Failed
          </span>
        )}
      </p>
    </aside>
  );
}
