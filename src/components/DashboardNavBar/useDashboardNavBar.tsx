"use client";
import { ApiError } from "@/src/lib/ApiError";
import { logOff, signin } from "@/src/lib/feature/auth/authSlice";
import { UserProfileType } from "@/src/lib/schemas/user-profile.schema";
import { fetchProfile } from "@/src/lib/service/user.service";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export function useDashBoardNavBar() {
  const dispatch = useDispatch();

  const profileQuery = useQuery<UserProfileType>({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    staleTime: 6000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (profileQuery.data) {
      dispatch(signin({ isLoged: true, user: profileQuery.data }));
    }
  }, []);

  const handleSignOut = () => {
    dispatch(logOff());
    Cookies.remove("authToken", { path: "/" });
    Cookies.remove("refreshToken", { path: "/" });
  };

  return {
    handleSignOut,
    name: profileQuery.data?.name || "",
    role: profileQuery.data?.role || "",
    profilePicture: profileQuery.data?.profilePicture || "",
  };
}
