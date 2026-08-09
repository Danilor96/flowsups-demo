import { create } from 'zustand';

export interface PdfData {
  pdfData: string[][] | undefined;
  setPdfData: (data: string[][]) => void;
  clearPdfData: () => void;
  pdfName: string;
  setPdfName: (name: string) => void;
}

export const pdfDataStore = create<PdfData>((set) => ({
  pdfData: undefined,
  setPdfData: (data) => {
    set({ pdfData: data });
  },
  clearPdfData: () => {
    set({ pdfData: undefined });
  },
  pdfName: '',
  setPdfName: (name) => {
    set({ pdfName: name });
  },
}));
