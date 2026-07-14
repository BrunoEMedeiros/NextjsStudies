import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/src/lib/service/user.service";
import {
  fetchSchedulesByUserReport,
  fetchUsersByRoleReport,
  UserRoleFilter,
} from "@/src/lib/service/report.service";

export default function useUsersReport() {
  const [nameSearch, setNameSearch] = useState("");
  const [searchTrigger, setSearchTrigger] = useState("");
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [role, setRole] = useState<UserRoleFilter | undefined>(undefined);
  const [roleGenerated, setRoleGenerated] = useState(false);

  const userMatches = useQuery({
    queryKey: ["reports", "user-search", searchTrigger],
    queryFn: () => fetchUsers(searchTrigger, undefined, undefined, undefined, undefined, 1),
    enabled: searchTrigger.length > 0,
    staleTime: 1000 * 60,
  });

  const schedulesByUser = useQuery({
    queryKey: ["reports", "schedules-by-user", selectedUser?.id],
    queryFn: () => fetchSchedulesByUserReport(selectedUser!.id),
    enabled: false,
  });

  const usersByRole = useQuery({
    queryKey: ["reports", "users-by-role", role],
    queryFn: () => fetchUsersByRoleReport(role),
    enabled: false,
  });

  const searchUsers = () => {
    setSelectedUser(null);
    setSearchTrigger(nameSearch);
  };

  const selectUser = (id: string, name: string) => {
    setSelectedUser({ id, name });
    setSearchTrigger("");
    setNameSearch("");
  };

  const generateSchedulesByUser = () => {
    if (selectedUser) schedulesByUser.refetch();
  };

  const generateUsersByRole = () => {
    setRoleGenerated(true);
    usersByRole.refetch();
  };

  return {
    nameSearch,
    setNameSearch,
    searchUsers,
    userMatches: userMatches.data?.data ?? [],
    isSearchingUsers: userMatches.isLoading,
    selectedUser,
    selectUser,
    schedules: schedulesByUser.data,
    isSchedulesLoading: schedulesByUser.isFetching,
    isSchedulesError: schedulesByUser.isError,
    generateSchedulesByUser,
    role,
    setRole,
    generateUsersByRole,
    roleGenerated,
    users: usersByRole.data,
    isUsersLoading: usersByRole.isFetching,
    isUsersError: usersByRole.isError,
  };
}
