"use client";

import { useMemo } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent } from "@/src/components/ui/card";
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
import { ACTIVITY_TYPE_LABELS as TYPE_LABELS } from "@/src/lib/activityType";

const COLOR_PRIMARY = "#dbad6c";
const COLOR_SECONDARY = "#f58987";
const COLOR_SUCCESS = "#00875f";
const TYPE_COLORS: Record<string, string> = {
  event: COLOR_PRIMARY,
  course: COLOR_SECONDARY,
  ceremony: COLOR_SUCCESS,
};

const tooltipStyle = {
  contentStyle: {
    background: "#0e141b",
    border: "1px solid #333333",
    borderRadius: 8,
  },
  labelStyle: { color: "#f2f3f4" },
  itemStyle: { color: "#f2f3f4" },
};

const axisProps = { stroke: "#808080", fontSize: 12 };

// timeZone: "UTC" avoids shifting a UTC-midnight date back a day/month for
// viewers in negative-offset timezones (e.g. Brazil, UTC-3).
const formatMonthShort = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
    month: "short",
    year: "2-digit",
  });

const formatMonthFull = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
    month: "long",
    year: "numeric",
  });

const formatCurrency = (value: number) =>
  `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

export default function DashboardReport() {
  const { data, isLoading, isError } = useDashboardReport();

  const activitiesPerMonth = useMemo(
    () =>
      data?.activitiesPerMonth.map((m) => ({
        ...m,
        label: formatMonthShort(m.month),
      })) ?? [],
    [data?.activitiesPerMonth]
  );
  const schedulesPerMonth = useMemo(
    () =>
      data?.schedulesPerMonth.map((m) => ({
        ...m,
        label: formatMonthShort(m.month),
      })) ?? [],
    [data?.schedulesPerMonth]
  );
  const expectedRevenuePerMonth = useMemo(
    () =>
      data?.expectedRevenuePerMonth.map((m) => ({
        ...m,
        label: formatMonthShort(m.month),
      })) ?? [],
    [data?.expectedRevenuePerMonth]
  );
  const schedulesByFilter = useMemo(
    () =>
      data?.schedulesByFilter.map((f) => ({
        ...f,
        label: f.descricao,
      })) ?? [],
    [data?.schedulesByFilter]
  );

  if (isLoading) {
    return <Loader2 className="w-5 h-5 animate-spin text-earth-yellow" />;
  }

  if (isError) {
    return (
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle className="w-4 h-4" />
        Erro ao carregar relatório geral.
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
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
                  <TableHead className="text-earth-yellow">Nome</TableHead>
                  <TableHead className="text-earth-yellow">E-mail</TableHead>
                  <TableHead className="text-earth-yellow">
                    Telefone
                  </TableHead>
                  <TableHead className="text-earth-yellow">Perfil</TableHead>
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
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={activitiesPerMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
              <XAxis dataKey="label" {...axisProps} />
              <YAxis allowDecimals={false} {...axisProps} />
              <Tooltip
                {...tooltipStyle}
                labelFormatter={(_, payload) =>
                  payload?.[0]
                    ? formatMonthFull(payload[0].payload.month)
                    : ""
                }
              />
              <Bar
                dataKey="count"
                name="Quantidade"
                fill={COLOR_PRIMARY}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-rich-black ring-grey-400/40">
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg font-semibold text-white">
              Agendamentos por mês
            </h2>
            <ExportButtons
              data={data.schedulesPerMonth}
              filename="agendamentos-por-mes"
              columns={{ month: "Mês", count: "Quantidade" }}
            />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={schedulesPerMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
              <XAxis dataKey="label" {...axisProps} />
              <YAxis allowDecimals={false} {...axisProps} />
              <Tooltip
                {...tooltipStyle}
                labelFormatter={(_, payload) =>
                  payload?.[0]
                    ? formatMonthFull(payload[0].payload.month)
                    : ""
                }
              />
              <Bar
                dataKey="count"
                name="Quantidade"
                fill={COLOR_SECONDARY}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-rich-black ring-grey-400/40">
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg font-semibold text-white">
              Receita esperada por mês
            </h2>
            <ExportButtons
              data={data.expectedRevenuePerMonth}
              filename="receita-esperada-por-mes"
              columns={{ month: "Mês", revenue: "Receita esperada" }}
            />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={expectedRevenuePerMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
              <XAxis dataKey="label" {...axisProps} />
              <YAxis
                tickFormatter={(v) => formatCurrency(v)}
                width={90}
                {...axisProps}
              />
              <Tooltip
                {...tooltipStyle}
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(_, payload) =>
                  payload?.[0]
                    ? formatMonthFull(payload[0].payload.month)
                    : ""
                }
              />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Receita esperada"
                stroke={COLOR_SUCCESS}
                strokeWidth={2}
                dot={{ fill: COLOR_SUCCESS }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-rich-black ring-grey-400/40">
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg font-semibold text-white">
              Agendamentos por tipo de atividade
            </h2>
            <ExportButtons
              data={data.schedulesByActivityType}
              filename="agendamentos-por-tipo"
              columns={{ type: "Tipo", count: "Quantidade" }}
            />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data.schedulesByActivityType}
                dataKey="count"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, value }) =>
                  `${TYPE_LABELS[String(name)] ?? name} (${value})`
                }
              >
                {data.schedulesByActivityType.map((entry) => (
                  <Cell
                    key={entry.type}
                    fill={TYPE_COLORS[entry.type] ?? "#808080"}
                  />
                ))}
              </Pie>
              <Tooltip
                {...tooltipStyle}
                formatter={(value, _name, item) => [
                  value,
                  TYPE_LABELS[item.payload.type] ?? item.payload.type,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-rich-black ring-grey-400/40">
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg font-semibold text-white">
              Agendamentos por filtro de atividade
            </h2>
            <ExportButtons
              data={data.schedulesByFilter}
              filename="agendamentos-por-filtro"
              columns={{ descricao: "Filtro", count: "Quantidade" }}
            />
          </div>
          {schedulesByFilter.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum agendamento com filtros associados.
            </p>
          ) : (
            <ResponsiveContainer
              width="100%"
              height={Math.max(200, schedulesByFilter.length * 44)}
            >
              <BarChart data={schedulesByFilter} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                <XAxis type="number" allowDecimals={false} {...axisProps} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={140}
                  {...axisProps}
                />
                <Tooltip {...tooltipStyle} />
                <Bar
                  dataKey="count"
                  name="Quantidade"
                  fill={COLOR_PRIMARY}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
