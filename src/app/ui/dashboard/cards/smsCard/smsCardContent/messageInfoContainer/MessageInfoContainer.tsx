import { CustomerChatIcon, SmsFileAttachmentIcon } from '&/icons/Icons';
import { CustomerName } from '&/miscellaneous/customerName/CustomerName';
import { CustomerStatusComponent } from '&/dashboard/cards/smsCard/smsCardContent/messageInfoContainer/customerStatusComponent/CustomerStatusComponent';
import { NoReadMessageCount } from '&/dashboard/cards/smsCard/smsCardContent/messageInfoContainer/noReadMessageCount/NoReadMessageCount';
import { LastMessageContainer } from '&/dashboard/cards/smsCard/smsCardContent/messageInfoContainer/lastMessageContainer/LastMessageContainer';
import { MessageDate } from '&/dashboard/cards/smsCard/smsCardContent/messageInfoContainer/messageDate/MessageDate';

export function MessageInfoContainer({
  customerName,
  customerId,
  customerStatus,
  noReadMessageCount,
  lastMessage,
  messageDate,
  file,
}: {
  customerName: string;
  customerId: number | null;
  customerStatus: string;
  noReadMessageCount: number;
  lastMessage: string;
  messageDate: Date | null;
  file?: boolean;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <section className="w-full h-fit flex flex-col gap-[1vh] px-[1vw] py-[1vh]">
      <article className="w-fit h-fit flex flex-row justify-center items-center gap-[2vw]">
        <aside className="w-fit h-fit flex flex-row justify-center items-center gap-[0.5vw]">
          <CustomerChatIcon />
          <CustomerName customer={customerName} customerId={customerId} />
        </aside>
        <CustomerStatusComponent customerStatus={customerStatus} />
        {noReadMessageCount > 0 && <NoReadMessageCount noReadMessageCount={noReadMessageCount} />}
      </article>
      <article className="w-fit h-fit flex flex-row justify-center items-center gap-[1vw]">
        <LastMessageContainer lastMessage={lastMessage} file={file} />
        <MessageDate messageDate={messageDate} />
        {file && <SmsFileAttachmentIcon width={2} height={4.5} />}
      </article>
    </section>
  );
}
