// useRegisterViewModel.ts
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
import { signin } from "@/src/lib/feature/auth/authSlice";

export function useSigninViewModel() {
  const dispatch = useDispatch();
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

  const onSubmit = async (data: SigninUserSchema) => {
    try {
      const userInfo = await handleLoginUser(data);
      dispatch(signin({ isLoged: true, user: userInfo }));
      router.push("/dashboard/activities/");
    } catch (error: any) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          setError("email", {
            type: "manual",
            message: "E-mail ou senha incorretos",
          });
          setError("password", {
            type: "manual",
            message: "E-mail ou senha incorretos",
          });
        }
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
    setError,
  };
}
