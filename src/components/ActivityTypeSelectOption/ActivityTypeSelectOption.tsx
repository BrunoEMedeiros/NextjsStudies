// ActivityTypeSelectOption.tsx
"use client";
import React from "react";

interface ActivityTypeSelectOptionProps {
  label: string;
  value: string;
  key: string;
}

interface SelectProps {
  options: ActivityTypeSelectOptionProps[];
  style?: string;
  // RHF spreads these — accept them explicitly
  name?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  onBlur?: React.FocusEventHandler<HTMLSelectElement>;
}

const ActivityTypeSelectOption = React.forwardRef<
  HTMLSelectElement,
  SelectProps
>(({ options, style = "", name, onChange, onBlur }, ref) => {
  return (
    <div className="flex-1 flex flex-col gap-1">
      <label
        htmlFor="ActivityTypeSelectOption"
        className="text-base text-earth-yellow font-light"
      >
        Tipo de atividade
      </label>
      <select
        id="ActivityTypeSelectOption"
        ref={ref} // ← RHF needs this to register the field
        name={name}
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
