import React, { forwardRef } from "react";

export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

// Allow the component to accept standard Select props
interface SelectCountryCodeProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const SelectCountryCode = forwardRef<HTMLSelectElement, SelectCountryCodeProps>(
  ({ className, ...props }, ref) => {
    const countries: Country[] = [
      { code: "BR", name: "Brazil", dialCode: "+55", flag: "🇧🇷" },
      { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
      { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
      { code: "PT", name: "Portugal", dialCode: "+351", flag: "🇵🇹" },
      { code: "ES", name: "Spain", dialCode: "+34", flag: "🇪🇸" },
      { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
      { code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
      { code: "IT", name: "Italy", dialCode: "+39", flag: "🇮🇹" },
      { code: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵" },
      { code: "CN", name: "China", dialCode: "+86", flag: "🇨🇳" },
      { code: "IN", name: "India", dialCode: "+91", flag: "🇮🇳" },
      { code: "MX", name: "Mexico", dialCode: "+52", flag: "🇲🇽" },
      { code: "AR", name: "Argentina", dialCode: "+54", flag: "🇦🇷" },
      { code: "CL", name: "Chile", dialCode: "+56", flag: "🇨🇱" },
      { code: "CO", name: "Colombia", dialCode: "+57", flag: "🇨🇴" },
      { code: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
      { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
      { code: "ZA", name: "South Africa", dialCode: "+27", flag: "🇿🇦" },
      { code: "RU", name: "Russia", dialCode: "+7", flag: "🇷🇺" },
      { code: "KR", name: "South Korea", dialCode: "+82", flag: "🇰🇷" },
    ];

    return (
      <div className="relative">
        <select
          ref={ref} // <--- IMPORTANT: Pass the ref here
          id="select-option"
          className={`border px-1 min-h-12 rounded-md bg-rich-black border-gray-700 dark:border-gray-600 ${className}`}
          {...props} // Spreads onChange, onBlur, name, etc.
        >
          {countries.map((option) => (
            <option key={option.code} value={option.dialCode}>
              {option.dialCode} {option.flag}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

SelectCountryCode.displayName = "SelectCountryCode";

export default SelectCountryCode;
