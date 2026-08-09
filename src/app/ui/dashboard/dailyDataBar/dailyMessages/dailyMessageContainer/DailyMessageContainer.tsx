import { MessageBubleIcon } from '&/icons/Icons';
import { UserStatus } from '&/dashboard/dailyDataBar/dailyMessages/dailyMessageContainer/userStatus/UserStatus';
import { LastMessageBubble } from '&/dashboard/dailyDataBar/dailyMessages/dailyMessageContainer/lastMessageBubble/LastMessageBubble';
import { CustomerName } from '&/miscellaneous/customerName/CustomerName';

export function DailyMessageContainer({
  lastMessage,
  name,
  status,
  customerId,
}: {
  status: string;
  name: string;
  lastMessage: string;
  customerId: number | null;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <div className="w-fit h-fit flex flex-col justify-center items-center gap-[2vh] mx-auto px-[0.5vw] py-[1.5vh]">
      <aside className="w-fit h-fit flex flex-row justify-center items-center gap-[1.2vw]">
        <article className="w-fit h-fit flex flex-row justify-center items-center gap-[0.7vw]">
          <MessageBubleIcon />
          <CustomerName customer={name} customerId={customerId} fontSize={2.1296296} />
        </article>
        <UserStatus status={status} />
      </aside>
      <LastMessageBubble lastMessage={lastMessage} />
    </div>
  );
}
