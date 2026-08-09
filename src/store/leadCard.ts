import { create } from 'zustand';
import {
  NoteSmsIcon,
  NoteTaskIcon,
  NoteCallIcon,
  AppointmentIcon,
  NoteOtherIcon,
} from '&/icons/Icons';

interface LeadCard {
  leadIcon: (leadId: number) => React.ReactNode;
  leadTitle: (leadId: number, lead?: string) => string;
  callIdToAddNote?: number;
  setCallIdToAddNote: (id?: number) => void;
}

export const leadCardStore = create<LeadCard>((set, get) => ({
  leadIcon: (leadId) => {
    const smsIcon = [4, 7, 9];
    const taskIcon = [3, 17];
    const callIcon = [5, 6];
    const appointmentIcon = [19];

    if (smsIcon.includes(leadId)) {
      return NoteSmsIcon({});
    }

    if (taskIcon.includes(leadId)) {
      return NoteTaskIcon({});
    }

    if (callIcon.includes(leadId)) {
      return NoteCallIcon({});
    }

    if (appointmentIcon.includes(leadId)) {
      return AppointmentIcon({ width: 1.3, height: 3.2 });
    }

    return NoteOtherIcon({});
  },
  leadTitle: (leadId, lead) => {
    const smsTitle = [4, 7, 9];
    const taskTitle = [3, 17];
    const callTitle = [5, 6];

    if (smsTitle.includes(leadId)) {
      return 'SMS:';
    }

    if (taskTitle.includes(leadId)) {
      return 'Task:';
    }

    if (callTitle.includes(leadId)) {
      return 'Call:';
    }

    if (lead) {
      return `${lead.replace(lead[0], lead[0].toUpperCase())}:`;
    }

    return 'Other:';
  },
  callIdToAddNote: undefined,
  setCallIdToAddNote: (id) => {
    set({ callIdToAddNote: id });
  },
}));
