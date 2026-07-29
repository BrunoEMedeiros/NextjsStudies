import React, { useState } from "react";
import { FieldError } from "react-hook-form";
import { FaEye } from "react-icons/fa";

export interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  placeholder: string;
  helperText?: string;
  error?: FieldError;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  rows?: number;
}

export default function FormTextArea({
  label = "",
  placeholder,
  helperText,
  error,
  className = "",
  labelClassName = "",
  inputClassName = "",
  rows = 17,
  ...props
}: TextFieldProps) {
  const inputId = `field-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className={`flex flex-col ${label ? "gap-1" : ""} ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`text-md font-light text-earth-yellow ${labelClassName}`}
        >
          {label}
        </label>
      )}
      <div
        className={`
          flex items-center w-full rounded-md border shadow-sm transition-all
          bg-rich-black dark:bg-gray-800
          ${
            error
              ? "border-danger"
              : "border-gray-700 dark:border-gray-700 focus-within:border-blue-500 focus-within:ring-blue-500"
          }
        `}
      >
        <textarea
          id={inputId}
          placeholder={placeholder}
          rows={rows}
          className={`
            w-full min-w-6 px-2 py-3 outline-none bg-transparent
            placeholder:text-gray-500 text-base
            dark:text-white resize-none text-white
            ${inputClassName}
          `}
          {...props}
        ></textarea>
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
