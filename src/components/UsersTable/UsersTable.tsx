"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";

import useUsersListHook, { UserFilters } from "./useUsersTableHook";
import { UserType } from "@/src/lib/schemas/users.schema";
import { FaEdit } from "react-icons/fa";
import DeleteDialog from "../DeleteDialog/DeleteDialog";
import { PromoteUserModal } from "../PromoteUserModal/PromoteUserModal";
import { UserRole } from "@/src/lib/schemas/user-register.schema";
import UsersItems from "../UsersItems/UsersItems";

export const ROLE_LABELS: Record<string, string> = {
  regular: "Padrão",
  maintainer: "Mantenedor",
  administrative: "Administrador",
};

export const ROLE_VARIANTS: Record<
  string,
  "default" | "secondary" | "outline"
> = {
  administrative: "default",
  maintainer: "secondary",
  regular: "outline",
};

export const STATUS_LABELS: Record<number, string> = {
  1: "Ativo",
  0: "Inativo",
};

export default function UsersTable() {
  const {
    users,
    isUsersLoading,
    isUsersError,
    currentPage,
    setCurrentPage,
    filters,
    applyFilters,
    resetFilters,
    onSubmit,
  } = useUsersListHook();

  const [draft, setDraft] = useState<UserFilters>({});

  const handleSearch = () => applyFilters(draft);

  const handleReset = () => {
    setDraft({});
    resetFilters();
  };

  const hasFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== ""
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-end">
        <Input
          placeholder="Nome"
          className="w-60 py-5 bg-night outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-blue-500"
          value={draft.name ?? ""}
          onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Input
          placeholder="E-mail"
          className="w-60 py-5 bg-night outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-blue-500"
          value={draft.email ?? ""}
          onChange={(e) => setDraft((p) => ({ ...p, email: e.target.value }))}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Input
          placeholder="Telefone"
          className="w-40 py-5 bg-night outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-blue-500"
          value={draft.phone ?? ""}
          onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Select
          value={draft.role ?? ""}
          onValueChange={(v) =>
            setDraft((p) => ({
              ...p,
              role: v === "all" ? undefined : (v as UserFilters["role"]),
            }))
          }
        >
          <SelectTrigger className="w-36 py-5 bg-night outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-blue-500">
            <SelectValue placeholder="Perfil" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="administrative">Administrador</SelectItem>
            <SelectItem value="maintainer">Mantenedor</SelectItem>
            <SelectItem value="regular">Padrão</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={draft.status !== undefined ? String(draft.status) : ""}
          onValueChange={(v) => {
            setDraft((p) => ({
              ...p,
              status: v === "all" ? undefined : Number(v),
            }));
          }}
        >
          <SelectTrigger className="w-32 py-5 bg-night outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-blue-500">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="1">Ativo</SelectItem>
            <SelectItem value="0">Inativo</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSearch} size="sm" className="py-5">
          <Search className="w-4 h-4 mr-1 text-white" />
          <p className="text-white pr-3">Buscar</p>
        </Button>
        {hasFilters && (
          <Button
            variant="outline"
            onClick={handleReset}
            size="sm"
            className="py-5"
          >
            <X className="w-4 h-4 mr-1 text-white" />
            Limpar
          </Button>
        )}
      </div>
      <div className="rounded-md border border-gray-500">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-b-gray-500 hover:bg-transparent">
              <TableHead className="text-base text-earth-yellow p-6">
                Nome
              </TableHead>
              <TableHead className="text-base text-earth-yellow p-6 text-center">
                Nome no Dharma
              </TableHead>
              <TableHead className="text-base text-earth-yellow p-6">
                E-mail
              </TableHead>
              <TableHead className="text-base text-earth-yellow p-6">
                Telefone
              </TableHead>
              <TableHead className="text-base text-earth-yellow p-6">
                Perfil
              </TableHead>
              <TableHead className="text-base text-earth-yellow p-6">
                Status
              </TableHead>
              <TableHead className="text-base text-earth-yellow p-6">
                Editar
              </TableHead>
              <TableHead className="text-base text-earth-yellow p-6">
                Inativar
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isUsersLoading && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            )}
            {isUsersError && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-10 text-destructive"
                >
                  <div className="flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Erro ao carregar usuários.
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!isUsersLoading && !isUsersError && users?.data?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-10 text-muted-foreground"
                >
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            )}
            {!isUsersLoading &&
              users?.data?.map((user: UserType) => (
                <UsersItems
                  key={user.id}
                  user={user}
                  inactivateFunction={onSubmit}
                />
              ))}
          </TableBody>
        </Table>
      </div>

      {users && users.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {users.usersCount} usuário{users.usersCount !== 1 ? "s" : ""} •
            página {users.currentPage} de {users.totalPages}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={!users.hasMore}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
