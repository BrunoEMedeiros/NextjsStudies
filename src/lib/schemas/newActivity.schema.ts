import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const createActivityDateSchema = z.object({
  date: z.string().refine(
    (value) => {
      // Try to parse the date - be more flexible with formats
      const date = new Date(value);
      return !isNaN(date.getTime());
    },
    {
      message: "Invalid datetime format",
    }
  ),
  time: z.string().refine(
    (value) => {
      return /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(value);
    },
    {
      message: "Time must be in HH:MM:SS format (00:00:00 to 23:59:59)",
    }
  ),
});

// Main activity schema
export const FilterSchema = z.object({
  id: z.int().positive(),
});

export const createActivityFilterSchema = z.object({
  filterId: z.int().positive(),
  activityId: z.int().positive(),
});

export const createActivitySchema = z.object({
  activities_dates: z.array(createActivityDateSchema).optional(),
  filters: z.array(FilterSchema).optional(),
  title: z
    .string()
    .min(5, "Titulo muito curto, minimo de 5 caracteres")
    .max(50, "Titulo muito longo, maximo de 20 caracteres")
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
    .refine((file) => !!file, "A imagem é obrigatória.") // Check if it exists
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
    ),
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
  payment_sugestion: z.number().positive().optional(),
  type: z.enum(["event", "course", "ceremony"]).default("event"),
});

// Infer TypeScript type from schema
export type CreateActivity = z.infer<typeof createActivitySchema>;

export type ActivityAvaliableDates = z.infer<typeof createActivityDateSchema>;
