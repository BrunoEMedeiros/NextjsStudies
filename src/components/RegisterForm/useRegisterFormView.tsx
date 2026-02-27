// useRegisterViewModel.ts
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateAccountSchema,
  createAccountSchema,
} from "@/src/lib/schemas/user-register.schema";
import { handleCreateUser } from "@/src/lib/service/user.service";
import { ApiError } from "@/src/lib/ApiError";

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

  const onSubmit = async (data: CreateAccountSchema) => {
    try {
      await handleCreateUser(data);
    } catch (error: any) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          if (error.message === "E-mail em uso") {
            setError("email", {
              type: "manual",
              message: "Este e-mail ja esta sendo usado",
            });
            return;
          }

          if (error.message === "Telefone em uso") {
            setError("phone", {
              type: "manual",
              message: "Telefone em uso",
            });
            return;
          }
        }
        setError("root", {
          type: "server",
          message: error.message || "Erro no servidor.",
        });
      } else {
        console.error(error);
        alert("Erro inesperado. Verifique sua conexão.");
      }
    }
  };

  return {
    handleSubmit,
    onSubmit,
    isSubmitting,
    errors,
    register,
  };
}
