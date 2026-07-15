"use client";

import { useMemo } from "react";
import { Loader2, AlertCircle, Search } from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { ROLE_LABELS } from "@/src/components/UsersTable/UsersTable";
import ExportButtons from "../ExportButtons";
import useUsersReport from "./useUsersReport";

export default function UsersReport() {
  const {
    nameSearch,
    setNameSearch,
    searchUsers,
    userMatches,
    isSearchingUsers,
    selectedUser,
    selectUser,
    schedules,
    isSchedulesLoading,
    isSchedulesError,
    generateSchedulesByUser,
    role,
    setRole,
    generateUsersByRole,
    roleGenerated,
    users,
    isUsersLoading,
    isUsersError,
  } = useUsersReport();

  const scheduleExportRows = useMemo(
    () =>
      schedules?.map((s) => ({
        atividade: s.activity.title,
        tipo: s.activity.type,
        modalidade: s.modality,
        pessoas: s.personNumber,
        restricaoAlimentar: s.foodRestriction ?? "",
        datas: s.slots
          .map(
            (slot) =>
              `${new Date(slot.availableData).toLocaleDateString(
                "pt-BR"
              )} ${slot.availableTime}`
          )
          .join(", "),
      })),
    [schedules]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <Card className="bg-rich-black ring-grey-400/40">
        <CardContent className="space-y-4">
          <h2 className="text-lg font-semibold text-white">
            Agendamentos por usuário
          </h2>

          <div className="flex flex-wrap gap-2 items-end">
            <Input
              placeholder="Buscar usuário por nome"
              className="w-64 bg-night"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchUsers()}
            />
            <Button size="sm" onClick={searchUsers}>
              <Search className="w-3.5 h-3.5" />
              Buscar
            </Button>
          </div>

          {isSearchingUsers && (
            <Loader2 className="w-4 h-4 animate-spin text-earth-yellow" />
          )}

          {userMatches.length > 0 && !selectedUser && (
            <div className="flex flex-wrap gap-2">
              {userMatches.map((u) => (
                <Button
                  key={u.id}
                  variant="outline"
                  size="sm"
                  onClick={() => selectUser(u.id, u.name)}
                >
                  {u.name}
                </Button>
              ))}
            </div>
          )}

          {selectedUser && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-grey-200">
                Usuário selecionado:{" "}
                <span className="text-earth-yellow font-medium">
                  {selectedUser.name}
                </span>
              </span>
              <Button size="sm" onClick={generateSchedulesByUser}>
                Gerar relatório
              </Button>
              <ExportButtons
                data={scheduleExportRows}
                filename={`agendamentos-${selectedUser.name}`}
                columns={{
                  atividade: "Atividade",
                  tipo: "Tipo",
                  modalidade: "Modalidade",
                  pessoas: "Nº de pessoas",
                  restricaoAlimentar: "Restrição alimentar",
                  datas: "Datas",
                }}
              />
            </div>
          )}

          {selectedUser && (
            <div className="rounded-md border border-gray-500">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-b-gray-500 hover:bg-transparent">
                    <TableHead className="text-earth-yellow">
                      Atividade
                    </TableHead>
                    <TableHead className="text-earth-yellow">Tipo</TableHead>
                    <TableHead className="text-earth-yellow">
                      Modalidade
                    </TableHead>
                    <TableHead className="text-earth-yellow">
                      Pessoas
                    </TableHead>
                    <TableHead className="text-earth-yellow">Datas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isSchedulesLoading && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <Loader2 className="w-5 h-5 animate-spin mx-auto text-earth-yellow" />
                      </TableCell>
                    </TableRow>
                  )}
                  {isSchedulesError && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-destructive"
                      >
                        Erro ao carregar agendamentos.
                      </TableCell>
                    </TableRow>
                  )}
                  {!isSchedulesLoading &&
                    !isSchedulesError &&
                    schedules?.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-muted-foreground"
                        >
                          Nenhum agendamento encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  {schedules?.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.activity.title}</TableCell>
                      <TableCell>{s.activity.type}</TableCell>
                      <TableCell>{s.modality}</TableCell>
                      <TableCell>{s.personNumber}</TableCell>
                      <TableCell>
                        {s.slots
                          .map(
                            (slot) =>
                              `${new Date(
                                slot.availableData
                              ).toLocaleDateString("pt-BR")} ${slot.availableTime}`
                          )
                          .join(", ")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-rich-black ring-grey-400/40">
        <CardContent className="space-y-4">
          <h2 className="text-lg font-semibold text-white">
            Usuários por perfil
          </h2>

          <div className="flex flex-wrap gap-2 items-end">
            <Select
              value={role ?? "all"}
              onValueChange={(v) =>
                setRole(v === "all" ? undefined : (v as typeof role))
              }
            >
              <SelectTrigger className="w-40 bg-night">
                <SelectValue placeholder="Perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="administrative">Administrador</SelectItem>
                <SelectItem value="maintainer">Mantenedor</SelectItem>
                <SelectItem value="regular">Padrão</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={generateUsersByRole}>
              Gerar relatório
            </Button>
            <ExportButtons
              data={users}
              filename="usuarios-por-perfil"
              columns={{
                name: "Nome",
                dharmaName: "Nome no Dharma",
                email: "E-mail",
                phone: "Telefone",
                role: "Perfil",
                status: "Status",
              }}
            />
          </div>

          {roleGenerated && (
            <div className="rounded-md border border-gray-500">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-b-gray-500 hover:bg-transparent">
                    <TableHead className="text-earth-yellow">Nome</TableHead>
                    <TableHead className="text-earth-yellow">
                      E-mail
                    </TableHead>
                    <TableHead className="text-earth-yellow">
                      Telefone
                    </TableHead>
                    <TableHead className="text-earth-yellow">
                      Perfil
                    </TableHead>
                    <TableHead className="text-earth-yellow">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isUsersLoading && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <Loader2 className="w-5 h-5 animate-spin mx-auto text-earth-yellow" />
                      </TableCell>
                    </TableRow>
                  )}
                  {isUsersError && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-destructive"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Erro ao carregar usuários.
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {!isUsersLoading && !isUsersError && users?.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Nenhum usuário encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                  {users?.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.phone}</TableCell>
                      <TableCell>{ROLE_LABELS[u.role]}</TableCell>
                      <TableCell>{u.status === 1 ? "Ativo" : "Inativo"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
