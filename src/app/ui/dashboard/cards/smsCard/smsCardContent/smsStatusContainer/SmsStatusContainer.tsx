import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { Status } from '&/dashboard/cards/smsCard/smsCardContent/smsStatusContainer/status/Status';

export function SmsStatusContainer({ smsStatus, readBy }: { smsStatus: number; readBy: number[] }) {
  // ----- global states -----

  // ----- local states -----

  return (
    <section className="w-full h-fit flex flex-col justify-center items-center gap-[2vh]">
      <Paragraph color="#FFF" fontSize={1.851852} fontWeight={700}>
        SMS Status
      </Paragraph>
      <aside className="w-fit h-fit flex justify-center items-center">
        <Status status={smsStatus} readBy={readBy} />
      </aside>
    </section>
  );
}
