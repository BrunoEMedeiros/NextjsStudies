import { z } from "zod";
import { ACCEPTED_IMAGE_TYPES } from "./newActivity.schema";

export const postSchema = z.object({
  id: z.number(),
  title: z.string(),
  text: z.string(),
  image_url: z.string().nullable().optional(),
  file_url: z.string().nullable().optional(),
  createdAt: z.string(),
  userId: z.string(),
});

export type PostType = z.infer<typeof postSchema>;

export const MAX_POST_FILE_SIZE = 5 * 1024 * 1024;

function buildOptionalFileField(acceptedMimeTypes?: string[]) {
  return z
    .any()
    .transform((val) => {
      if (typeof FileList !== "undefined" && val instanceof FileList) {
        return val.length > 0 ? val[0] : undefined;
      }
      return val;
    })
    .refine(
      (val) => val === undefined || (typeof File !== "undefined" && val instanceof File),
      { message: "Arquivo invalido" }
    )
    .refine((val) => val === undefined || val.size <= MAX_POST_FILE_SIZE, {
      message: "O arquivo deve ter no maximo 5MB",
    })
    .refine(
      (val) =>
        val === undefined ||
        !acceptedMimeTypes ||
        acceptedMimeTypes.includes(val.type),
      { message: "Formato inválido. Use JPEG, PNG ou WEBP." }
    )
    .optional();
}

// "image" only accepts real image mimetypes; "file" stays permissive for
// attachments like PDFs.
const optionalImageField = buildOptionalFileField(ACCEPTED_IMAGE_TYPES);
const optionalFileField = buildOptionalFileField();

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "Escreva um titulo para a postagem")
    .max(150, "O titulo pode ter no maximo 150 caracteres"),
  text: z.string().min(1, "A postagem precisa de um texto"),
  image: optionalImageField,
  file: optionalFileField,
});

export type CreatePost = z.infer<typeof createPostSchema>;

export const updatePostSchema = z.object({
  id: z.number(),
  title: z
    .string()
    .min(1, "Escreva um titulo para a postagem")
    .max(150, "O titulo pode ter no maximo 150 caracteres")
    .optional(),
  text: z.string().optional(),
  image: optionalImageField,
  file: optionalFileField,
});

export type UpdatePost = z.infer<typeof updatePostSchema>;
