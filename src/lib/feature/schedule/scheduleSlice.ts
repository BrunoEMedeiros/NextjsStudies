import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ScheduleItem {
  id: string;
  date: string;
  time: string;
}

interface ScheduleState {
  items: ScheduleItem[];
}

const initialState: ScheduleState = {
  items: [],
};

export const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    addScheduleItem: (state, action: PayloadAction<ScheduleItem>) => {
      state.items.push(action.payload);
    },

    setScheduleItems: (state, action: PayloadAction<ScheduleItem[]>) => {
      state.items = action.payload;
    },

    removeScheduleItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    clearSchedule: (state) => {
      state.items = [];
    },
  },
});

export const {
  addScheduleItem,
  setScheduleItems,
  removeScheduleItem,
  clearSchedule,
} = scheduleSlice.actions;

// Export the reducer to add to your store
export default scheduleSlice.reducer;
