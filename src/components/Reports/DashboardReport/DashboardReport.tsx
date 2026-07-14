"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
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
import useDashboardReport from "./useDashboardReport";

const TYPE_LABELS: Record<string, string> = {
  event: "Evento",
  course: "Curso",
  ceremony: "Cerimônia",
};

export default function DashboardReport() {
  const { generate, generated, data, isLoading, isError } =
    useDashboardReport();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={generate}>
          Gerar relatório
        </Button>
      </div>

      {isLoading && (
        <Loader2 className="w-5 h-5 animate-spin text-earth-yellow" />
      )}

      {isError && (
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="w-4 h-4" />
          Erro ao carregar relatório geral.
        </div>
      )}

      {generated && !isLoading && !isError && data && (
        <>
          <Card className="bg-rich-black ring-grey-400/40">
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-lg font-semibold text-white">
                  Usuários ativos ({data.activeUsersCount})
                </h2>
                <ExportButtons
                  data={data.activeUsers}
                  filename="usuarios-ativos"
                  columns={{
                    name: "Nome",
                    email: "E-mail",
                    phone: "Telefone",
                    role: "Perfil",
                  }}
                />
              </div>
              <div className="rounded-md border border-gray-500">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-b-gray-500 hover:bg-transparent">
                      <TableHead className="text-earth-yellow">
                        Nome
                      </TableHead>
                      <TableHead className="text-earth-yellow">
                        E-mail
                      </TableHead>
                      <TableHead className="text-earth-yellow">
                        Telefone
                      </TableHead>
                      <TableHead className="text-earth-yellow">
                        Perfil
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.activeUsers.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>{u.phone}</TableCell>
                        <TableCell>{ROLE_LABELS[u.role]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-rich-black ring-grey-400/40">
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-lg font-semibold text-white">
                  Atividades criadas por mês
                </h2>
                <ExportButtons
                  data={data.activitiesPerMonth}
                  filename="atividades-por-mes"
                  columns={{ month: "Mês", count: "Quantidade" }}
                />
              </div>
              <div className="rounded-md border border-gray-500">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-b-gray-500 hover:bg-transparent">
                      <TableHead className="text-earth-yellow">Mês</TableHead>
                      <TableHead className="text-earth-yellow">
                        Quantidade
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.activitiesPerMonth.map((m) => (
                      <TableRow key={m.month}>
                        <TableCell>
                          {new Date(m.month).toLocaleDateString("pt-BR", {
                            month: "long",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell>{m.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-rich-black ring-grey-400/40">
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-lg font-semibold text-white">
                  Atividades ativas por tipo
                </h2>
                <ExportButtons
                  data={data.activityTypeBreakdown}
                  filename="atividades-por-tipo"
                  columns={{ type: "Tipo", count: "Quantidade" }}
                />
              </div>
              <div className="rounded-md border border-gray-500">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-b-gray-500 hover:bg-transparent">
                      <TableHead className="text-earth-yellow">
                        Tipo
                      </TableHead>
                      <TableHead className="text-earth-yellow">
                        Quantidade
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.activityTypeBreakdown.map((t) => (
                      <TableRow key={t.type}>
                        <TableCell>{TYPE_LABELS[t.type]}</TableCell>
                        <TableCell>{t.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
