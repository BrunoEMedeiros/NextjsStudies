// ActivityTypeSelectOption.tsx
"use client";
import React, { useId } from "react";

export type ActivityTypeSelectOptionProps = {
  label: string;
  value: string;
  key: string;
};

interface SelectProps {
  options: ActivityTypeSelectOptionProps[];
  style?: string;
  name?: string;
  label?: string;
  value?: string; // +
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  onBlur?: React.FocusEventHandler<HTMLSelectElement>;
}

const ActivityTypeSelectOption = React.forwardRef<
  HTMLSelectElement,
  SelectProps
>(({ options, style = "", name, onChange, onBlur, label = "", value }, ref) => {
  const selectId = useId();
  return (
    <div className="flex-1 flex flex-col gap-1">
      <label
        htmlFor={selectId}
        className="text-base text-earth-yellow font-light"
      >
        {label}
      </label>
      <select
        id={selectId}
        ref={ref}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`flex-1 text-base font-light bg-rich-black py-3 px-3 border border-gray-700 rounded-md text-white ${style}`}
      >
        {options.map((option) => (
          <option value={option.value} key={option.key}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
});

export default ActivityTypeSelectOption;
