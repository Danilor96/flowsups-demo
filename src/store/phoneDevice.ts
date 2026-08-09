import { create } from 'zustand';
import { Device, Call } from '@twilio/voice-sdk';
import { modalWindowStore } from '@/store/adminDashboard';
import { IncomingCallCustomerIdentity } from '@/app/libs/definitions';

export interface IncomingCall {
  conferenceName: string;
  conferenceSid: string;
  isActive: boolean;
  phoneNumber: string;
  incomingCallIdentity: IncomingCallCustomerIdentity;
  transferInProgress: boolean;
}

export interface TwilioDevice {
  transferedConferencesNames: string[];
  device: Device | null;
  token: string | null;
  call: Call | null;
  callSid: string;
  isDeviceReady: boolean;
  callIncoming: boolean;
  callTiming: number;
  callInProgress: boolean;
  outgoingCall: boolean;
  showDashboardCallHandler: boolean;
  firstCallTimeoutId: NodeJS.Timeout | null;
  trasnferInProgressOrCompleted: boolean;
  creatingCall: boolean;
  callTimingInterval: NodeJS.Timeout | null;
  callAutoAcceptTimeout: NodeJS.Timeout | null;
  conferenceName: string | null;
  incomingCallsArray: IncomingCall[];
  outgoingCallData: {
    customer: string;
    customerMobilePhone: string;
    salesRep: string;
    salesRepMobilePhone: string;
    bdc: string;
    bdcMobilePhone: string;
  } | null;
  setOutgoingCallData: (
    customer: string,
    customerMobilePhone: string,
    salesRep: string,
    salesRepMobilePhone: string,
    bdc: string,
    bdcMobilePhone: string,
  ) => void;
  clearOutgoingData: () => void;
  setOutgoingCall: (outgoingCall: boolean) => void;
  setActiveCall: (conferenceSid: string) => void;
  conferenceSid: string | null;
  deleteTheUserThatResponseTheCallLate: (
    conferenceSid: string,
    userEmail?: string,
    userMobilePhoneNumber?: string,
  ) => Promise<void>;
  setConferenceSid: (conferenceSid: string | null) => void;
  getIncomingCallIdentity: (phoneNumber: string) => Promise<IncomingCallCustomerIdentity>;
  setIncomingCallsArray: (
    conferenceName: string,
    conferenceSid: string,
    phoneNumber: string,
  ) => Promise<void>;
  clearAnIncomingCallInTheArray: (conferenceName: string) => void;
  conferenceTransfer: (
    conferenceName: string,
    conferenceSid: string,
    salesrepnum?: string,
    bdcnum?: string,
  ) => Promise<void>;
  setConferenceName: (conferenceName: string | null) => void;
  resetCallTiming: () => void;
  startCallAutoAcceptTimeout: (salesrepnum?: string, bdcnum?: string) => Promise<void>;
  callTransferAction: (salesrepnum?: string, bdcnum?: string) => Promise<void>;
  handleTransferCall: (salesrepnum?: string, bdcnum?: string) => Promise<void>;
  setShowDashboardCallHandler: (show: boolean) => void;
  initializeDevice: (email: string) => Promise<void>;
  setCallIncoming: (incoming: boolean) => void;
  setCallInProgress: (progress: boolean) => void;
  setTrasnferInProgressOrCompleted: (inProgress: boolean) => void;
  setCreatingCall: (creating: boolean) => void;
  setCurrentCall: (call: Call | null) => void;
  startCallTimingCount: () => void;
  setCallSid: (callSid: string) => void;
  returnCallTimingWithFormat: () => string;
  transferNoAnsweredConference: (
    conferenceName: string,
    conferenceSid: string,
    salesNumber?: string,
    bdcNumber?: string,
  ) => Promise<void>;
  createCallStatusInDatabase: (
    customerId?: number,
    userId?: number,
    callSid?: string,
    callDirection?: number,
    phoneNumber?: string,
  ) => Promise<void>;
  cancelFirstCallTimeout: () => void;
  disconnectCurrentTransferedCall: () => void;
  setTransferedConferencesNames: (conferenceName: string) => void;
  clearTransferedConferencesNames: (conferenceName: string) => void;
  setCallArray: (callArray: IncomingCall[]) => void;
}

