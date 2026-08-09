import { LeadBackground } from './leadBackground/LeadBackground';
import { LeadCreator } from './leadCreator/LeadCreator';
import { LeadDate } from './leadDate/LeadDate';
import { LeadIcon } from './leadIcon/LeadIcon';
import { LeadText } from './leadText/LeadText';
import { LeadTitle } from './leadTitle/LeadTitle';

export function LeadCard({
  leadId,
  createdAt,
  text,
  name,
  lead,
  fromLead,
}: {
  leadId: number;
  createdAt?: Date;
  text: string;
  name: string;
  lead?: string;
  fromLead?: string;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <LeadBackground>
      <article className="flex flex-row gap-[1.458333vw]">
        <div className="w-fit">
          <LeadIcon leadId={leadId} />
        </div>
        <div className="w-fit flex flex-col gap-[0.65vh]">
          <LeadTitle leadId={leadId} lead={lead} />
          {text !== fromLead && <LeadText text={text} />}
        </div>
      </article>
      <article className="flex flex-row gap-[1.015625vw]">
        <LeadCreator name={name} />
        <LeadDate date={createdAt} />
        {/* <span className='text-[1.7vh] text-[#00A78B] font-bold leading-[1.805556.vh]'>{fromLead}</span> */}
      </article>
    </LeadBackground>
  );
}
