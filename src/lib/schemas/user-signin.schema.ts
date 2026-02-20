import z from "zod";

export const signinUserSchema = z.object({
  email: z.email("Email inválido"),
  password: z
    .string()
    .min(6, "Minimo de 6 caracteres")
    .max(6, "Maximo de 6 caracteres")
    .trim(),
});

export type SigninUserSchema = z.infer<typeof signinUserSchema>;
