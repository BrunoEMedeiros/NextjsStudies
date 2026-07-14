"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import UsersReport from "./UsersReport/UsersReport";
import ActivitiesReport from "./ActivitiesReport/ActivitiesReport";
import SchedulesReport from "./SchedulesReport/SchedulesReport";
import DashboardReport from "./DashboardReport/DashboardReport";

export default function ReportsTabs() {
  return (
    <Tabs defaultValue="users" className="w-full">
      <TabsList>
        <TabsTrigger value="users">Usuários</TabsTrigger>
        <TabsTrigger value="activities">Atividades</TabsTrigger>
        <TabsTrigger value="schedules">Agendamentos</TabsTrigger>
        <TabsTrigger value="dashboard">Geral</TabsTrigger>
      </TabsList>

      <TabsContent value="users" className="mt-4">
        <UsersReport />
      </TabsContent>
      <TabsContent value="activities" className="mt-4">
        <ActivitiesReport />
      </TabsContent>
      <TabsContent value="schedules" className="mt-4">
        <SchedulesReport />
      </TabsContent>
      <TabsContent value="dashboard" className="mt-4">
        <DashboardReport />
      </TabsContent>
    </Tabs>
  );
}
