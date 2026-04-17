"use server";
import { CreateAccountSchema, UserRole } from "../schemas/user-register.schema";
import { apiFetch, AuthExpiredError } from "../api-client";
import { ApiError, isApiError } from "../ApiError";
import { UserProfileType } from "../schemas/user-profile.schema";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; code?: string; message: string };

export const handleCreateUser = async (
  user: CreateAccountSchema
): Promise<Promise<any>> => {
  try {
    const { data } = await apiFetch("/accounts", {
      method: "POST",
      body: JSON.stringify({
        name: user.name,
        email: user.email,
        password: user.password,
        role: UserRole.REGULAR,
        phone: user.countryCode + user.phone,
      }),
      cache: "no-store",
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

export const handleLoginUser = async (
  email: string,
  password: string
): Promise<any> => {
  try {
    const { data } = await apiFetch("/accounts/sessions/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      credentials: "include",
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

export const fetchProfile = async (): Promise<UserProfileType> => {
  const { data } = await apiFetch<UserProfileType>("/accounts/profile", {
    method: "GET",
  });
  return data;
};
