import { UserRole } from "@/src/lib/schemas/user-register.schema";
import { alterUserRole } from "@/src/lib/service/user.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function useAlterUserAccountRole(
  initialRole: UserRole,
  userId: string
) {
  const [role, setRole] = useState<UserRole>(initialRole);

  const queryClient = useQueryClient();

  function cancelAlter() {
    setRole(initialRole);
  }

  function alterRole(newRole: UserRole) {
    setRole(newRole);
  }

  const updateRole = useMutation({
    mutationKey: ["updateRole"],
    mutationFn: () => alterUserRole(role, userId),
    onSuccess: (result) => {
      if (!result.ok) {
        toast.error(result.message || "Erro ao alterar usuário");
        setRole(initialRole);
        return;
      }
      toast.success("Permissão de usuário alterado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      return;
    },
  });

  const onSubmit = async (): Promise<boolean> => {
    const result = await updateRole.mutateAsync();
    return result.ok;
  };

  return {
    role,
    alterRole,
    cancelAlter,
    onSubmit,
  };
}
