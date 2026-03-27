"use server";

import { ActivitiesByMonthType } from "@/src/components/DateTimeActivityCalendar/useDateTimeActivity";
import { apiFetch } from "../api-client";

export const fetchActivitiesByMonth = async (
  month: number
): Promise<Date[]> => {
  console.log(month);

  const { data } = await apiFetch<ActivitiesByMonthType[]>(
    `/activity/month/${month}`,
    {
      method: "GET",
    }
  );

  console.log(data);

  return data.map((item) => {
    const [year, month, day] = item.date.split("T")[0].split("-");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  });
};
