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
    <div className="flex flex-col w-full gap-1 justify-center">
      <label
        htmlFor="phone_input"
        className="text-lg font-light text-earth-yellow"
      >
        Telefone
      </label>

      <div className="flex flex-row gap-2">
        <SelectCountryCode
          {...register("countryCode")}
          className={errors.countryCode ? "border-red-500" : ""}
        />
        <FormTextField
          id="phone_input"
          placeholder="00000-0000"
          className="flex-1" // Takes remaining space
          maxLength={11}
          minLength={11}
          {...register("phone")}
          error={errors.phone} // Pass error specifically to your custom input
        />
      </div>
      {errors.countryCode && (
        <p className="text-red-500 text-sm">{errors.countryCode.message}</p>
      )}
    </div>
  );
};

export default FormPhoneField;
