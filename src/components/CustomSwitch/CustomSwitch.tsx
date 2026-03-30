import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { Dispatch, SetStateAction } from "react";

interface CustomSwitch {
  label: string;
  setActive: Dispatch<SetStateAction<boolean>>;
  active: boolean;
  lableClassName?: string;
}

export default function CustomSwitch({
  label,
  setActive,
  active,
  lableClassName = "",
}: CustomSwitch) {
  return (
    <div className="flex items-center space-x-2 gap-1">
      <Label
        htmlFor="airplane-mode"
        className={`text-sm font-light text-earth-yellow ${lableClassName}`}
      >
        {label}
      </Label>
      <Switch
        id="airplane-mode"
        className="data-[state=checked]:bg-earth-yellow data-[state=unchecked]:bg-gray-400"
        checked={active}
        onCheckedChange={setActive}
      />
    </div>
  );
}
