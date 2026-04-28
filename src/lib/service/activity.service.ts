"use server";

import { ActivitiesByMonthType } from "@/src/components/DateTimeActivityCalendar/useDateTimeActivity";
import { apiFetch } from "../api-client";
import { isApiError } from "../ApiError";
import { CreateActivity } from "../schemas/newActivity.schema";
import { isRedirectError } from "next/dist/client/components/redirect-error";

type QueryValue = string | number | boolean | Date | null | undefined;

export async function buildQueryParams(
  params: Record<string, QueryValue>
): Promise<string> {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === "") continue;

    if (value instanceof Date) {
      searchParams.set(key, value.toISOString());
    } else {
      searchParams.set(key, String(value));
    }
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

type ActivityPayload = Omit<
  CreateActivity,
  "card_image_url" | "publicity_image_url"
>;

export const fetchActivitiesByMonth = async (
  month: number
): Promise<Date[]> => {
  try {
    const { data } = await apiFetch<ActivitiesByMonthType[]>(
      `/activity/month/${month}`,
      { method: "GET" }
    );
    return data.map((item) => {
      const [year, month, day] = item.date.split("T")[0].split("-");
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    throw error;
  }
};

export const handleCreateNewActivity = async (
  payload: ActivityPayload,
  file: File
) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

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
    });

    return { ok: true, data };
  } catch (error) {
    if (isRedirectError(error)) throw error;

    if (isApiError(error)) {
      return {
        ok: false,
        status: error.status,
        code: error.data.code,
        message: error.data.message,
      };
    }

    return { ok: false, status: 500, message: "Erro inesperado" };
  }
};

interface FetchAllActivitiesParams {
  type?: string;
  filterId?: number;
  paymentRequired?: boolean;
  dateFrom?: string | Date;
  dateTo?: string | Date;
  title?: string;
}

export const fetchAllActivities = async ({
  type,
  filterId,
  paymentRequired,
  dateFrom,
  dateTo,
  title,
}: FetchAllActivitiesParams = {}) => {
  try {
    const query = buildQueryParams({
      type,
      filterId,
      paymentRequired,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
      title,
    });

    const { data } = await apiFetch(`/activities/all${query}`);

    return { ok: true, data };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    if (isApiError(error)) {
      return {
        ok: false,
        status: error.status,
        code: error.data.code,
        message: error.data.message,
      };
    }
    return { ok: false, status: 500, message: "Erro inesperado" };
  }
};
