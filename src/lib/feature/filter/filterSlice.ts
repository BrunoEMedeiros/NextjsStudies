import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FilterItem {
  id: number;
  descricao: string;
}

interface FilterState {
  filters: FilterItem[];
}

const initialState: FilterState = {
  filters: [],
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    addFilterItem: (state, action: PayloadAction<FilterItem>) => {
      state.filters.push(action.payload);
    },

    setFilterItem: (state, action: PayloadAction<FilterItem[]>) => {
      state.filters = action.payload;
    },

    removeFilterItem: (state, action: PayloadAction<number>) => {
      state.filters = state.filters.filter(
        (item) => item.id !== action.payload
      );
    },

    clearFilter: (state) => {
      state.filters = [];
    },
  },
});

export const { addFilterItem, setFilterItem, removeFilterItem, clearFilter } =
  filterSlice.actions;

export default filterSlice.reducer;
