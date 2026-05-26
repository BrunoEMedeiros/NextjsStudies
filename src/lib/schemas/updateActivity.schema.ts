import { z } from "zod";
import {
  ACCEPTED_IMAGE_TYPES,
  createActivityDateSchema,
  FilterSchema,
  MAX_FILE_SIZE,
} from "./newActivity.schema";

export const updateActivitySchema = z.object({
  activities_dates: z.array(createActivityDateSchema).optional(),
  filters: z.array(FilterSchema).optional(),
  title: z
    .string()
    .min(5, "Titulo muito curto, minimo de 5 caracteres")
    .max(30, "Titulo muito longo, maximo de 30 caracteres")
    .trim()
    .toLowerCase()
    .optional(),
  description: z
    .string()
    .min(10, "Descrição muito curta, minimo de 10 caracteres")
    .max(500, "Description too long (max 225 chars)")
    .trim()
    .toLowerCase()
    .optional(),
  card_image_url: z
    .any()
    .refine((file) => !!file, "A imagem é obrigatória.")
    .refine(
      (file) => typeof window !== "undefined" && file instanceof File,
      "O arquivo selecionado é inválido."
    )
    .refine(
      (file) => file?.size <= MAX_FILE_SIZE,
      "A imagem deve ter no máximo 5MB."
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Formato inválido. Use JPEG, PNG ou WEBP."
    )
    .optional(),
  publicity_image_url: z.url("Insira uma URL valida").optional(),
  social_media_url: z.url("Insira uma URL valida").optional(),
  color_caption: z
    .string()
    .trim()
    .regex(/^#([A-Fa-f0-9]{6})$/, {
      message: "Must be a valid 6-digit hex color (e.g., #RRGGBB)",
    })
    .optional(),
  payment_required: z.boolean().default(false).optional(),
  payment_sugestion: z.number().optional(),
  type: z.enum(["event", "course", "ceremony"]).default("event").optional(),
});

export type UpdateActivity = z.infer<typeof updateActivitySchema>;
