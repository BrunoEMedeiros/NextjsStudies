interface ActivityTypeSelectOptionProps {
  label: string;
  value: string;
  key: string;
}

// Define the component props: it receives an array of options
interface SelectProps {
  options: ActivityTypeSelectOptionProps[];
  style?: string;
}

export default function ActivityTypeSelectOption({
  options,
  style = "",
}: SelectProps) {
  return (
    <div className="flex-1 flex flex-col gap-1">
      <label
        htmlFor={"ActivityTypeSelectOption"}
        className={`text-base text-earth-yellow font-light`}
      >
        Tipo de atividade
      </label>
      <select
        id="ActivityTypeSelectOption"
        className={`flex-1 text-base font-light bg-rich-black py-3 px-3 border border-gray-700 rounded-md text-white ${style}`}
      >
        {options.map((option) => {
          return (
            <option className="" value={option.value} key={option.key}>
              {option.label}
            </option>
          );
        })}
      </select>
    </div>
  );
}
