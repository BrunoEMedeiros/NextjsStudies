import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: {
    email: string | null;
    name: string | null;
    profilePicture: string | null;
    role: string | null;
    dharmaName: string | null;
    phone: string | null;
  };
  isLoged: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: AuthState = {
  user: {
    email: null,
    name: null,
    profilePicture: null,
    role: null,
    dharmaName: null,
    phone: null,
  },
  isLoged: false,
  status: "idle",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signin: (
      state,
      action: PayloadAction<{
        isLoged: boolean;
        user?: {
          email: string;
          name: string;
          profilePicture: string;
          role: string;
          dharmaName: string;
          phone: string;
        };
      }>
    ) => {
      state.isLoged = action.payload.isLoged;
      state.status = "succeeded";
      if (action.payload.user) {
        state.user = action.payload.user;
      }
    },
    logOff: (state) => {
      state.isLoged = false;
      state.user = {
        email: null,
        name: null,
        profilePicture: null,
        role: null,
        dharmaName: null,
        phone: null,
      };
      state.status = "idle";
    },
  },
});

export const { signin, logOff } = authSlice.actions;

export default authSlice.reducer;
