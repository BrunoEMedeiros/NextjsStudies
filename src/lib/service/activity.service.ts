"use server";

import { ActivitiesByMonthType } from "@/src/components/DateTimeActivityCalendar/useDateTimeActivity";
import { apiFetch } from "../api-client";
import { isApiError } from "../ApiError";
import { CreateActivity } from "../schemas/newActivity.schema";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { ActivityCardProps } from "@/src/components/ActivitiesContainer/ActivitiesContainer";
import { UpdateActivity } from "../schemas/updateActivity.schema";

type QueryValue = string | number | boolean | Date | null | undefined;

export type ActivityType = "event" | "course" | "ceremony";

export type PaginatedActivitiesResponse = {
  currentPage: number;
  activityCount: number;
  totalPages: number;
  hasMore: boolean;
  data: ActivityCardProps[];
};

type ActivityPayload = Omit<
  CreateActivity,
  "card_image_url" | "publicity_image_url"
>;

interface FetchAllActivitiesParams {
  page?: number;
  type?: ActivityType;
  filterId?: number;
  paymentRequired?: boolean;
  dateFrom?: string | Date;
  dateTo?: string | Date;
  title?: string;
}

export type ActivityDetails = {
  id: number;
  title: string;
  description: string;
  type: "event" | "course" | "ceremony";
  status: number;
  card_image_url: string;
  social_media_url?: string;
  payment_required: boolean;
  payment_sugestion?: number;
  Dates: { date: string; time: string }[];
  filters: { id: number; descricao: string }[];
};

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

  // console.log(url);

  const { data } = await apiFetch<PaginatedActivitiesResponse>(url);
  return data;
};

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

export const fetchActivityById = async (
  id: number
): Promise<ActivityDetails> => {
  const { data } = await apiFetch<ActivityDetails>(`/activity/${id}`);
  return data;
};

export const handleUpdateActivity = async (
  id: number,
  payload: UpdateActivity,
  file?: File
) => {
  try {
    let body: FormData | string;
    const headers: Record<string, string> = {};

    if (file) {
      const form = new FormData();
      form.append("file", file);
      Object.entries(payload).forEach(([k, v]) => {
        if (v === undefined) return;
        form.append(k, typeof v === "object" ? JSON.stringify(v) : String(v));
      });
      body = form;
    } else {
      body = JSON.stringify(payload);
      headers["Content-Type"] = "application/json";
    }

    const { data } = await apiFetch(`/activity/${id}`, {
      method: "PATCH",
      body,
      headers,
    });

    return { ok: true, data };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    if (isApiError(error))
      return { ok: false, status: error.status, message: error.data.message };
    return { ok: false, status: 500, message: "Erro inesperado" };
  }
};

export const handleActivateActivity = async (id: number) => {
  try {
    const { data } = await apiFetch(`/activity/activate/${id}`, {
      method: "PATCH",
    });

    return { ok: true, data };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    if (isApiError(error))
      return { ok: false, status: error.status, message: error.data.message };
    return { ok: false, status: 500, message: "Erro inesperado" };
  }
};
