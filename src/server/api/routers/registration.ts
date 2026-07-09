import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { Track } from "../../../../generated/prisma";

export const registrationRouter = createTRPCRouter({
  register: protectedProcedure
    .input(
      z.object({
        fullName: z.string().min(1).max(100),
        email: z.string().email(),
        phone: z.string().min(7).max(15).optional(),
        college: z.string().max(120).optional(),
        teamName: z.string().max(60).optional(),
        track: z.nativeEnum(Track),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.registration.findUnique({
        where: { userId: ctx.session.user.id },
      });
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You are already registered for SIGNAL QUEST.",
        });
      }

      return ctx.db.registration.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
    }),

  mine: protectedProcedure.query(({ ctx }) =>
    ctx.db.registration.findUnique({
      where: { userId: ctx.session.user.id },
    }),
  ),
});
