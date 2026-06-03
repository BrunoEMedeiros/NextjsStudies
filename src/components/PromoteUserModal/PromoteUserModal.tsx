import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Field, FieldGroup } from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { FaEdit } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import useAlterUserAccountRole from "./useAlterUserAccountRole";
import { UserRole } from "@/src/lib/schemas/user-register.schema";
import { useState } from "react";

type PromoteUserModalProps = {
  initialRole: UserRole;
  userId: string;
};

export function PromoteUserModal({
  initialRole,
  userId,
}: PromoteUserModalProps) {
  const [open, setOpen] = useState(false);
  const { role, alterRole, cancelAlter, onSubmit } = useAlterUserAccountRole(
    initialRole,
    userId
  );
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-earth-yellow text-night py-4 px-6 flex justify-center items-center"
          variant="outline"
        >
          <FaEdit size={24} color="#f2f3f4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-earth-yellow">
            Alterar perfil do usuario
          </DialogTitle>
          <DialogDescription>
            As alterações terão efeito no momento em que o usuário entrar
            novamente no aplicativo
          </DialogDescription>
          <DialogDescription className="italic text-white">
            Tome cuidado ao alterar o nivel da conta do usuário pois, poderá dar
            permissões de administrador a uma conta
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Select
            value={role}
            onValueChange={(r: UserRole) => {
              alterRole(r);
            }}
          >
            <SelectTrigger className="w-36 py-5 bg-night outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-blue-500">
              <SelectValue placeholder="Perfil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="administrative">Administrador</SelectItem>
              <SelectItem value="maintainer">Mantenedor</SelectItem>
              <SelectItem value="regular">Padrão</SelectItem>
            </SelectContent>
          </Select>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={() => cancelAlter()}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="text-white bg-confirm"
            onClick={async () => {
              await onSubmit();
              setOpen(false);
            }}
          >
            Alterar conta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
