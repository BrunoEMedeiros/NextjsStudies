// useDashBoardNavBar.ts
"use client";
import { logOff, signin } from "@/src/lib/feature/auth/authSlice";
import { UserProfileType } from "@/src/lib/schemas/user-profile.schema";
import { fetchProfile, handleLogOff } from "@/src/lib/service/user.service";
import { isApiError } from "@/src/lib/ApiError";
import { useMutation, useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useDashBoardNavBar() {
  const dispatch = useDispatch();
  const router = useRouter();

  const profileQuery = useQuery<UserProfileType>({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    staleTime: 60000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const signOut = useMutation({
    mutationKey: ["signOut"],
    mutationFn: () => handleLogOff(),
    onSuccess: (result) => {
      if (!result.ok) {
        toast.error("Erro ao sair da conta");
        return;
      }

      toast.success("Até logo 🙏🏻");
      dispatch(logOff());
      router.push("/signin");
      router.refresh();
      return;
    },
  });

  const handleSignOut = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();

    await signOut.mutateAsync();
  };

  useEffect(() => {
    if (!profileQuery.isError) return;

    const error = profileQuery.error;
    const isAuthFailure = isApiError(error) && error.status === 401;
    if (!isAuthFailure) return;

    handleSignOut().catch(() => {
      // We already know locally that the session is dead; make sure we
      // still land on /signin even if the logout call itself fails.
      router.push("/signin");
    });
  }, [profileQuery.isError, profileQuery.error]);

  useEffect(() => {
    if (profileQuery.data) {
      dispatch(signin({ isLoged: true, user: profileQuery.data }));
    }
  }, [profileQuery.data, dispatch]);

  return {
    handleSignOut,
    isLoading: profileQuery.isLoading,
    name: profileQuery.data?.name || "",
    role: profileQuery.data?.role || "",
    profilePicture: profileQuery.data?.profilePicture || "",
  };
}
