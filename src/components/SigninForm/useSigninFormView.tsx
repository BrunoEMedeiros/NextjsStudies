import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { handleLoginUser } from "@/src/lib/service/user.service";
import { ApiError } from "@/src/lib/ApiError";
import {
  signinUserSchema,
  SigninUserSchema,
} from "@/src/lib/schemas/user-signin.schema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const ROLE_REDIRECT: Record<string, string> = {
  administrative: "/dashboard/activities",
  maintainer: "/dashboard/activities",
  regular: "/dashboard/activities",
};

export function useSigninViewModel() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SigninUserSchema>({
    resolver: zodResolver(
      signinUserSchema
    ) as unknown as Resolver<SigninUserSchema>,
  });

  const authUser = useMutation({
    mutationKey: ["auth"],
    mutationFn: async ({ email, password }: SigninUserSchema) =>
      await handleLoginUser(email, password),
    onSuccess: (result) => {
      if (!result.ok) {
        if (result.status === 401) {
          setError("email", {
            type: "manual",
            message: "E-mail ou senha incorretos",
          });
          setError("password", {
            type: "manual",
            message: "E-mail ou senha incorretos",
          });
          return;
        }
        if (result.status === 500) {
          console.error(result);
          toast.error(
            `Ocorreu um erro inesperado, por favor verifique sua conexão com a internet`
          );
          return;
        }
        return;
      }
      const { role } = result.data;

      if (role !== "administrative") {
        toast.error("Você não tem permissão para acessar esta aplicação.");
        return;
      }

      router.push("/dashboard/activities");
    },
  });

  const onSubmit = async (data: SigninUserSchema) => {
    await authUser.mutateAsync(data);
  };

  return {
    handleSubmit,
    onSubmit,
    isSubmitting,
    errors,
    register,
    setError,
  };
}
