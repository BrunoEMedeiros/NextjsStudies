// useSigninViewModel.ts
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { handleLoginUser } from "@/src/lib/service/user.service";
import { ApiError } from "@/src/lib/ApiError";
import {
  signinUserSchema,
  SigninUserSchema,
} from "@/src/lib/schemas/user-signin.schema";
import { useMutation } from "@tanstack/react-query";

export function useSigninViewModel() {
  // const dispatch = useDispatch();
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
    onSuccess: async () => {
      router.push("/dashboard/activities");
      return;
    },
    onError: (error: any) => {
      if (error instanceof ApiError && error.status === 401) {
        setError("email", {
          type: "manual",
          message: "E-mail ou senha incorretos",
        });
        setError("password", {
          type: "manual",
          message: "E-mail ou senha incorretos",
        });
      } else {
        console.error(error);
        alert("Erro inesperado. Verifique sua conexão.");
      }
    },
  });

  const onSubmit = async (data: SigninUserSchema) => {
    try {
      await authUser.mutateAsync(data);
    } catch (error: any) {}
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
