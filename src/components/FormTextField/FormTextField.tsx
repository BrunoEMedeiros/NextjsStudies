import React, { useState } from "react";
import { FieldError } from "react-hook-form";
import { FaEye } from "react-icons/fa";

export interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder: string;
  helperText?: string;
  error?: FieldError;
  type?: string;
  className?: string;
}

export default function FormTextField({
  label = "",
  placeholder,
  helperText,
  error,
  className = "",
  type = "text",
  ...props
}: TextFieldProps) {
  const inputId = `field-${label.replace(/\s+/g, "-").toLowerCase()}`;

  const [passwordVisible, setPasswordVisible] = useState<string>(type);

  const togglePasswordVisibility = () => {
    setPasswordVisible(passwordVisible === "password" ? "text" : "password");
    console.log(passwordVisible);
  };

  return (
    <div className={`flex-col ${label ? `gap-1` : null}  ${className} `}>
      <label htmlFor={inputId} className="text-md font-light text-earth-yellow">
        {label}
      </label>
      <div className="w-full flex">
        <input
          id={inputId}
          type={passwordVisible}
          className={`
          w-full min-w-6 max-w-55 px-2 py-3 rounded-md border-2 shadow-sm transition-all outline-none
          bg-white dark:bg-gray-800 dark:text-white
          placeholder:text-gray-400
          focus:ring-1 focus:ring-offset-1 text-sm
          ${
            error
              ? "border-danger focus:border-danger" // fixed typo 'dange'
              : "border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500"
          }
        `}
          placeholder={placeholder}
          {...props}
        />
        {type == "password" ? (
          <div
            className="min-w-12.5 flex justify-center items-center"
            onClick={() => {
              togglePasswordVisibility();
            }}
          >
            <FaEye size={24} />
          </div>
        ) : null}
      </div>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
      {helperText && (
        <p className={`text-xs ${error ? "text-danger" : "text-gray-500"}`}>
          {helperText}
        </p>
      )}
    </div>
  );
}
