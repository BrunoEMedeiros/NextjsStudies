import { z } from "zod";

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
  activities_dates: z.array(createActivityDateSchema),
  filters: z.array(FilterSchema),
  title: z
    .string()
    .min(5, "Titulo muito curto, minimo de 5 caracteres")
    .max(50, "Titulo muito longo, maximo de 20 caracteres")
    .trim()
    .toLowerCase(),
  description: z
    .string()
    .min(10, "Descrição muito curta, minimo de 5 caracteres")
    .max(500, "Description too long (max 225 chars)")
    .trim()
    .toLowerCase(),
  card_image_url: z.url("Insira uma URL valida"),
  publicity_image_url: z.url("Insira uma URL valida"),
  social_media_url: z.url("Insira uma URL valida"),
  color_caption: z
    .string()
    .trim()
    .regex(/^#([A-Fa-f0-9]{6})$/, {
      message: "Must be a valid 6-digit hex color (e.g., #RRGGBB)",
    }),
  payment_required: z.boolean().default(false),
  payment_sugestion: z.number().positive().optional(),
});

// Infer TypeScript type from schema
export type CreateActivity = z.infer<typeof createActivitySchema>;

export type ActivityAvaliableDates = z.infer<typeof createActivityDateSchema>;
