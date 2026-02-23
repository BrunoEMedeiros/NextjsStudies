"use client";

import { useSelector } from "react-redux";
import { useRegisterViewModel } from "./useRegisterFormView";
import FormTextField from "../FormTextField/FormTextField";
import FormPhoneField from "../FormPhoneField/FormPhoneField";
import { RotatingLines, TailSpin } from "react-loader-spinner";

export function RegisterForm() {
  // const status = useSelector((state: any) => state.auth.status);

  const { onSubmit, handleSubmit, isSubmitting, register, errors } =
    useRegisterViewModel();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-2 grid-cols-[200px_210px] w-full mx-auto"
    >
      <FormTextField
        label="Nome"
        placeholder="Digite seu nome"
        helperText=""
        error={errors.name}
        {...register("name")}
      />
      <FormTextField
        label="Email"
        placeholder="Digite seu email"
        helperText=""
        type="email"
        error={errors.email}
        {...register("email")}
      />
      <FormTextField
        label="Nome no Dharma"
        placeholder="Opcional"
        helperText="Nome no Dharma, caso tenha"
        error={errors.dharmaName}
        {...register("dharmaName")}
      />
      <FormPhoneField register={register} errors={errors} />
      <FormTextField
        label="Senha"
        placeholder="Digite a senha"
        helperText="Deve ter um (1) caractere especial, letras e numeros"
        type="password"
        minLength={6}
        error={errors.password}
        {...register("password")}
      />
      <FormTextField
        label="Confirme a senha"
        placeholder="Repita a senha"
        helperText=""
        type="password"
        minLength={6}
        error={errors.conf_password}
        {...register("conf_password")}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className={`${
          isSubmitting ? "bg-gray-600" : "bg-confirm"
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
          "Criar conta"
        )}
      </button>
    </form>
  );
}
