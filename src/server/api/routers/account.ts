import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { hashPassword } from "~/server/auth/password";

export const accountRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        email: z.string().email(),
        password: z.string().min(8).max(72),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.user.findUnique({
        where: { email: input.email },
      });
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "An account with this email already exists. Try signing in instead.",
        });
      }

      const passwordHash = await hashPassword(input.password);
      await ctx.db.user.create({
        data: { name: input.name, email: input.email, passwordHash },
      });

      return { success: true as const };
    }),
});
