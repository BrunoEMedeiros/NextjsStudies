"use server";

import { ActivitiesByMonthType } from "@/src/components/DateTimeActivityCalendar/useDateTimeActivity";
import { apiFetch } from "../api-client";
import { isApiError } from "../ApiError";
import { CreateActivity } from "../schemas/newActivity.schema";

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

type ActivityPayload = Omit<
  CreateActivity,
  "card_image_url" | "publicity_image_url"
>;

export const handleCreateNewActivity = async (
  payload: ActivityPayload,
  file: File
) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    // 2. Append the rest of the text/array data
    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (typeof value === "object" || Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    const { data } = await apiFetch<CreateActivity>("/activity", {
      method: "POST",
      body: formData,
      // Note: We deliberately DO NOT set {"Content-Type": "multipart/form-data"} here.
      // The browser will set it automatically with the correct boundary string.
    });

    return { ok: true, data };
  } catch (err: any) {
    if (err.status) {
      return {
        ok: false,
        status: err.status,
        message: err.data?.message || "Error",
        code: err.data?.code,
      };
    }
    return { ok: false, status: 500, message: "Unexpected error" };
  }
};
