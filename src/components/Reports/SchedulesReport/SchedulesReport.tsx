"use client";

import { useMemo } from "react";
import { AlertCircle, ExternalLink, Loader2 } from "lucide-react";
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
import ExportButtons from "../ExportButtons";
import useSchedulesReport from "./useSchedulesReport";
import { formatDateOnlyPtBR } from "@/src/lib/utils";

export default function SchedulesReport() {
  const {
    draft,
    setDraft,
    generate,
    reset,
    generated,
    activityOptions,
    schedules,
    isLoading,
    isError,
  } = useSchedulesReport();

  const exportRows = useMemo(
    () =>
      schedules?.map((s) => ({
        atividade: s.activity.title,
        tipo: s.activity.type,
        modalidade: s.modality,
        pessoas: s.personNumber,
        nome: s.member.dharmaName || s.member.name,
        telefone: s.member.phone,
        email: s.member.email,
        datas: s.slots
          .map(
            (slot) =>
              `${formatDateOnlyPtBR(slot.availableData)} ${slot.availableTime}`
          )
          .join(", "),
      })),
    [schedules]
  );

  return (
    <Card className="bg-rich-black ring-grey-400/40">
      <CardContent className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Agendamentos</h2>

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
            value={draft.activityId ? String(draft.activityId) : "all"}
            onValueChange={(v) =>
              setDraft((p) => ({
                ...p,
                activityId: v === "all" ? undefined : Number(v),
              }))
            }
          >
            <SelectTrigger className="w-56 bg-night">
              <SelectValue placeholder="Atividade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {activityOptions.map((a) => (
                <SelectItem key={a.id} value={String(a.id)}>
                  {a.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            filename="relatorio-agendamentos"
            columns={{
              atividade: "Atividade",
              tipo: "Tipo",
              modalidade: "Modalidade",
              pessoas: "Nº de pessoas",
              nome: "Nome",
              telefone: "Telefone",
              email: "E-mail",
              datas: "Datas",
            }}
          />
        </div>

        {generated && (
          <div className="rounded-md border border-gray-500">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-b-gray-500 hover:bg-transparent">
                  <TableHead className="text-earth-yellow">
                    Atividade
                  </TableHead>
                  <TableHead className="text-earth-yellow">
                    Modalidade
                  </TableHead>
                  <TableHead className="text-earth-yellow">Nome</TableHead>
                  <TableHead className="text-earth-yellow">
                    Telefone
                  </TableHead>
                  <TableHead className="text-earth-yellow">Datas</TableHead>
                  <TableHead className="text-earth-yellow">
                    Comprovante
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto text-earth-yellow" />
                    </TableCell>
                  </TableRow>
                )}
                {isError && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-destructive"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Erro ao carregar agendamentos.
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && !isError && schedules?.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Nenhum agendamento encontrado.
                    </TableCell>
                  </TableRow>
                )}
                {schedules?.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.activity.title}</TableCell>
                    <TableCell>{s.modality}</TableCell>
                    <TableCell>
                      {s.member.dharmaName || s.member.name}
                    </TableCell>
                    <TableCell>{s.member.phone}</TableCell>
                    <TableCell>
                      {s.slots
                        .map(
                          (slot) =>
                            `${formatDateOnlyPtBR(slot.availableData)} ${slot.availableTime}`
                        )
                        .join(", ")}
                    </TableCell>
                    <TableCell>
                      {s.paymentReceiptUrl && (
                        <Button asChild variant="outline" size="xs">
                          <a
                            href={s.paymentReceiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink />
                            Ver comprovante
                          </a>
                        </Button>
                      )}
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
