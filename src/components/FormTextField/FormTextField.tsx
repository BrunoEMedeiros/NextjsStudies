import React from "react";
import { FieldError } from "react-hook-form";

export interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  placeholder: string;
  helperText?: string;
  error?: FieldError;
}

export default function FormTextField({
  label,
  placeholder,
  helperText,
  error,
  className = "",
  ...props
}: TextFieldProps) {
  const inputId = `field-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      <label htmlFor={inputId} className="text-lg font-light text-earth-yellow">
        {label}
      </label>
      <input
        id={inputId}
        className={`
          px-5 py-4 rounded-md border-2 text-base shadow-sm transition-all outline-none
          bg-white dark:bg-gray-800 dark:text-white
          placeholder:text-gray-400
          focus:ring-1 focus:ring-offset-1
          ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500"
          }
        `}
        placeholder={placeholder}
        {...props}
      />
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
      {helperText && (
        <p className={`text-xs ${error ? "text-red-500" : "text-gray-500"}`}>
          {helperText}
        </p>
      )}
    </div>
  );
}
