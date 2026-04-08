import { z } from "zod";

export const newFilterSchema = z.object({
  descricao: z.string().min(4, "Minimo de 4 caracteres"),
});

export type NewFilterType = z.infer<typeof newFilterSchema>;
