import z from "zod";

export const usersSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.enum(["regular", "maintainer", "administrative"]).default("regular"),
  email: z.email(),
  status: z.number(),
  phone: z.string(),
  dharmaName: z.string(),
});

export type UserType = z.infer<typeof usersSchema>;
