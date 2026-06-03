import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { FaTrash } from "react-icons/fa";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { Loader2 } from "lucide-react";

type DeleteDialogProps<T extends string | number = string | number> = {
  id: T;
  label: string;
  itemName?: string;
  text: string;
  style?: string;
  buttonStyle?: string;
  iconColor?: string;
  iconSize?: number;
  deleteFunction: (id: T) => Promise<void> | void;
};

const DeleteDialog = <T extends string | number = string | number>({
  id,
  label,
  itemName = "",
  text,
  deleteFunction,
  style = "",
  buttonStyle = "",
  iconColor = "#e25858",
  iconSize = 10,
}: DeleteDialogProps<T>) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteFunction(id); // fecha apenas se sucesso
      setOpen(false);
    } catch {
      // O erro já é tratado externamente (toast, etc.)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style}>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className={cn(buttonStyle, "border-0 group hover:cursor-pointer")}
          >
            <FaTrash size={iconSize} color={iconColor} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-earth-yellow">
              {label}
              {itemName ? <b className="text-white">{itemName} ?</b> : null}
            </AlertDialogTitle>
            <AlertDialogDescription className="font-thin mt-2">
              {text}
            </AlertDialogDescription>
            <AlertDialogDescription className="text-white mt-6">
              Tem certeza que deseja realizar essa ação ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <Button
              className="bg-danger text-white min-w-[100px]"
              onClick={handleDelete}
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
    </div>
  );
};

export default DeleteDialog;
