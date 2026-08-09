export enum CallDirection {
  inbound = 1,
  outbound = 2,
}

export interface NotesData {
  created_by: {
    name: string | null;
    last_name: string | null;
  } | null;
  created_at: Date;
  note: string;
}

export interface InboundCallDetail {
  customerName: string;
  customerId: number;
  notes: NotesData[] | undefined;
  inbound: boolean;
  followUp: Date | null;
  callMadeAt: Date;
  customerStatus: string;
}

export const extractIds = async (idsString: string) => {
  let idsArray: number[] = [];

  if (idsString) {
    const parsedArray = idsString.split(',');

    if (Array.isArray(parsedArray)) {
      idsArray = parsedArray.map(Number);
    }
  }

  return idsArray;
};
