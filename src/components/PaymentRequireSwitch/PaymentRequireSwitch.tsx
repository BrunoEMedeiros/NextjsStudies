import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";

export default function PaymentRequireSwitch() {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="airplane-mode" className="text-sm font-light">
        Obrigatória ?
      </Label>
      <Switch
        id="airplane-mode"
        className="data-[state=checked]:bg-earth-yellow"
      />
    </div>
  );
}
