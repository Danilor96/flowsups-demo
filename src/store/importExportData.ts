import { create } from 'zustand';
import * as XLSX from 'xlsx';
import { messagesStore } from '@/store/adminDashboard';
import { VehiclesData } from '@/app/libs/definitions';

export interface Import {
  dataToImport: any[] | undefined;
  buttonIdentity: string;
  filename: string;
  apiUrl: string;
  disabledBtn: boolean;
  handleImport: (event: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => Promise<void>;
  handleImportButton: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  setButtonIdentity: (identity: string) => void;
  clearDataToImport: () => void;
  setApiUrl: (apiUrl: string) => void;
}

export const importStore = create<Import>((set, get) => ({
  dataToImport: undefined,
  buttonIdentity: '',
  filename: '',
  apiUrl: '',
  disabledBtn: false,
  handleImport: async (e) => {
    const eventType = e.type;
    let files;

    if (eventType === 'change') {
      const target = e.target as HTMLInputElement;
      files = target.files;
    }

    if (eventType === 'drop') {
      const dragEvent = e as React.DragEvent;
      files = dragEvent.dataTransfer.files;
    }

    if (files && files.length > 0) {
      const file = files[0];
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      set({ filename: file.name });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

      let newData: { [key: string]: any }[] = [];

      for (let i = 0; i < jsonData.length; i++) {
        const obj = jsonData[i];

        const modifiedObj: { [key: string]: any } = {};

        for (const [key, value] of Object.entries(obj)) {
          const splittedKey = key
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .split(' ');

          const newKey = splittedKey
            .map((el, index) => {
              if (index === 0) {
                return el;
              }
              return el.charAt(0).toUpperCase() + el.slice(1);
            })
            .join('');

          modifiedObj[newKey] = value;
        }

        newData[i] = modifiedObj;
      }

      set({ dataToImport: newData });
    }
  },
  handleImportButton: async (e) => {
    const { dataToImport, apiUrl } = get();

    const { setMessages } = messagesStore.getState();

    if (dataToImport && dataToImport.length > 0 && apiUrl) {
      set({ disabledBtn: true });

      try {
        let response: any;

        for (let i = 0; i < dataToImport.length; i += 50) {
          const batch = dataToImport.slice(i, i + 50);

          response = await fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify(batch),
          });
        }

        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
          const res = await response.json();

          if (res.successMessage) {
            setMessages(undefined, res.successMessage);
            set({ filename: '' });
            set({ dataToImport: undefined });
            set({ disabledBtn: false });
          }

          if (res.serverError) {
            setMessages(res.serverError);
            set({ disabledBtn: false });
          }
        } else {
          const textResponse = await response.text();

          console.log(textResponse);

          setMessages('An error occurred');
          set({ disabledBtn: false });
        }
      } catch (error) {
        console.log(error);

        setMessages('An error occurred');
        set({ disabledBtn: false });
      }
    }
  },
  setButtonIdentity: (identity) => {
    set({ buttonIdentity: identity });
  },
  setApiUrl: (apiUrl) => {
    set({ apiUrl: apiUrl });
  },
  clearDataToImport: () => {
    set({ dataToImport: undefined, apiUrl: '', filename: '' });
  },
}));

export interface Export {
  apiUrl: string;
  handleButton: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  setExportApiUrl: (apiUrl: string) => void;
}

export const exportStore = create<Export>((set, get) => ({
  apiUrl: '',
  handleButton: async (e) => {
    const { identity } = e.currentTarget.dataset;

    if (identity === 'export') {
      const { apiUrl } = get();

      if (apiUrl) {
        const data: VehiclesData = await (await fetch(apiUrl)).json();

        if (data) {
          const workbook = XLSX.utils.book_new();

          const sheet = XLSX.utils.json_to_sheet(data);

          XLSX.utils.book_append_sheet(workbook, sheet, `Inventory`);

          const colWidth = [15, 15, 15, 15, 15, 15, 15, 15];

          let applyWidth: any[] = [];

          colWidth.forEach((el) => {
            applyWidth.push({
              width: el,
            });
          });

          sheet['!cols'] = applyWidth;

          XLSX.writeFile(
            workbook,
            `Inventory_${new Date().toLocaleString('en-US', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}_${new Date().toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
              hour12: false,
            })}.xlsx`,
          );
        }
      }
    }
  },
  setExportApiUrl: (apiUrl) => {
    set({ apiUrl: apiUrl });
  },
}));
