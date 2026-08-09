import { UserSchedule } from '@/app/libs/definitions';
import { create } from 'zustand';

// day weeks

interface Dayweek {
  dayweek: boolean[];
  setPickDay: (index: number) => void;
  clearDayweek: () => void;
}

export const dayweekStore = create<Dayweek>((set) => ({
  dayweek: [false, false, false, false, false, false, false],
  setPickDay: (index) => {
    set((state) => ({
      dayweek: state.dayweek.map((day, i) => (i === index ? !day : day)),
    }));
  },
  clearDayweek: () => {
    set({ dayweek: [false, false, false, false, false, false, false] });
  },
}));

// day times

interface Daytime {
  daytimeFrom: number[];
  daytimeTo: number[];
  setFromDaytime: (index: number, newTime: number) => void;
  setToDaytime: (index: number, newTime: number) => void;
  clearDaytime: () => void;
}

export const daytimeStore = create<Daytime>((set) => ({
  daytimeFrom: [0, 0, 0, 0, 0, 0, 0],
  daytimeTo: [0, 0, 0, 0, 0, 0, 0],
  setFromDaytime: (index, newTime) => {
    set((state) => ({
      daytimeFrom: state.daytimeFrom.map((time, i) => (i === index ? newTime : time)),
    }));
  },
  setToDaytime: (index, newTime) => {
    set((state) => ({
      daytimeTo: state.daytimeTo.map((time, i) => (i === index ? newTime : time)),
    }));
  },
  clearDaytime: () => {
    set({ daytimeFrom: [0, 0, 0, 0, 0, 0, 0], daytimeTo: [0, 0, 0, 0, 0, 0, 0] });
  },
}));

// user schedule

interface UserScheduleData {
  userSchedule: UserSchedule;
  getUserScheduleData: (userId?: number) => Promise<void>;
  clearUserScheduleData: () => void;
}

export const userScheduleStore = create<UserScheduleData>((set) => ({
  userSchedule: undefined,
  getUserScheduleData: async (userId) => {
    if (userId) {
      const data = await (await fetch(`/api/adminDashboard/userSchedule/${userId}`)).json();

      set((state) => ({
        ...state,
        userSchedule: data,
      }));
    }
  },
  clearUserScheduleData: () => {
    set({ userSchedule: undefined });
  },
}));
