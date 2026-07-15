"use client";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { Button } from "@/src/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

type ConfirmOnDeactivate = {
  label: string;
  itemName?: string;
  text: string;
};

interface CustomSwitch {
  label: string;
  setActive?: (value: boolean) => void | Promise<void>;
  active: boolean;
  lableClassName?: string;
  confirmOnDeactivate?: ConfirmOnDeactivate;
}

export default function CustomSwitch({
  label,
  setActive = () => {},
  active,
  lableClassName = "",
  confirmOnDeactivate,
}: CustomSwitch) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckedChange = (checked: boolean) => {
    if (!checked && confirmOnDeactivate) {
      setConfirmOpen(true);
      return;
    }
    setActive(checked);
  };

  const handleConfirmDeactivate = async () => {
    setLoading(true);
    try {
      await setActive(false);
      setConfirmOpen(false);
    } finally {
      setLoading(false);
    }
  };

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
        onCheckedChange={handleCheckedChange}
      />
      {confirmOnDeactivate && (
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-earth-yellow">
                {confirmOnDeactivate.label}
                {confirmOnDeactivate.itemName ? (
                  <b className="text-white">
                    {" "}
                    {confirmOnDeactivate.itemName} ?
                  </b>
                ) : null}
              </AlertDialogTitle>
              <AlertDialogDescription className="font-thin mt-2">
                {confirmOnDeactivate.text}
              </AlertDialogDescription>
              <AlertDialogDescription className="text-white mt-6">
                Tem certeza que deseja realizar essa ação ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>
                Cancelar
              </AlertDialogCancel>
              <Button
                className="bg-danger text-white min-w-[100px]"
                onClick={handleConfirmDeactivate}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Inativar"
                )}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
