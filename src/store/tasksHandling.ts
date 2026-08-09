import { TaskStatuses } from '@/app/ui/dashboard/reports/storeReport/taskActivity/taskStatus/TaskStatus';
import { create } from 'zustand';

interface TaskDetail {
  orderByRelatedStatus: boolean;
  setNextTaskOrderBy: (val: boolean) => void;
}

export const taskDetailStore = create<TaskDetail>((set) => ({
  orderByRelatedStatus: false,
  setNextTaskOrderBy: (val) => {
    set({ orderByRelatedStatus: val });
  },
}));

interface TaskFilter {
  taskStatusFilter: number[];
  setTaskStatusFilter: (status: number) => void;
  fetching: boolean;
  setFetching: (isFetching: boolean) => void;
}

export const taskFilterStore = create<TaskFilter>((set, get) => ({
  taskStatusFilter: [TaskStatuses.Pending],
  fetching: false,
  setFetching: (isFetching) => {
    set({ fetching: isFetching });
  },
  setTaskStatusFilter: (status) => {
    const currentFilters = get().taskStatusFilter;

    if (status === 0) {
      const { Pending, Canceled, Completed, Late } = TaskStatuses;

      set({ taskStatusFilter: [Pending, Canceled, Completed, Late] });

      return;
    }

    if (currentFilters.includes(status)) {
      const newState = currentFilters.filter((id) => id !== status);

      set({ taskStatusFilter: newState });
    } else {
      const newState = [...currentFilters, status];

      set({ taskStatusFilter: newState });
    }
  },
}));
