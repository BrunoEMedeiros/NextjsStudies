import {
  fetchUsers,
  PaginatedUsersResponse,
} from "@/src/lib/service/user.service";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

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

  const applyFilters = (newFilters: UserFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  return {
    users: users.data,
    isUsersLoading: users.isLoading,
    isUsersError: users.isError,
    currentPage,
    setCurrentPage,
    filters,
    applyFilters,
    resetFilters,
  };
}
