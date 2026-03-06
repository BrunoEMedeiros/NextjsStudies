import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

export const ProfileNameSchema = z.object({
  name: z
    .string("Nome invalido")
    .min(5, "Nome não pode ter menos que 5 caracteres")
    .max(50, "Nome só pode ter no maximo 50 caracteres")
    .trim()
    .toLowerCase(),
});

export const ProfileDharmaNameSchema = z.object({
  dharmaName: z.string().trim().toLowerCase(),
});

export const ProfileEmailSchema = z.object({
  email: z.email("Email invalido"),
});

export const ProfilePhoneSchema = z.object({
  phone: z.string().refine(isValidPhoneNumber, {
    message: "Telefone invalido",
  }),
});

export const ProfilePictureSchema = z.object({
  profilePicture: z.url("Insira uma URL valida").trim().optional(),
});

export const UserProfileSchema = z.object({
  name: z
    .string("Nome invalido")
    .min(5, "Nome não pode ter menos que 5 caracteres")
    .max(50, "Nome só pode ter no maximo 50 caracteres")
    .trim()
    .toLowerCase(),
  dharmaName: z.string().trim().toLowerCase().optional().default(""),
  email: z.email("Email inválido"),
  phone: z.string().trim(),
  profilePicture: z.url("Insira uma URL valida").trim().optional().default(""),
  role: z.string(),
});

export type ProfileNameType = z.infer<typeof ProfileNameSchema>;
export type ProfileDharmaNameType = z.infer<typeof ProfileDharmaNameSchema>;
export type ProfileEmailType = z.infer<typeof ProfileEmailSchema>;
export type ProfilePhoneType = z.infer<typeof ProfilePhoneSchema>;
export type ProfilePictureType = z.infer<typeof ProfilePictureSchema>;
export type UserProfileType = z.infer<typeof UserProfileSchema>;
