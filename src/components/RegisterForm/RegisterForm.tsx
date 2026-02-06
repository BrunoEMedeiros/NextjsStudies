"use client";

import { useSelector } from "react-redux";
import { useRegisterViewModel } from "./useRegisterFormView";
import FormTextField from "../FormTextField/FormTextField";
import SelectCountryCode from "../SelectCountryCode/SelectCountryCode";

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
      <SelectCountryCode {...register("countryCode")} />
      {/* <div>
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
        />
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password.message}</p>
        )}
      </div> */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-black text-white p-2 w-full rounded"
      >
        {status === "loading" ? "Processing..." : "Register"}
      </button>
    </form>
  );
}
