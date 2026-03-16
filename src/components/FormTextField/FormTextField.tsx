// import React, { useState } from "react";
// import { FieldError } from "react-hook-form";
// import { FaEye } from "react-icons/fa";

// export interface TextFieldProps
//   extends React.InputHTMLAttributes<HTMLInputElement> {
//   label?: string;
//   placeholder: string;
//   helperText?: string;
//   error?: FieldError;
//   type?: string;
//   className?: string; // Targets the outer wrapper
//   labelClassName?: string; // Targets the <label>
//   inputClassName?: string; // Targets the <input>
// }

// export default function FormTextField({
//   label = "",
//   placeholder,
//   helperText,
//   error,
//   className = "",
//   labelClassName = "",
//   inputClassName = "",
//   type = "text",
//   ...props
// }: TextFieldProps) {
//   const inputId = `field-${label.replace(/\s+/g, "-").toLowerCase()}`;

//   const [passwordVisible, setPasswordVisible] = useState<string>(type);

//   const togglePasswordVisibility = () => {
//     setPasswordVisible(passwordVisible === "password" ? "text" : "password");
//   };

//   return (
//     <div className={`flex-col ${label ? "gap-1" : ""} ${className}`}>
//       {label && (
//         <label
//           htmlFor={inputId}
//           // Added labelClassName to merge custom styles with your defaults
//           className={`text-md font-light text-earth-yellow ${labelClassName}`}
//         >
//           {label}
//         </label>
//       )}
//       {/* Parent container – handles background, border, shadow, focus styles */}
//       <div
//         className={`
//           flex items-center w-full rounded-md border-2 shadow-sm transition-all
//           bg-white dark:bg-gray-800
//           ${
//             error
//               ? "border-danger"
//               : "border-gray-300 dark:border-gray-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
//           }
//         `}
//       >
//         <input
//           id={inputId}
//           type={passwordVisible}
//           // Added inputClassName to merge custom styles with your defaults
//           className={`
//             w-full min-w-6 px-2 py-3 outline-none bg-transparent
//             placeholder:text-gray-400 text-sm
//             dark:text-white
//             ${inputClassName}
//           `}
//           placeholder={placeholder}
//           {...props}
//         />
//         {type === "password" && (
//           <div
//             className="flex items-center justify-center px-3 cursor-pointer"
//             onClick={togglePasswordVisibility}
//           >
//             <FaEye size={24} />
//           </div>
//         )}
//       </div>
//       {error && <p className="text-red-500 text-sm">{error.message}</p>}
//       {helperText && (
//         <p className={`text-xs ${error ? "text-danger" : "text-gray-500"}`}>
//           {helperText}
//         </p>
//       )}
//     </div>
//   );
// }

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
  className?: string; // Targets the outer wrapper
  labelClassName?: string; // Targets the <label>
  inputClassName?: string; // Targets the <input>
  mask?: string | string[]; // Added for use-mask-input
  maskOptions?: Record<string, any>; // Added for advanced masks like currency
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
      type = "text",
      mask,
      maskOptions,
      ...props
    },
    ref
  ) => {
    const inputId = `field-${label.replace(/\s+/g, "-").toLowerCase()}`;

    // Note: Ensuring type falls back to "text" if undefined so state is strictly a string
    const [passwordVisible, setPasswordVisible] = useState<string>(
      type || "text"
    );

    const togglePasswordVisibility = () => {
      setPasswordVisible(passwordVisible === "password" ? "text" : "password");
    };

    // Custom ref handler to merge react-hook-form's ref and use-mask-input
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
            flex items-center w-full rounded-md border-2 shadow-sm transition-all
            bg-midnight-black dark:bg-gray-800
            ${
              error
                ? "border-danger"
                : "border-gray-300 dark:border-gray-700 focus-within:border-blue-500 focus-within:ring-0.25 focus-within:ring-blue-500"
            }
          `}
        >
          <input
            id={inputId}
            type={passwordVisible}
            ref={handleRef} // Applied the merged ref handler here
            // Added inputClassName to merge custom styles with your defaults
            className={`
              w-full min-w-6 px-2 py-3 outline-none bg-transparent
              placeholder:text-gray-500 text-sm
              dark:text-white text-white
              ${inputClassName}
            `}
            placeholder={placeholder}
            {...props}
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
