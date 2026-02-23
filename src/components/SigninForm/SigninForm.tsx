"use client";

import FormTextField from "../FormTextField/FormTextField";
import { RotatingLines } from "react-loader-spinner";
import { useSigninViewModel } from "./useSigninFormView";
import Link from "next/link";

export function SigninForm() {
  // const status = useSelector((state: any) => state.auth.status);
  const { handleSubmit, onSubmit, register, errors, isSubmitting } =
    useSigninViewModel();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 justify-center items-center w-full"
    >
      <FormTextField
        label="Email"
        placeholder="Digite seu email"
        helperText=""
        type="email"
        error={errors.email}
        className="w-full"
        {...register("email")}
      />
      <FormTextField
        label="Senha"
        placeholder="Digite a senha"
        type="password"
        minLength={6}
        className="w-full"
        error={errors.password}
        {...register("password")}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className={`${
          isSubmitting ? "bg-gray-600" : "bg-blue-500"
        } text-white p-4 w-full rounded col-span-2 mt-4 max-h-14`}
      >
        {isSubmitting ? (
          <div className="flex justify-center items-center">
            <RotatingLines
              visible={true}
              height="30"
              width="30"
              color="grey"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        ) : (
          "Entrar"
        )}
      </button>
      <hr className="w-3/4 h-px rounded mt-3 mb-2 bg-gray-300 border-0" />
      <div className="mb-4">
        <p className="font-sans text-sm text-earth-yellow">
          <Link href={"/register"}>Não tem uma conta ? Crie uma agora</Link>
        </p>
      </div>
    </form>
  );
}
