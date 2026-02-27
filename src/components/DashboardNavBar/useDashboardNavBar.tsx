"use client";
import { logOff } from "@/src/lib/feature/auth/authSlice";
import { RootState } from "@/src/lib/store";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

export function useDashBoardNavBar() {
  const dispatch = useDispatch();

  const { name, role, profile_picture } = useSelector(
    (state: RootState) => state.auth.user
  );

  const handleSignOut = () => {
    dispatch(logOff());
    Cookies.remove("authToken");
    Cookies.remove("refreshToken");
  };

  return {
    handleSignOut,
    name,
    role,
    profile_picture,
  };
}
