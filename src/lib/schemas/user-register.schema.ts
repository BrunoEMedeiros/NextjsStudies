import { isValidPhoneNumber } from "libphonenumber-js";
import z from "zod";

export enum UserRole {
  REGULAR = "regular",
  MAINTAINER = "maintainer",
  ADMINISTRATIVE = "administrative",
}

export const createAccountSchema = z
  .object({
    name: z
      .string("Nome invalido")
      .min(5, "Nome não pode ter menos que 5 caracteres")
      .max(50, "Nome só pode ter no maximo 50 caracteres")
      .trim()
      .toLowerCase(),
    dharmaName: z.string().trim().toLowerCase().optional(),
    email: z.email("Email inválido"),
    password: z
      .string()
      .min(6, "Minimo de 6 caracteres")
      .max(6, "Maximo de 6 caracteres")
      .trim(),
    conf_password: z.string().min(1, "Senhas não combinam").trim(),
    countryCode: z.string(),
    phone: z.string().min(11, "Telefone invalido").trim(),
  })
  .refine((data) => data.password === data.conf_password, {
    message: "Senhas não combinam",
    path: ["conf_password"], // This attaches the error to the conf_password field
  })
  .refine((data) => isValidPhoneNumber(data.countryCode + data.phone), {
    message: "Telefone inválido",
    path: ["phone"],
  });

export type CreateAccountSchema = z.infer<typeof createAccountSchema>;
