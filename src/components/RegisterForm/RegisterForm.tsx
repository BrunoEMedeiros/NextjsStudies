"use client";

import { useSelector } from "react-redux";
import { useRegisterViewModel } from "./useRegisterFormView";
import FormTextField from "../FormTextField/FormTextField";

export function RegisterForm() {
  const status = useSelector((state: any) => state.auth.status);

  const { onSubmit, handleSubmit, register, errors } = useRegisterViewModel();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="gap-3">
      <FormTextField
        label="nome"
        helperText="Nome invalido"
        error={errors.name}
        {...register("name")}
      />
      <FormTextField
        label="email"
        helperText="Email invalido"
        error={errors.email}
        {...register("email")}
      />
      <div>
        <input
          {...register("dharmaName")}
          placeholder="Email"
          className="border p-2 w-full"
        />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}
      </div>
      <div>
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
        />
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password.message}</p>
        )}
      </div>
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
