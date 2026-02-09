// components/FormPhoneField/FormPhoneField.tsx
import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import SelectCountryCode from "../SelectCountryCode/SelectCountryCode";
import FormTextField from "../FormTextField/FormTextField";
import { CreateAccountSchema } from "@/src/lib/schemas/user-register.schema"; // Import your schema type

interface FormPhoneFieldProps {
  register: UseFormRegister<CreateAccountSchema>;
  errors: FieldErrors<CreateAccountSchema>;
}

const FormPhoneField = ({ register, errors }: FormPhoneFieldProps) => {
  return (
    <div className="flex flex-col w-full justify-center">
      <label
        htmlFor="phone_input"
        className="text-md font-light text-earth-yellow"
      >
        Celular
      </label>
      <div className="flex flex-row gap-2">
        <SelectCountryCode
          {...register("countryCode")}
          className={errors.countryCode ? "border-red-500" : ""}
        />
        <FormTextField
          id="phone_input"
          placeholder="000000000"
          className=""
          maxLength={11}
          minLength={11}
          helperText="Celular sem 0 e sem traço"
          {...register("phone")}
          error={errors.phone}
        />
      </div>
      {errors.countryCode && (
        <p className="text-red-500 text-sm">{errors.countryCode.message}</p>
      )}
    </div>
  );
};

export default FormPhoneField;
