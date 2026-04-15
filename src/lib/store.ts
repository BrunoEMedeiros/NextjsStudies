import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./feature/auth/authSlice";

import { scheduleSlice } from "./feature/schedule/scheduleSlice";
import { filterSlice } from "./feature/filter/filterSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer,
      schedule: scheduleSlice.reducer,
      filter: filterSlice.reducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
