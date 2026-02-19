import { CreateAccountSchema, UserRole } from "../schemas/user-register.schema";
import { apiFetch } from "../api-client";
import { ApiError } from "../ApiError";

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
