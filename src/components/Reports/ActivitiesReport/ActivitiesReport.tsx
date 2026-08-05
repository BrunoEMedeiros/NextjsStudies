"use client";

import { useMemo } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import ExportButtons from "../ExportButtons";
import useActivitiesReport from "./useActivitiesReport";
import { ACTIVITY_TYPE_LABELS as TYPE_LABELS } from "@/src/lib/activityType";

export default function ActivitiesReport() {
  const {
    draft,
    setDraft,
    toggleFilterId,
    filterOptions,
    generate,
    reset,
    generated,
    activities,
    isLoading,
    isError,
  } = useActivitiesReport();

  const exportRows = useMemo(
    () =>
      activities?.map((a) => ({
        ...a,
        filters: (a.filters ?? []).map((f) => f.descricao).join(", "),
      })),
    [activities]
  );

  return (
    <Card className="bg-rich-black ring-grey-400/40">
      <CardContent className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Atividades</h2>

        <div className="flex flex-wrap gap-2 items-end">
          <Input
            type="date"
            className="w-40 bg-night"
            value={draft.dateFrom ?? ""}
            onChange={(e) =>
              setDraft((p) => ({ ...p, dateFrom: e.target.value }))
            }
          />
          <Input
            type="date"
            className="w-40 bg-night"
            value={draft.dateTo ?? ""}
            onChange={(e) =>
              setDraft((p) => ({ ...p, dateTo: e.target.value }))
            }
          />
          <Select
            value={draft.type ?? "all"}
            onValueChange={(v) =>
              setDraft((p) => ({
                ...p,
                type: v === "all" ? undefined : (v as typeof draft.type),
              }))
            }
          >
            <SelectTrigger className="w-36 bg-night">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="event">Evento</SelectItem>
              <SelectItem value="course">Curso</SelectItem>
              <SelectItem value="ceremony">Cerimônia</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={
              draft.paymentRequired === undefined
                ? "all"
                : String(draft.paymentRequired)
            }
            onValueChange={(v) =>
              setDraft((p) => ({
                ...p,
                paymentRequired: v === "all" ? undefined : v === "true",
              }))
            }
          >
            <SelectTrigger className="w-40 bg-night">
              <SelectValue placeholder="Pagamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="true">Exige pagamento</SelectItem>
              <SelectItem value="false">Sem pagamento</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Descrição"
            className="w-56 bg-night"
            value={draft.description ?? ""}
            onChange={(e) =>
              setDraft((p) => ({ ...p, description: e.target.value }))
            }
          />
          <Button size="sm" onClick={generate}>
            Gerar relatório
          </Button>
          {generated && (
            <Button variant="outline" size="sm" onClick={reset}>
              Limpar
            </Button>
          )}
          <ExportButtons
            data={exportRows}
            filename="relatorio-atividades"
            columns={{
              title: "Título",
              type: "Tipo",
              payment_required: "Exige pagamento",
              payment_sugestion: "Valor sugerido",
              scheduleCount: "Agendamentos",
              expectedRevenue: "Receita esperada",
              status: "Status",
              createdAt: "Criada em",
              filters: "Tags",
            }}
          />
        </div>

        {filterOptions.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-grey-200">Filtros:</span>
            {filterOptions.map((f) => (
              <Badge
                key={f.id}
                variant="outline"
                onClick={() => toggleFilterId(f.id)}
                className={`cursor-pointer transition-colors ${
                  draft.filterIds.includes(f.id)
                    ? "border-earth-yellow text-earth-yellow"
                    : "border-grey-400 text-grey-300"
                }`}
              >
                {f.descricao}
              </Badge>
            ))}
          </div>
        )}

        {generated && (
          <div className="rounded-md border border-gray-500">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-b-gray-500 hover:bg-transparent">
                  <TableHead className="text-earth-yellow">Título</TableHead>
                  <TableHead className="text-earth-yellow">Tipo</TableHead>
                  <TableHead className="text-earth-yellow">
                    Pagamento
                  </TableHead>
                  <TableHead className="text-earth-yellow">
                    Valor sugerido
                  </TableHead>
                  <TableHead className="text-earth-yellow">
                    Agendamentos
                  </TableHead>
                  <TableHead className="text-earth-yellow">
                    Receita esperada
                  </TableHead>
                  <TableHead className="text-earth-yellow">Status</TableHead>
                  <TableHead className="text-earth-yellow">Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto text-earth-yellow" />
                    </TableCell>
                  </TableRow>
                )}
                {isError && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-destructive"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Erro ao carregar atividades.
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && !isError && activities?.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Nenhuma atividade encontrada.
                    </TableCell>
                  </TableRow>
                )}
                {activities?.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.title}</TableCell>
                    <TableCell>{TYPE_LABELS[a.type]}</TableCell>
                    <TableCell>
                      {a.payment_required ? "Sim" : "Não"}
                    </TableCell>
                    <TableCell>
                      R$ {a.payment_sugestion.toFixed(2)}
                    </TableCell>
                    <TableCell>{a.scheduleCount}</TableCell>
                    <TableCell>R$ {a.expectedRevenue.toFixed(2)}</TableCell>
                    <TableCell>
                      {a.status === 1 ? "Ativa" : "Inativa"}
                    </TableCell>
                    <TableCell>
                      {(a.filters ?? []).map((f) => f.descricao).join(", ")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
