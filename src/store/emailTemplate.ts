import { EmailTemplate, Letterhead, SingleEmailTemplate } from '@/app/libs/definitions';
import { create } from 'zustand';

interface LetterheadData {
  letterhead: Letterhead;
  getLetterhead: () => Promise<void>;
}

export const letterheadStore = create<LetterheadData>((set) => ({
  letterhead: undefined,
  getLetterhead: async () => {
    const data = await (await fetch('/api/letterhead')).json();

    set((state) => ({
      ...state,
      letterhead: data,
    }));
  },
}));

interface EmailTemplateData {
  emailTemplates: EmailTemplate;
  getEmailTemplates: () => Promise<void>;
}

export const emailTemplateStore = create<EmailTemplateData>((set) => ({
  emailTemplates: undefined,
  getEmailTemplates: async () => {
    const data = await (await fetch('/api/settings/emailTemplate')).json();

    set((state) => ({
      ...state,
      emailTemplates: data,
    }));
  },
}));

interface SingleEmailTemplateData {
  emailTemplate: SingleEmailTemplate;
  getSingleEmailTemplate: (templateId: string) => Promise<void>;
  clearSingleTemplate: () => void;
}

export const singleEmailTemplateStore = create<SingleEmailTemplateData>((set) => ({
  emailTemplate: undefined,
  getSingleEmailTemplate: async (templateId) => {
    const data = await (await fetch(`/api/settings/emailTemplate/${templateId}`)).json();

    set((state) => ({
      ...state,
      emailTemplate: data,
    }));
  },
  clearSingleTemplate: () => {
    set({ emailTemplate: undefined });
  },
}));
