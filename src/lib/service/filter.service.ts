"use server";

import { apiFetch } from "../api-client";
import { isApiError } from "../ApiError";
import { ServiceResult } from "./user.service";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export type FilterType = {
  id: number;
  descricao: string;
};

export const fetchAllFilters = async (): Promise<FilterType[]> => {
  const { data } = await apiFetch<FilterType[]>("/filters", {
    method: "GET",
  });
  return data;
};

export async function handleCreateNewFilter(
  descricao: string
): Promise<ServiceResult<FilterType>> {
  try {
    const { data } = await apiFetch<FilterType>("/filters", {
      method: "POST",
      body: JSON.stringify({ descricao }),
    });
    return { ok: true, data };
  } catch (err) {
    if (isRedirectError(err)) throw err;

    if (isApiError(err)) {
      return {
        ok: false,
        status: err.status,
        message: err.data.message,
        code: err.data.code,
      };
    }
    return { ok: false, status: 500, message: "Erro inesperado. Tente novamente." };
  }
}

export async function handleDeleteFilter(
  id: number
): Promise<ServiceResult<FilterType>> {
  try {
    const { data } = await apiFetch<FilterType>(`/filters/${id}`, {
      method: "DELETE",
    });

    return { ok: true, data };
  } catch (err) {
    if (isRedirectError(err)) throw err;

    if (isApiError(err)) {
      return {
        ok: false,
        status: err.status,
        message: err.data.message,
        code: err.data.code,
      };
    }
    return { ok: false, status: 500, message: "Erro inesperado. Tente novamente." };
  }
}

export async function handleUpdateFilter({
  id,
  descricao,
}: FilterType): Promise<ServiceResult<FilterType>> {
  try {
    const { data } = await apiFetch<FilterType>(`/filters/${id}`, {
      method: "PUT",
      body: JSON.stringify({ descricao }),
    });
    return { ok: true, data };
  } catch (err) {
    if (isRedirectError(err)) throw err;

    if (isApiError(err)) {
      return {
        ok: false,
        status: err.status,
        message: err.data.message,
        code: err.data.code,
      };
    }
    return { ok: false, status: 500, message: "Erro inesperado. Tente novamente." };
  }
}