export const useTwilioStore = create<TwilioDevice>((set, get) => ({
  transferedConferencesNames: [],
  device: null,
  token: null,
  call: null,
  callInProgress: false,
  isDeviceReady: false,
  callIncoming: false,
  trasnferInProgressOrCompleted: false,
  creatingCall: false,
  firstCallTimeoutId: null,
  callSid: '',
  callTiming: 0,
  outgoingCall: false,
  incomingCallIdentity: null,
  callTimingInterval: null,
  callAutoAcceptTimeout: null,
  showDashboardCallHandler: false,
  conferenceName: null,
  incomingCallsArray: [
    // {
    //   conferenceName: 'conference-1',
    //   conferenceSid: 'conference-1-sid',
    //   isActive: true,
    //   transferInProgress: false,
    //   phoneNumber: '',
    //   incomingCallIdentity: null,
    // },
    // {
    //   conferenceName: 'conference-1',
    //   conferenceSid: 'conference-1-sid',
    //   isActive: true,
    //   transferInProgress: false,
    //   phoneNumber: '',
    //   incomingCallIdentity: {
    //     bdc: {
    //       id: 1,
    //       name: 'El',
    //       last_name: 'bdc',
    //       // mobile_phone: '',
    //       mobile_phone: '2243109214',
    //     },
    //     seller: {
    //       id: 1,
    //       name: 'El',
    //       last_name: 'seller',
    //       mobile_phone: '',
    //     },
    //     first_name: '',
    //     last_name: 'Rom',
    //     id: 1,
    //     mobile_phone: '',
    //   },
    // },
    // {
    //   conferenceName: 'conference-2',
    //   conferenceSid: 'conference-2-sid',
    //   isActive: false,
    //   transferInProgress: false,
    //   phoneNumber: '',
    //   incomingCallIdentity: {
    //     bdc: {
    //       id: 1,
    //       name: 'El',
    //       last_name: 'bdc',
    //       mobile_phone: '',
    //     },
    //     seller: {
    //       id: 1,
    //       name: 'El',
    //       last_name: 'seller',
    //       mobile_phone: '',
    //     },
    //     first_name: '',
    //     last_name: 'Rom',
    //     id: 1,
    //     mobile_phone: '',
    //   },
    // },
    // {
    //   conferenceName: 'conference-3',
    //   conferenceSid: 'conference-3-sid',
    //   isActive: false,
    //   phoneNumber: '',
    //   transferInProgress: false,
    //   incomingCallIdentity: {
    //     bdc: {
    //       id: 1,
    //       name: 'El',
    //       last_name: 'bdc',
    //       mobile_phone: '',
    //     },
    //     seller: {
    //       id: 1,
    //       name: 'El',
    //       last_name: 'seller',
    //       mobile_phone: '',
    //     },
    //     first_name: '',
    //     last_name: 'Rom',
    //     id: 1,
    //     mobile_phone: '',
    //   },
    // },
  ],
  conferenceSid: null,
  outgoingCallData: null,
  setOutgoingCallData: (
    customer,
    customerMobilePhone,
    salesRep,
    salesRepMobilePhone,
    bdc,
    bdcMobilePhone,
  ) => {
    set({
      outgoingCallData: {
        customer,
        customerMobilePhone,
        salesRep,
        salesRepMobilePhone,
        bdc,
        bdcMobilePhone,
      },
    });
  },
  transferNoAnsweredConference: async (conferenceName, conferenceSid, salesNumber, bdcNumber) => {
    const formData = new FormData();

    formData.append('conferenceSid', conferenceSid);
    salesNumber && formData.append('salesrepnum', salesNumber);
    bdcNumber && formData.append('bdcnum', bdcNumber);

    const res = await fetch(`/api/transferNoAnsweredConference/${conferenceName}`, {
      method: 'POST',
      body: formData,
    });

    const json = await res.json();
  },
  clearOutgoingData: () => {
    set({ outgoingCallData: null });
  },
  setOutgoingCall: (outgoingCall) => {
    set({ outgoingCall });
  },
  deleteTheUserThatResponseTheCallLate: async (conferenceSid, userEmail, userMobilePhoneNumber) => {
    if (conferenceSid) {
      const formData = new FormData();

      userEmail && formData.append('userEmail', userEmail);
      userMobilePhoneNumber && formData.append('userMobilePhoneNumber', userMobilePhoneNumber);

      const doFetch = await fetch(`/api/callAnsweredBy/${conferenceSid}`, {
        method: 'DELETE',
        body: formData,
      });

      const res = await doFetch.json();
    }
  },
  setConferenceSid: (conferenceSid) => {
    set({ conferenceSid });
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
  setIncomingCallsArray: async (conferenceName, conferenceSid, phoneNumber) => {
    const { incomingCallsArray, call, outgoingCall } = get();
    const { setActiveCall, getIncomingCallIdentity, conferenceTransfer } = get();

    const incomingIdentity = await getIncomingCallIdentity(phoneNumber);

    const newIncomingCallsArray = incomingCallsArray ?? [];

    const isAlreadyInArray = newIncomingCallsArray.some(
      (call) => call.conferenceSid === conferenceSid || call.conferenceName === conferenceName,
    );

    if (!isAlreadyInArray) {
      newIncomingCallsArray.push({
        conferenceName,
        conferenceSid,
        phoneNumber,
        isActive: false,
        transferInProgress: false,
        incomingCallIdentity: incomingIdentity,
      });

      set({ incomingCallsArray: newIncomingCallsArray });

      if (newIncomingCallsArray.length === 1 && !call && !outgoingCall) {
        setActiveCall(conferenceSid);
      }
    }
  },
  clearAnIncomingCallInTheArray: (conferenceName) => {
    const { outgoingCall } = get();

    set((prevState) => {
      const newState = { ...prevState };

      const callIndex = newState.incomingCallsArray.findIndex(
        (callInfo) => callInfo.conferenceName === conferenceName,
      );

      if (callIndex !== -1) {
        const newCallsArray = [...newState.incomingCallsArray];

        newCallsArray.splice(callIndex, 1);

        if (newCallsArray.length > 0 && !outgoingCall) {
          newCallsArray[0].isActive = true;
        }

        newState.incomingCallsArray = newCallsArray;
      }

      return newState;
    });
  },
  conferenceTransfer: async (conferenceName, conferenceSid, salesrepnum, bdcnum) => {
    try {
      const { incomingCallsArray } = get();
      const { clearAnIncomingCallInTheArray } = get();

      const formData = new FormData();

      const consferenceTrasnferedName = incomingCallsArray.find(
        (conf) => conf.conferenceSid === conferenceSid,
      )?.conferenceName;

      if (conferenceSid && conferenceName) {
        if (salesrepnum || bdcnum) {
          salesrepnum && formData.append('salesrepnum', salesrepnum);
          bdcnum && formData.append('bdcnum', bdcnum);
          formData.append('conferenceName', conferenceName);

          const res = await (
            await fetch(`/api/conferenceTransfer/${conferenceSid}`, {
              method: 'POST',
              body: formData,
            })
          ).json();

          if (res.successMessage) {
            if (consferenceTrasnferedName) clearAnIncomingCallInTheArray(consferenceTrasnferedName);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
  setConferenceName: (conferenceName) => {
    set({ conferenceName });
  },
  resetCallTiming: () => {
    set({ callTiming: 0 });
  },
  callTransferAction: async (salesrepnum, bdcnum) => {
    const { call, callSid } = get();
    const { setTrasnferInProgressOrCompleted } = get();

    const { closeIconedSelectOptions } = modalWindowStore.getState();

    if (call && callSid && call.parameters.CallSid && (salesrepnum || bdcnum)) {
      const formData = new FormData();

      salesrepnum && formData.append('sellerPhoneNumber', salesrepnum);
      bdcnum && formData.append('bdcPhoneNumber', bdcnum);

      setTrasnferInProgressOrCompleted(true);
      closeIconedSelectOptions();

      const res = await (
        await fetch(`/api/callTransfer/${callSid || call?.parameters.CallSid}`, {
          method: 'POST',
          body: formData,
        })
      ).json();
    }
  },
  handleTransferCall: async (salesrepnum, bdcnum) => {
    const { callInProgress, trasnferInProgressOrCompleted, callIncoming, conferenceName } = get();
    const { setTrasnferInProgressOrCompleted, conferenceTransfer } = get();

    if (callIncoming && !callInProgress && conferenceName && !trasnferInProgressOrCompleted) {
      setTrasnferInProgressOrCompleted(true);
    }
  },
  setShowDashboardCallHandler: (show) => {
    set({ showDashboardCallHandler: show });
  },
  setCallSid: (callSid) => {
    set({ callSid });
  },
  setTrasnferInProgressOrCompleted: (inProgress) => {
    set({ trasnferInProgressOrCompleted: inProgress });
  },
  setCallInProgress: (progress) => {
    set({ callInProgress: progress });
  },
  setCreatingCall: (creating) => {
    set({ creatingCall: creating });
  },
  setCallIncoming: (incoming) => {
    set({ callIncoming: incoming });
  },
  setCurrentCall: (call) => {
    set({ call });
  },
  initializeDevice: async (email) => {
    try {
      const { getIncomingCallIdentity } = get();

      const { setShowCallModal } = modalWindowStore.getState();

      const { setShowDashboardCallHandler } = get();

      const res = await fetch(`/api/twilioDeviceToken/${email}`, { cache: 'no-store' });

      const json: { token: string } = await res.json();

      const { token } = json;

      const device = new Device(token, {
        codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU],
      });

      device.on('registering', () => {
        console.log('Registering');
      });

      device.on('registered', () => {
        set({ isDeviceReady: true });
        console.log(`Device ${device.identity}: ${device.state}`);
      });

      device.on('error', (twilioError, call) => {
        console.log(twilioError);
        set({ call: null });
      });

      device.on('incoming', async (call: Call) => {
        setShowCallModal(false);

        set({ call, callIncoming: true });

        setShowDashboardCallHandler(true);

        // getIncomingCallIdentity(call.parameters.From.slice(-10));

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
    } catch (error) {
      console.log(error);
    }
  },
  returnCallTimingWithFormat: () => {
    const { callTiming } = get();

    const callTimingFormatted = new Date(callTiming * 1000).toISOString().slice(11, 19);

    return callTimingFormatted;
  },
  startCallTimingCount: () => {
    const { callTimingInterval } = get();

    if (callTimingInterval) {
      clearInterval(callTimingInterval);
      set({ callTiming: 0 });
    }

    const currentCallTiming = setInterval(() => {
      set((prevState) => ({
        ...prevState,
        callTiming: prevState.callTiming + 1,
      }));
    }, 1000);

    set({ callTimingInterval: currentCallTiming });
  },
  startCallAutoAcceptTimeout: async (salesrepnum, bdcnum) => {
    const { callAutoAcceptTimeout, callInProgress } = get();
    const { handleTransferCall } = get();

    if (callAutoAcceptTimeout) {
      clearTimeout(callAutoAcceptTimeout);
    }

    const autoAcceptTimout = setTimeout(async () => {
      if (!callInProgress) {
        await handleTransferCall(salesrepnum, bdcnum);
      }
    }, 7000);

    set({ callAutoAcceptTimeout: autoAcceptTimout });
  },
  createCallStatusInDatabase: async (customerId, userId, callSid, callDirection, phoneNumber) => {
    if (userId && callSid && callDirection) {
      const formData = new FormData();

      customerId && formData.append('customerId', customerId.toString());
      formData.append('userId', userId.toString());
      formData.append('callDirection', callDirection.toString());
      phoneNumber && formData.append('phoneNumber', phoneNumber);

      const res = await (
        await fetch(`/api/callStatus/${callSid}`, {
          method: 'POST',
          body: formData,
        })
      ).json();
    }
  },
  cancelFirstCallTimeout: () => {
    const { firstCallTimeoutId } = get();

    if (firstCallTimeoutId) {
      clearTimeout(firstCallTimeoutId);

      set({ firstCallTimeoutId: null });
    }
  },
  getIncomingCallIdentity: async (phoneNumber) => {
    const data: IncomingCallCustomerIdentity = await (
      await fetch(`/api/incomingCallerIdentity/${phoneNumber}`, { cache: 'no-store' })
    ).json();

    return data;
  },
  disconnectCurrentTransferedCall: () => {
    const { call, callTimingInterval, incomingCallsArray } = get();
    const {
      setCurrentCall,
      setCreatingCall,
      setCallInProgress,
      setTrasnferInProgressOrCompleted,
      setCallIncoming,
      setShowDashboardCallHandler,
    } = get();

    call?.disconnect();
    setCurrentCall(null);
    setCreatingCall(false);
    setCallInProgress(false);
    callTimingInterval && clearInterval(callTimingInterval);
    setTrasnferInProgressOrCompleted(false);
    set({ callTiming: 0 });

    if (incomingCallsArray.length < 1) {
      setCallIncoming(false);
      setShowDashboardCallHandler(false);
    }
  },
  setTransferedConferencesNames: (conferenceName) => {
    set((prevState) => {
      const newVal = [...prevState.transferedConferencesNames];

      if (!newVal.includes(conferenceName)) {
        newVal.push(conferenceName);
      }

      return {
        ...prevState,
        transferedConferencesNames: newVal,
      };
    });
  },
  clearTransferedConferencesNames: (conferenceName) => {
    set((prevState) => {
      const newVal = [...prevState.transferedConferencesNames];

      newVal.filter((confName) => confName !== conferenceName);

      return {
        ...prevState,
        transferedConferencesNames: newVal,
      };
    });
  },
  setCallArray: (callArray) => {
    set({ incomingCallsArray: callArray });
  },
}));
