import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  CreateAccountSchema,
  createAccountSchema,
} from "@/src/lib/schemas/user-register.schema";
import { handleCreateUser } from "@/src/lib/service/user.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useRegisterViewModel() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
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

        toast.error(
          result.message ||
            "Ocorreu um erro inesperado, por favor verifique sua conexão com a internet"
        );
        return;
      }

      toast.success("Conta criada com sucesso! Faça login para continuar.");
      reset();
      router.push("/signin");
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
