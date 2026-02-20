import { CreateAccountSchema, UserRole } from "../schemas/user-register.schema";
import { apiFetch } from "../api-client";
import { ApiError } from "../ApiError";
import { SigninUserSchema } from "../schemas/user-signin.schema";
import { JwtToken } from "../schemas/jwtToken.schema";

export const handleCreateUser = async (
  user: CreateAccountSchema
): Promise<Promise<any>> => {
  const response = await apiFetch("/accounts", {
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

  if (response.statusCode == 409) {
    throw new ApiError(response.statusCode, response);
  }

  return response;
};

export const handleLoginUser = async ({
  email,
  password,
}: SigninUserSchema): Promise<JwtToken> => {
  const data = await apiFetch<JwtToken>("/accounts/sessions/signin", {
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  return data;
};
