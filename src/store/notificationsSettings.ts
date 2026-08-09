import {
  EmailNameDisplayed,
  IncomingCallsOptions,
  LimitWarningRecipients,
  SmsTemplate,
  VoiceAndEmailsData,
} from '@/app/libs/definitions';
import { create } from 'zustand';

export interface VoiceAndSms {
  forwardIncomingCalls: IncomingCallsOptions;
  displayedName: EmailNameDisplayed;
  limitWarningRecipients: LimitWarningRecipients;
  voiceAndEmailsData: VoiceAndEmailsData;
  getVoiceAndEmailsData: () => Promise<void>;
  deleteWarningRecipient: (id: string) => Promise<string>;
  getLimitWarningRecipients: () => Promise<void>;
  getForwardIncomingCalls: () => Promise<void>;
  getDisplayedName: () => Promise<void>;
}

export const voiceAndSmsStore = create<VoiceAndSms>((set) => ({
  forwardIncomingCalls: undefined,
  displayedName: undefined,
  limitWarningRecipients: undefined,
  voiceAndEmailsData: undefined,
  getVoiceAndEmailsData: async () => {
    const data = await (await fetch('/api/settings/voiceAndEmails')).json();

    set((state) => ({
      ...state,
      voiceAndEmailsData: data,
    }));
  },
  deleteWarningRecipient: async (id) => {
    return await (
      await fetch(`/api/settings/voiceAndEmails/limitWarningRecipients/${id}`, { method: 'DELETE' })
    ).json();
  },
  getLimitWarningRecipients: async () => {
    const data = await (await fetch('/api/settings/voiceAndEmails/limitWarningRecipients')).json();

    set((state) => ({
      ...state,
      limitWarningRecipients: data,
    }));
  },
  getForwardIncomingCalls: async () => {
    const data = await (await fetch('/api/settings/voiceAndEmails/forwardIncomingCalls')).json();

    set((state) => ({
      ...state,
      forwardIncomingCalls: data,
    }));
  },
  getDisplayedName: async () => {
    const data = await (await fetch('/api/settings/voiceAndEmails/nameDisplayedEmail')).json();

    set((state) => ({
      ...state,
      displayedName: data,
    }));
  },
}));

export interface SingleSmsTemplate {
  smsTemplate: SmsTemplate;
  getSingleSmsTemplate: (el: SmsTemplate) => void;
  clearSmsTemplate: () => void;
}

export const singleSmsTemplateStore = create<SingleSmsTemplate>((set) => ({
  smsTemplate: undefined,
  getSingleSmsTemplate: (el) => {
    set({ smsTemplate: el });
  },
  clearSmsTemplate: () => {
    set({ smsTemplate: undefined });
  },
}));
