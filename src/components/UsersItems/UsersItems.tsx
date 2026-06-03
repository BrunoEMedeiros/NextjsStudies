import { UserRole } from "@/src/lib/schemas/user-register.schema";
import DeleteDialog from "../DeleteDialog/DeleteDialog";
import { PromoteUserModal } from "../PromoteUserModal/PromoteUserModal";
import { Badge } from "../ui/badge";
import { TableCell, TableRow } from "../ui/table";
import { UserType } from "@/src/lib/schemas/users.schema";
import {
  ROLE_LABELS,
  ROLE_VARIANTS,
  STATUS_LABELS,
} from "../UsersTable/UsersTable";

type UsersItemsProps = {
  user: UserType;
  inactivateFunction: (id: string) => void;
};
const UsersItems = ({ user, inactivateFunction }: UsersItemsProps) => {
  return (
    <TableRow key={user.id}>
      <TableCell className="font-medium p-6">{user.name}</TableCell>
      <TableCell className="text-muted-foreground">
        {user.dharmaName ?? "—"}
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.phone}</TableCell>
      <TableCell>
        <Badge
          variant={ROLE_VARIANTS[user.role] ?? "outline"}
          className="text-white p-4"
        >
          {ROLE_LABELS[user.role] ?? user.role}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge
          variant={user.status === 1 ? "default" : "secondary"}
          className="text-white p-4"
        >
          {STATUS_LABELS[user.status] ?? user.status}
        </Badge>
      </TableCell>
      <TableCell>
        <PromoteUserModal
          initialRole={user.role as UserRole}
          userId={user.id}
        />
      </TableCell>
      <TableCell className="flex justify-center mt-2.5">
        <DeleteDialog
          style="flex justify-center items-center rounded-md px-2 py-4 w-16 h-4 bg-danger cursor-pointer hover:opacity-80 transition-opacity disabled:cursor-not-allowed"
          buttonStyle="bg-danger hover:bg-danger"
          iconColor="#f2f3f4"
          id={user.id}
          label="Inativar o usuario: "
          itemName={user.name}
          text="Atenção, esse usuário será inativado do sistema, ele não poderar mais acessar o site ou o aplicativo após ser inativado"
          deleteFunction={inactivateFunction}
        />
      </TableCell>
    </TableRow>
  );
};

export default UsersItems;
