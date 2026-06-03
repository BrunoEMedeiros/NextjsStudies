// useDashBoardNavBar.ts
"use client";
import { logOff, signin } from "@/src/lib/feature/auth/authSlice";
import { UserProfileType } from "@/src/lib/schemas/user-profile.schema";
import { fetchProfile, handleLogOff } from "@/src/lib/service/user.service";
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

    await signOut.mutateAsync();
  };

  return {
    handleSignOut,
    isLoading: profileQuery.isLoading,
    name: profileQuery.data?.name || "",
    role: profileQuery.data?.role || "",
    profilePicture: profileQuery.data?.profilePicture || "",
  };
}
