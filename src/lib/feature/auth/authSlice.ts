import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 1. Update the State Interface
interface AuthState {
  user: { email: string | null };
  // Add these fields required by your api-client
  authToken: string | null;
  refreshToken: string | null;
  isLoged: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
}

// 2. Update Initial State
const initialState: AuthState = {
  user: { email: null },
  authToken: null,
  refreshToken: null,
  isLoged: false,
  status: "idle",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // --- Existing Registration Reducers ---
    registrationStart: (state) => {
      state.status = "loading";
    },
    registrationSuccess: (state, action: PayloadAction<{ email: string }>) => {
      state.status = "succeeded";
      state.user.email = action.payload.email;
    },
    registrationFailure: (state) => {
      state.status = "failed";
    },

    // --- New Authentication Reducers (Required for api-client) ---

    // Used when user logs in OR when token is refreshed
    signin: (
      state,
      action: PayloadAction<{
        authToken: string;
        refreshToken: string;
        isLoged: boolean;
        // Optional: you can pass user data here too if your API returns it
        user?: { email: string };
      }>
    ) => {
      state.authToken = action.payload.authToken;
      state.refreshToken = action.payload.refreshToken;
      state.isLoged = action.payload.isLoged;
      state.status = "succeeded";

      // If the API returns user info on login/refresh, update it here
      if (action.payload.user) {
        state.user = action.payload.user;
      }
    },

    // Used for Logout or 401 failures
    logOff: (state) => {
      state.authToken = null;
      state.refreshToken = null;
      state.isLoged = false;
      state.user = { email: null };
      state.status = "idle";
    },
  },
});

export const {
  registrationStart,
  registrationSuccess,
  registrationFailure,
  // Export the new actions
  signin,
  logOff,
} = authSlice.actions;

export default authSlice.reducer;
