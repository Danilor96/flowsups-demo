import {NoteSmsIcon, NoteTaskIcon,NoteCallIcon,AppointmentIcon,NoteOtherIcon, NoteIcon, LostIcon, SoldCustomerIcon,} from '&/icons/Icons';
import React from 'react';
import { subcategoryToGroupMap } from '../../categoriesIdMap';

const leadIcon = (leadId: number) => {
  const leadIconMap: Record<string, React.ReactNode> = {
    Note: NoteTaskIcon({}),
    Call: NoteCallIcon({}),
    SMS: NoteSmsIcon({}),
    Email: NoteSmsIcon({}),
    Lost: LostIcon({ width : 1.5, height: 3.2 }),
    // Sold: SoldCustomerIcon(),
    // 'Task': NoteTaskIcon({}),
    Appointment: AppointmentIcon({width: 1.5, height: 3.2}),
    Other: NoteOtherIcon({}),
  };
  const categoryGroup = subcategoryToGroupMap[leadId] || 'Other';
  return leadIconMap[categoryGroup] || NoteOtherIcon({});
};

export function LeadIcon({ leadId }: { leadId: number }) {
  // ----- global states -----
  // ----- local states -----

  return (
    <aside className="w-[3.4375vw] h-[3.4375vw] border-[0.104167vw] border-[#00A78B] rounded-full flex justify-center items-center">
      {leadIcon(leadId)}
    </aside>
  );
}
