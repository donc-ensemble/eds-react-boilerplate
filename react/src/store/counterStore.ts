import { create } from 'zustand';

export interface CounterState {
  counter: number;
  increase: (by: number) => void;
}

export const useCounterStore = create<CounterState>()((set, get) => ({
  counter: 0,
  increase: (by: number) => set(() => ({ counter: get().counter + by })),
}));
