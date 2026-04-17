import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateAccountSchema,
  createAccountSchema,
} from "@/src/lib/schemas/user-register.schema";
import { handleCreateUser } from "@/src/lib/service/user.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useRegisterViewModel() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CreateAccountSchema>({
    resolver: zodResolver(
      createAccountSchema
    ) as unknown as Resolver<CreateAccountSchema>,
  });

  const createAccount = useMutation({
    mutationKey: ["createAccount"],
    mutationFn: async (data: CreateAccountSchema) =>
      await handleCreateUser(data),
    onSuccess: (result) => {
      if (!result.ok) {
        if (result.status === 409) {
          if (result.message === "E-mail já em uso") {
            setError("email", {
              type: "manual",
              message: "Este e-mail ja esta sendo usado",
            });
            return;
          }

          if (result.message === "Telefone já em uso") {
            setError("phone", {
              type: "manual",
              message: "Telefone em uso",
            });
            return;
          }
        }
        if (result.status === 500) {
          toast.error(
            `Ocorreu um erro inesperado, por favor verifique sua conexão com a internet`
          );
          return;
        }
      }
    },
  });

  const onSubmit = async (data: CreateAccountSchema) => {
    await createAccount.mutateAsync(data);
  };

  return {
    handleSubmit,
    onSubmit,
    isSubmitting,
    errors,
    register,
  };
}
