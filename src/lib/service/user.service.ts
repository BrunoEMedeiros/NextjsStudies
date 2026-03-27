"use server";
import { CreateAccountSchema, UserRole } from "../schemas/user-register.schema";
import { apiFetch } from "../api-client";
import { ApiError } from "../ApiError";
import { UserProfileType } from "../schemas/user-profile.schema";
import { isRedirectError } from "next/dist/client/components/redirect-error";

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

    if (data.statusCode == 409) {
      throw new ApiError(data.statusCode, data);
    }

    return data;
  } catch (error) {
    if (isRedirectError(error)) throw error;
  }
};

export const handleLoginUser = async (
  email: string,
  password: string
): Promise<any> => {
  try {
    const { data } = await apiFetch("/accounts/sessions/signin", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      credentials: "include",
    });

    return data;
  } catch (error) {
    if (isRedirectError(error)) throw error;
  }
};

export const fetchProfile = async (): Promise<UserProfileType> => {
  const { data } = await apiFetch<UserProfileType>("/accounts/profile", {
    method: "GET",
  });

  return data;
};
