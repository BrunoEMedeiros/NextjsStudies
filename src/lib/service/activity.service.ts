"use server";

import { ActivitiesByMonthType } from "@/src/components/DateTimeActivityCalendar/useDateTimeActivity";
import { apiFetch } from "../api-client";
import { isApiError } from "../ApiError";
import { CreateActivity } from "../schemas/newActivity.schema";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { ActivityCardProps } from "@/src/components/ActivitiesContainer/ActivitiesContainer";

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

export type ActivityType = "event" | "course" | "ceremony";

export type PaginatedActivitiesResponse = {
  currentPage: number;
  activityCount: number;
  totalPages: number;
  hasMore: boolean;
  data: ActivityCardProps[];
};

interface FetchAllActivitiesParams {
  page?: number;
  type?: ActivityType;
  filterId?: number;
  paymentRequired?: boolean;
  dateFrom?: string | Date;
  dateTo?: string | Date;
  title?: string;
}

export const fetchAllActivities = async ({
  page,
  ...rest
}: FetchAllActivitiesParams = {}): Promise<PaginatedActivitiesResponse> => {
  const query = await buildQueryParams({
    ...rest,
    ...(page && { page }),
    dateFrom: rest.dateFrom ? new Date(rest.dateFrom) : undefined,
    dateTo: rest.dateTo ? new Date(rest.dateTo) : undefined,
  });

  const url = `/activity${query}`;

  console.log(url);

  const { data } = await apiFetch<PaginatedActivitiesResponse>(url);
  return data;
};

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

export const handleDeleteActivity = async (id: number) => {
  try {
    const { data } = await apiFetch(`/activity/${id}`, {
      method: "DELETE",
    });

    return { ok: true, data };
  } catch (err) {
    if (isApiError(err)) {
      return {
        ok: false,
        status: err.status,
        message: err.data.message,
        code: err.data.code,
      };
    }
    return { ok: false, status: 500, message: "Unexpected error" };
  }
};
