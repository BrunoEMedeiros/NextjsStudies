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
      await handleLoginUser(data);
    } catch (error: any) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          //   if (error.message === "E-mail em uso") {
          //     setError("email", {
          //       type: "manual",
          //       message: "Este e-mail ja esta sendo usado",
          //     });
          //     return;
          //   }
          //   if (error.message === "Telefone em uso") {
          //     setError("phone", {
          //       type: "manual",
          //       message: "Telefone em uso",
          //     });
          //     return;
          //   }
          // }
          // setError("root", {
          //   type: "server",
          //   message: error.message || "Erro no servidor.",
          // });

          alert("Login ou senha invalidos");
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
