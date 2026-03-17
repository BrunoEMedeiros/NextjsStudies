import React, { useState } from "react";
import { FieldError } from "react-hook-form";
import { FaEye } from "react-icons/fa";

export interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  placeholder: string;
  helperText?: string;
  error?: FieldError;
  className?: string; // Targets the outer wrapper
  labelClassName?: string; // Targets the <label>
  inputClassName?: string; // Targets the <input>
}

export default function FormTextArea({
  label = "",
  placeholder,
  helperText,
  error,
  className = "",
  labelClassName = "",
  inputClassName = "",
  ...props
}: TextFieldProps) {
  const inputId = `field-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className={`flex-col ${label ? "gap-1" : ""} ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          // Added labelClassName to merge custom styles with your defaults
          className={`text-md font-light text-earth-yellow ${labelClassName}`}
        >
          {label}
        </label>
      )}
      {/* Parent container – handles background, border, shadow, focus styles */}
      <div
        className={`
          flex items-center w-full rounded-md border shadow-sm transition-all
          bg-rich_black dark:bg-gray-800
          ${
            error
              ? "border-danger"
              : "border-gray-300 dark:border-gray-700 focus-within:border-blue-500 focus-within:ring-blue-500"
          }
        `}
      >
        <textarea
          id={inputId}
          placeholder={placeholder}
          rows={5}
          className={`
            w-full min-w-6 px-2 py-3 outline-none bg-transparent
            placeholder:text-gray-500 text-sm
            dark:text-white resize-none
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
