import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { FaTrash } from "react-icons/fa";
import { Button, buttonVariants } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

type DeleteDialogProps = {
  id: number;
  label: string;
  itemName?: string;
  text: string;
  style?: string;
  buttonStyle?: string;
  iconColor?: string;
  iconSize?: number;
  deleteFunction: (id: number) => void;
};

const DeleteDialog = ({
  id,
  label,
  itemName = "",
  text,
  deleteFunction,
  style = "",
  buttonStyle = "",
  iconColor = "#e25858",
  iconSize = 10,
}: DeleteDialogProps) => (
  <div className={style}>
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(buttonStyle, `border-0 group hover:cursor-pointer`)}
        >
          <FaTrash size={iconSize} color={iconColor} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {label}
            {itemName ? <b className="text-light-coral">{itemName} ?</b> : null}
          </AlertDialogTitle>
          <AlertDialogDescription className="font-thin text-justify mt-2">
            {text}
          </AlertDialogDescription>
          <AlertDialogDescription className="text-white mt-6">
            Tem certeza que deseja realizar essa ação ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={() => deleteFunction(id)}
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
);

export default DeleteDialog;
