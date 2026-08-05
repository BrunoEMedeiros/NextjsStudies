"use client";
import { cn } from "@/src/lib/utils";
import React, { useState, forwardRef } from "react";
import { FieldError } from "react-hook-form";
import { FaEye } from "react-icons/fa";
import { withMask } from "use-mask-input";

export interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder: string;
  helperText?: string;
  error?: FieldError;
  type?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  containerClassName?: string;
  mask?: string | string[];
  maskOptions?: Record<string, any>;
  autoResize?: boolean; // 1. Added the new prop
}

const FormTextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label = "",
      placeholder,
      helperText,
      error,
      className = "",
      labelClassName = "",
      inputClassName = "",
      containerClassName = "",
      type = "text",
      mask,
      maskOptions,
      autoResize = false, // Default to false so it doesn't break other forms
      ...props
    },
    ref
  ) => {
    const inputId = `field-${label.replace(/\s+/g, "-").toLowerCase()}`;

    const [passwordVisible, setPasswordVisible] = useState<string>(
      type || "text"
    );

    const [contentLength, setContentLength] = useState(
      (props.value || props.defaultValue || placeholder || "").toString().length
    );

    const togglePasswordVisibility = () => {
      setPasswordVisible(passwordVisible === "password" ? "text" : "password");
    };

    const handleRef = (element: HTMLInputElement | null) => {
      if (!element) return;
      if (mask) {
        const applyMask = withMask(mask, maskOptions);
        applyMask(element);
      }
      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (autoResize) {
        setContentLength(e.target.value.length || placeholder?.length || 0);
      }
      if (props.onChange) {
        props.onChange(e);
      }
    };

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
          className={cn(
            "flex items-center rounded-md border shadow-sm transition-all",
            autoResize ? "w-fit" : "w-full",
            "bg-rich-black dark:bg-midnight-black",
            error
              ? "border-danger"
              : "border-gray-700 dark:border-gray-700 focus-within:border-blue-500 focus-within:ring-blue-500",
            containerClassName
          )}
        >
          <input
            id={inputId}
            type={passwordVisible}
            ref={handleRef}
            className={cn(
              "min-w-4 px-2 py-3 outline-none bg-transparent placeholder:text-gray-500 text-base dark:text-white text-white",
              autoResize ? "" : "w-full",
              inputClassName
            )}
            placeholder={placeholder}
            style={autoResize ? { width: `${contentLength + 2}ch` } : undefined}
            {...props}
            onChange={handleChange}
          />
          {type === "password" && (
            <div
              className="flex items-center justify-center px-3 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              <FaEye size={24} />
            </div>
          )}
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
);

FormTextField.displayName = "FormTextField";

export default FormTextField;
