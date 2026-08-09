import { create } from 'zustand';

interface StringFormat {
  removeSpecialCharacters: (val: string) => string;
}

export const stringFormatStore = create<StringFormat>((set) => ({
  removeSpecialCharacters: (val) => {
    const regex = /[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s]/g;

    return val.replace(regex, '');
  },
}));
