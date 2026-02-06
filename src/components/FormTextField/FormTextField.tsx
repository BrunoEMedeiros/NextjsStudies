import React from "react";
import { FieldError } from "react-hook-form";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  error?: FieldError;
}

export default function FormTextField({
  label,
  helperText,
  error,
  className = "",
  ...props
}: TextFieldProps) {
  const inputId = `field-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`
          px-3 py-2 rounded-md border text-sm shadow-sm transition-all outline-none
          bg-white dark:bg-gray-800 dark:text-white
          placeholder:text-gray-400
          focus:ring-2 focus:ring-offset-1
          ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500"
          }
        `}
        {...props}
      />
      {helperText && (
        <p className={`text-xs ${error ? "text-red-500" : "text-gray-500"}`}>
          {helperText}
        </p>
      )}
    </div>
  );
}
