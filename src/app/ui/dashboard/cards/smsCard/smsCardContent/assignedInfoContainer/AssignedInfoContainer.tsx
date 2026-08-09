import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';

export function AssignedInfoContainer({
  bdcAssigned,
  sellerAssigned,
}: {
  bdcAssigned: string;
  sellerAssigned: string;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <section className="w-full h-fit flex flex-col justify-center items-center gap-[2vh]">
      <Paragraph color="#FFF" fontSize={1.851852} fontWeight={700}>
        Assigned to
      </Paragraph>
      <aside className="w-fit h-fit flex-col justify-center items-center">
        <article className="w-fit h-fit flex flex-row justify-center items-center gap-[0.3vw]">
          <Paragraph fontSize={1.8} color="#FFF" fontWeight={600}>
            Bdc: <span className="font-normal">{bdcAssigned || 'No bdc assigned'}</span>
          </Paragraph>
        </article>
        <article className="w-fit h-fit flex flex-row justify-center items-center gap-[0.3vw]">
          <Paragraph fontSize={1.8} color="#FFF" fontWeight={600}>
            Sales rep:{' '}
            <span className="font-normal">{sellerAssigned || 'No sales rep assigned'}</span>
          </Paragraph>
        </article>
      </aside>
    </section>
  );
}
