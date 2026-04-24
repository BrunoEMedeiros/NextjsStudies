// useDashBoardNavBar.ts
"use client";
import { logOff, signin } from "@/src/lib/feature/auth/authSlice";
import { UserProfileType } from "@/src/lib/schemas/user-profile.schema";
import { fetchProfile } from "@/src/lib/service/user.service";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

export function useDashBoardNavBar() {
  const dispatch = useDispatch();
  const router = useRouter();

  const profileQuery = useQuery<UserProfileType>({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    staleTime: 6000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  useEffect(() => {
    if (!profileQuery.isError) return;

    const error = profileQuery.error as any;
    const isAuthFailure =
      error?.status === 401 || error?.isAuthExpired === true; // ✅ catches the AuthExpiredError path

    if (isAuthFailure) {
      handleSignOut();
      router.push("/signin");
    }
  }, [profileQuery.isError, profileQuery.error]);

  useEffect(() => {
    if (profileQuery.data) {
      dispatch(signin({ isLoged: true, user: profileQuery.data }));
    }
  }, [profileQuery.data, dispatch]);

  const handleSignOut = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    dispatch(logOff());
    Cookies.remove("authToken", { path: "/" });
    Cookies.remove("refreshToken", { path: "/" });

    try {
      await fetch("/api/auth/logout", {
        method: "GET",
      });
    } catch (error) {
      console.error("Failed to log out on the server", error);
    }

    router.push("/signin");
    router.refresh();
  };

  return {
    handleSignOut,
    isLoading: profileQuery.isLoading,
    name: profileQuery.data?.name || "",
    role: profileQuery.data?.role || "",
    profilePicture: profileQuery.data?.profilePicture || "",
  };
}
