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
        className="bg-confirm text-white p-4 w-full rounded col-span-2"
      >
        {status === "loading" ? "Criando..." : "Criar conta"}
      </button>
    </form>
  );
}
