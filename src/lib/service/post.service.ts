"use server";

import { apiFetch } from "../api-client";
import { isApiError } from "../ApiError";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { CreatePost, PostType, UpdatePost } from "../schemas/post.schema";

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; code?: string; message: string };

export const fetchAllPosts = async (): Promise<PostType[]> => {
  try {
    const { data } = await apiFetch<PostType[]>("/post/all", {
      method: "GET",
    });
    return data;
  } catch (error) {
    if (isRedirectError(error)) throw error;
    throw error;
  }
};

const buildPostFormData = (payload: Record<string, unknown>): FormData => {
  const { image, file, ...rest } = payload;
  const formData = new FormData();

  Object.entries(rest).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    formData.append(key, String(value));
  });

  if (image instanceof File) formData.append("image", image);
  if (file instanceof File) formData.append("file", file);

  return formData;
};

export const handleCreatePost = async (
  payload: CreatePost
): Promise<ServiceResult<PostType>> => {
  try {
    const { data } = await apiFetch<PostType>("/post", {
      method: "POST",
      body: buildPostFormData(payload),
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

export const handleUpdatePost = async (
  id: number,
  payload: Omit<UpdatePost, "id">
): Promise<ServiceResult<{ message: string }>> => {
  try {
    const { data } = await apiFetch<{ message: string }>(
      `/post/update/${id}`,
      {
        method: "PATCH",
        body: buildPostFormData({ id, ...payload }),
      }
    );

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

export const handleDeletePost = async (
  id: number
): Promise<ServiceResult<void>> => {
  try {
    const { data } = await apiFetch(`/post/${id}`, {
      method: "DELETE",
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
