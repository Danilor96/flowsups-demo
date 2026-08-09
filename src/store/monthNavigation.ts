import { getWeekOfMonth } from 'date-fns';
import { create } from 'zustand';

const initialDate = new Date();
const initialYear = initialDate.getFullYear();

const initialYearSpanStart = initialYear - 11;

const INITIAL_STATE = {
  currentMonth: initialDate.getMonth(),
  currentYear: initialYear,
  currentWeek: getWeekOfMonth(initialDate),
  yearSpanStart: initialYearSpanStart,
  currentSecondMonth: initialDate.getMonth(),
  currentSecondYear: initialYear,
  isSecondFilterActive: false,
  fetchingData: true,
  stateToDoFetch: false,
};

interface CalendarNavigationStore {
  yearSpanStart: number;
  currentMonth: number;
  currentYear: number;
  currentWeek: number;
  currentSecondMonth: number;
  currentSecondYear: number;
  isSecondFilterActive: boolean;
  fetchingData: boolean;
  stateToDoFetch: boolean;
  setStateToDoFetch: (state: boolean) => void;
  setFetchingData: (fetching: boolean) => void;
  setSecondFilterActive: (isActive: boolean) => void;
  handleYearSpanPrev: () => void;
  handleYearSpanNext: () => void;
  handlePrev: () => void;
  handleNext: () => void;
  handlePick: (type: 'month' | 'year', value: number) => void;
  setWeek: (week: number) => void;
  resetMonthFilter: () => void;
}

export const useCalendarStore = create<CalendarNavigationStore>((set, get) => ({
  ...INITIAL_STATE,
  handlePrev: () => {
    const { setWeek } = get();

    set((state) => {
      const targetMonth = state.isSecondFilterActive
        ? state.currentSecondMonth
        : state.currentMonth;
      const targetYear = state.isSecondFilterActive ? state.currentSecondYear : state.currentYear;

      let newMonth = targetMonth - 1;
      let newYear = targetYear;

      if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      }

      if (state.isSecondFilterActive) {
        return {
          currentSecondMonth: newMonth,
          currentSecondYear: newYear,
        };
      } else {
        return {
          currentMonth: newMonth,
          currentYear: newYear,
        };
      }
    });

    setWeek(1);
  },
  handleNext: () => {
    const { setWeek } = get();

    set((state) => {
      const targetMonth = state.isSecondFilterActive
        ? state.currentSecondMonth
        : state.currentMonth;
      const targetYear = state.isSecondFilterActive ? state.currentSecondYear : state.currentYear;

      let newMonth = targetMonth + 1;
      let newYear = targetYear;

      if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      }

      if (state.isSecondFilterActive) {
        return {
          currentSecondMonth: newMonth,
          currentSecondYear: newYear,
        };
      } else {
        return {
          currentMonth: newMonth,
          currentYear: newYear,
        };
      }
    });

    setWeek(1);
  },
  handlePick: (type, value) => {
    const { setWeek } = get();

    set((state) => {
      if (type === 'month') {
        if (state.isSecondFilterActive) {
          return {
            currentSecondMonth: value,
            showMonths: false,
          };
        } else {
          return {
            currentMonth: value,
            showMonths: false,
          };
        }
      }

      if (type === 'year') {
        if (state.isSecondFilterActive) {
          return {
            currentSecondYear: value,
            showYears: false,
          };
        } else {
          return {
            currentYear: value,
            showYears: false,
          };
        }
      }

      return state;
    });

    setWeek(1);
  },
  handleYearSpanNext: () =>
    set((state) => {
      const newYearSpanStart = state.yearSpanStart + 12;

      return { yearSpanStart: newYearSpanStart };
    }),
  handleYearSpanPrev: () =>
    set((state) => {
      const newYearSpanStart = state.yearSpanStart - 12;

      return { yearSpanStart: newYearSpanStart };
    }),
  setSecondFilterActive: (isActive) => set({ isSecondFilterActive: isActive }),
  resetMonthFilter: () => {
    set(INITIAL_STATE);
  },
  setFetchingData: (fetching) => {
    set({ fetchingData: fetching });
  },
  setWeek: (week) => {
    set({ currentWeek: week });
  },
  setStateToDoFetch: (state) => {
    set({ stateToDoFetch: state });
  },
}));
