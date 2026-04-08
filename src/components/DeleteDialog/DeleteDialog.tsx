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

type DeleteDialogProps = {
  id: number;
  label: string;
  itemName?: string;
  text: string;
  deleteFunction: (id: number) => void;
};

const DeleteDialog = ({
  id,
  label,
  itemName = "",
  text,
  deleteFunction,
}: DeleteDialogProps) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button
        variant="outline"
        className="bg-rich-black border-0 group hover:bg-rich-black hover:cursor-pointer"
      >
        <FaTrash size={10} color="#e25858" />
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {label}
          {itemName ? <b className="text-light-coral">{itemName} ?</b> : null}
        </AlertDialogTitle>
        <AlertDialogDescription>{text}</AlertDialogDescription>
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
);

export default DeleteDialog;
