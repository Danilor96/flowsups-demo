import { create } from 'zustand';
import { Call, Device } from '@twilio/voice-sdk';
import { CallerIdentityAndData } from '@/app/libs/definitions';

interface TwilioDevice {
  call: Call | null;
  device: Device | null;
  token: string | null;
  incomingCallsArray:
    | {
        conferenceName: string;
        conferenceSid: string;
        isActive: boolean;
        phoneNumber?: string;
        clientName?: string;
        bdcName?: string;
        bdcPhoneNumber?: string;
        sellerName?: string;
        sellerPhoneNumber?: string;
      }[]
    | null;
  firstCallTimeoutId: NodeJS.Timeout | null;
  initializeDevice: (email: string) => Promise<void>;
  setIncomingCallsArray: (conferenceSid: string, conferenceName: string) => Promise<void>;
  setActiveCall: (conferenceSid: string) => void;
  getIncomingCallIdentity: (phoneNumber: string) => Promise<CallerIdentityAndData>;
  clearConferenceSid: (conferenceSid: string) => void;
  setCurrentCallObject: (call: Call | null) => void;
  cancelFirstCallTimeout: () => void;
}

export const useTwilioStoreTwo = create<TwilioDevice>((set, get) => ({
  call: null,
  device: null,
  token: null,
  incomingCallsArray: null,
  firstCallTimeoutId: null,
  initializeDevice: async (email) => {
    const res = await fetch(`/api/twilioDeviceToken/${email}`, { cache: 'no-store' });

    const { token } = await res.json();

    const device = new Device(token);

    device.on('registering', () => {
      console.log('Registering');
    });

    device.on('registered', () => {
      console.log(`Device ${device.identity}: ${device.state}`);
    });

    device.on('error', (twilioError, call) => {
      console.log(twilioError);
      set({ call: null });
    });

    device.on('incoming', async (call: Call) => {
      console.log('Llamada entrante!', call);

      set({ call });

      return;
    });

    device.on('tokenWillExpire', async () => {
      const newToken = await fetch(`/api/twilioDeviceToken/${email}`, { cache: 'no-store' });
      const { token } = await newToken.json();

      device.updateToken(token);

      console.log('Token Renovado!');
    });

    device.register();

    set({ device, token });
  },
  setIncomingCallsArray: async (conferenceSid, conferenceName) => {
    const { incomingCallsArray } = get();
    const { setActiveCall, getIncomingCallIdentity } = get();

    const newIncomingCallsArray = incomingCallsArray ?? [];

    const phoneNumber = conferenceName.split('_')[0];

    const callerIdentity = await getIncomingCallIdentity(phoneNumber);

    const isAlreadyInArray = newIncomingCallsArray.some(
      (call) => call.conferenceSid === conferenceSid,
    );

    if (!isAlreadyInArray) {
      const callerFullName = `${callerIdentity?.first_name ?? ''} ${
        callerIdentity?.last_name ?? ''
      }`;

      const bdcName = `${callerIdentity?.bdc?.name ?? ''} ${callerIdentity?.bdc?.last_name ?? ''}`;

      const sellerName = `${callerIdentity?.seller?.name ?? ''} ${
        callerIdentity?.seller?.last_name ?? ''
      }`;

      newIncomingCallsArray.push({
        conferenceName,
        conferenceSid,
        isActive: false,
        clientName: callerFullName,
        phoneNumber: phoneNumber,
        bdcName: bdcName,
        bdcPhoneNumber: callerIdentity?.bdc?.mobile_phone ?? undefined,
        sellerName: sellerName,
        sellerPhoneNumber: callerIdentity?.seller?.mobile_phone ?? undefined,
      });

      set({ incomingCallsArray: newIncomingCallsArray });

      if (newIncomingCallsArray.length === 1) {
        const timeoutId = setTimeout(() => {
          console.log('Ejecutando función 7 segundos después de la primera llamada');
          // Aquí puedes llamar a tu función personalizada
        }, 7000);

        setActiveCall(conferenceSid);

        set({ firstCallTimeoutId: timeoutId });
      }
    }
  },
  setActiveCall: (conferenceSid) => {
    const { incomingCallsArray } = get();

    if (incomingCallsArray) {
      const updateCalls = incomingCallsArray.map((call) => ({
        ...call,
        isActive: call.conferenceSid === conferenceSid,
      }));

      set({ incomingCallsArray: updateCalls });
    }
  },
  getIncomingCallIdentity: async (phoneNumber) => {
    const data: CallerIdentityAndData = await (
      await fetch(`/api/incomingCallerIdentity/${phoneNumber}`, { cache: 'no-store' })
    ).json();

    return data;
  },
  clearConferenceSid: (conferenceSid) => {
    set((prevState) => ({
      ...prevState,
      incomingCallsArray: prevState.incomingCallsArray?.filter(
        (callInfo) => callInfo.conferenceSid !== conferenceSid,
      ),
    }));
  },
  setCurrentCallObject: (call) => {
    set({ call });
  },
  cancelFirstCallTimeout: () => {
    const { firstCallTimeoutId } = get();

    if (firstCallTimeoutId) {
      clearTimeout(firstCallTimeoutId);
      console.log('Timeout cancelado');
      set({ firstCallTimeoutId: null });
    }
  },
}));
