import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: {
    email: string | null;
    name: string | null;
    profile_picture: string | null;
    role: string | null;
  };
  isLoged: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: AuthState = {
  user: { email: null, name: null, profile_picture: null, role: null },
  isLoged: false,
  status: "idle",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registrationStart: (state) => {
      state.status = "loading";
    },
    registrationSuccess: (
      state,
      action: PayloadAction<{
        email: string;
        name: string;
        profile_picture: string;
        role: string;
      }>
    ) => {
      state.status = "succeeded";
      state.user.email = action.payload.email;
      state.user.name = action.payload.name;
      state.user.profile_picture = action.payload.profile_picture;
      state.user.role = action.payload.role;
    },
    registrationFailure: (state) => {
      state.status = "failed";
    },
    signin: (
      state,
      action: PayloadAction<{
        isLoged: boolean;
        user?: {
          email: string;
          name: string;
          profile_picture: string;
          role: string;
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
        profile_picture: null,
        role: null,
      };
      state.status = "idle";
    },
  },
});

export const {
  registrationStart,
  registrationSuccess,
  registrationFailure,
  signin,
  logOff,
} = authSlice.actions;

export default authSlice.reducer;
