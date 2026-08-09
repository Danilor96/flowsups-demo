import { LeadInfoColumn as LeadInfoColumnType } from '@/app/api/reports/storeReport/creditApp/types';

export function LeadInfoColumn({ lead }: { lead: LeadInfoColumnType }) {
  // ----- global states -----

  // ----- local states -----

  return (
    <div className="w-fit flex flex-row justify-start items-start gap-[0.5vw]">
      <aside>
        <p>
          <span className="font-semibold">Status:</span> {` ${lead.status}`}
        </p>
        <p>
          <span className="font-semibold">Credit app completed:</span>
          {` ${lead.creditAppCompleted}`}
        </p>
        <p>
          <span className="font-semibold">Sales rep:</span> {` ${lead.salesRep}`}
        </p>
        <p>
          <span className="font-semibold">BDC rep:</span> {` ${lead.bdc}`}
        </p>
        <p>
          <span className="font-semibold">Manager:</span> {` ${lead.manager}`}
        </p>
      </aside>
      <aside>
        <p>
          <span className="font-semibold">Source:</span> {` ${lead.source}`}
        </p>
        <p>
          <span className="font-semibold">Type:</span> {` ${lead.type}`}
        </p>
      </aside>
    </div>
  );
}
