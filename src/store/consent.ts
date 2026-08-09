import { create } from 'zustand';

interface Consent {
  loadingConsentView: boolean;
  consentMssg: string;
  isConsent: boolean;
  loadingConsent: boolean;
  setLoadingConsentView: (loading: boolean) => void;
  setConsentMssg: (message: string) => void;
  setIsConsent: (consent: boolean) => void;
  setLoadingConsent: (loading: boolean) => void;
}

export const consentStore = create<Consent>((set) => ({
  loadingConsentView: false,
  consentMssg: '',
  isConsent: false,
  loadingConsent: false,
  setLoadingConsentView: (loading) => {
    set({ loadingConsentView: loading });
  },
  setConsentMssg: (message) => {
    set({ consentMssg: message });
  },
  setIsConsent: (consent) => {
    set({ isConsent: consent });
  },
  setLoadingConsent: (loading) => {
    set({ loadingConsent: loading });
  },
}));
