import {
  fetchUsers,
  handleInactivateUser,
  PaginatedUsersResponse,
} from "@/src/lib/service/user.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export type UserFilters = {
  name?: string;
  email?: string;
  role?: "administrative" | "maintainer" | "regular";
  phone?: string;
  status?: number;
};

export default function useUsersListHook() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<UserFilters>({});

  const queryClient = useQueryClient();

  const users = useQuery<PaginatedUsersResponse>({
    queryKey: ["users", currentPage, filters],
    queryFn: () =>
      fetchUsers(
        filters.name,
        filters.email,
        filters.role,
        filters.phone,
        filters.status,
        currentPage
      ),
    staleTime: 1000 * 60 * 5,
    refetchOnReconnect: true,
  });

  const inactivateUser = useMutation({
    mutationKey: ["inactivateUser"],
    mutationFn: (id: string) => handleInactivateUser(id),
    onSuccess: (result) => {
      if (!result.ok) {
        toast.error("Erro ao inativar usuário");
        return;
      }
      toast.success("Usuário inativado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      return;
    },
  });

  const applyFilters = (newFilters: UserFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const onSubmit = useCallback(
    async (id: string) => {
      await inactivateUser.mutateAsync(id);
    },
    [inactivateUser]
  );

  return {
    users: users.data,
    isUsersLoading: users.isLoading,
    isUsersError: users.isError,
    currentPage,
    setCurrentPage,
    filters,
    applyFilters,
    resetFilters,
    onSubmit,
  };
}
