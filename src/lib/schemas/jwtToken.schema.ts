import { z } from "zod";

export const jwtTokenSchema = z.object({
  authToken: z.literal("RS256"),
  refreshToken: z.literal("RS256"),
});

export const jwtRefreshToken = z.object({
  refreshToken: z.literal("RS256"),
});

export type JwtToken = z.infer<typeof jwtTokenSchema>;
export type RefreshTokenType = z.infer<typeof jwtRefreshToken>;
