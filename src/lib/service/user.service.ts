import { CreateAccountSchema, UserRole } from "../schemas/user-register.schema";
import { apiFetch } from "../api-client";
import { ApiError } from "../ApiError";
import { SigninUserSchema } from "../schemas/user-signin.schema";
import { signin } from "../feature/auth/authSlice";

export const handleCreateUser = async (
  user: CreateAccountSchema
): Promise<Promise<any>> => {
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
};

export const handleLoginUser = async ({
  email,
  password,
}: SigninUserSchema): Promise<{
  email: string;
  name: string;
  profile_picture: string;
  role: string;
}> => {
  const { data } = await apiFetch<{
    email: string;
    name: string;
    profile_picture: string;
    role: string;
  }>("/accounts/sessions/signin", {
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  return data;
};
