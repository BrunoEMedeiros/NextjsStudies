// useRegisterViewModel.ts
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  registrationFailure,
  registrationStart,
  registrationSuccess,
} from "@/src/lib/feature/auth/authSlice";
import {
  CreateAccountSchema,
  createAccountSchema,
} from "@/src/lib/schemas/user-register.schema";

export function useRegisterViewModel() {
  const dispatch = useDispatch();
  const router = useRouter(); // Usually you redirect after register

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
    // dispatch(registrationStart());
    // Create FormData object to pass to Server Action
    // const formData = new FormData();
    // formData.append("email", data.email);
    // formData.append("password", data.password);
    // const result = await registerUserAction(formData);
    // if (result.success) {
    //   dispatch(registrationSuccess({ email: data.email }));
    // } else {
    //   dispatch(registrationFailure());
    //   alert(result.message);
    // }

    console.log(data);
  };

  return {
    handleSubmit,
    onSubmit,
    isSubmitting,
    errors,
    register,
  };
}
