"use client";

import { useSelector } from "react-redux";
import { useRegisterViewModel } from "./useRegisterFormView";
import FormTextField from "../FormTextField/FormTextField";
import SelectCountryCode from "../SelectCountryCode/SelectCountryCode";
import FormPhoneField from "../FormPhoneField/FormPhoneField";

export function RegisterForm() {
  const status = useSelector((state: any) => state.auth.status);

  const { onSubmit, handleSubmit, register, errors } = useRegisterViewModel();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
        placeholder="Nome no dharma, caso tenha"
        helperText=""
        error={errors.dharmaName}
        {...register("dharmaName")}
      />
      <FormPhoneField register={register} errors={errors} />
      <FormTextField
        label="Senha"
        placeholder="Sua senha de 6 caracteres"
        helperText="Deve ter um caracter especial, letras e numeros"
        type="password"
        maxLength={6}
        minLength={6}
        error={errors.password}
        {...register("password")}
      />
      <FormTextField
        label="Confirme a senha"
        placeholder="Repita a senha"
        helperText=""
        type="password"
        maxLength={6}
        minLength={6}
        error={errors.conf_password}
        {...register("conf_password")}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-confirm text-white p-4 w-full rounded"
      >
        {status === "loading" ? "Criando..." : "Criar conta"}
      </button>
    </form>
  );
}
