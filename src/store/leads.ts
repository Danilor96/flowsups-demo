import { Leads } from '@/app/libs/definitions';
import { create } from 'zustand';

interface LeadsStore {
  leads: Leads | undefined;
  currentLead: string;
  cheatCountForFetch: number;
  currentController: AbortController | null;
  setCheatCountForFetch: (count: number) => void;
  setCurrentLead: (leadId?: string | null) => void;
  getLeads: (customerId: number | null) => Promise<void>;
}

export const leadsStore = create<LeadsStore>((set, get) => ({
  leads: undefined,
  currentLead: '',
  cheatCountForFetch: 0,
  currentController: null,
  setCheatCountForFetch: (count) => {
    set({ cheatCountForFetch: count });
  },
  setCurrentLead: (leadId) => {
    if (leadId) {
      set({ currentLead: leadId });
    } else {
      const controller = get().currentController;
      if (controller) controller.abort();
      set({ currentLead: '', currentController: null });
    }
  },
  getLeads: async (customerId) => {
    const previousController = get().currentController;
    if (previousController) {
      previousController.abort();
    }

    if (!customerId) {
      set({ leads: undefined });

      return;
    }

    const controller = new AbortController();
    set({ currentController: controller });

    try {
      const res = await fetch(`/api/lead/${customerId}`, { signal: controller.signal });

      if (!res.ok) throw new Error('Fetching error');

      const json = await res.json();

      set({ leads: json, currentController: null });
    } catch (error: any) {
      if (error.name === 'AbortError') {
      } else {
        console.error('Error en fetch:', error);
        set({ currentController: null });
      }
    }
  },
}));
