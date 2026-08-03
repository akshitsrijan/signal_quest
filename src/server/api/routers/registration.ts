import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { THEMES, type Theme } from "~/lib/themes";

const themeIds = THEMES.map((theme) => theme.id) as [Theme, ...Theme[]];

export const registrationRouter = createTRPCRouter({
  mine: protectedProcedure.query(({ ctx }) => {
    if (!ctx.session.user.email) return null;
    return ctx.db.registration.findUnique({
      where: { email: ctx.session.user.email },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        teamName: z.string().min(1),
        teamLeaderName: z.string().min(1),
        teamLeaderPhone: z.string().min(1),
        collegeName: z.string().min(1),
        participantNames: z.array(z.string().min(1)).max(3),
        ieeeMember: z.boolean(),
        ieeeMembershipId: z.string().min(1).optional(),
        theme: z.enum(themeIds),
        paymentProofUrl: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const email = ctx.session.user.email;
      if (!email) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Your account needs an email address to register.",
        });
      }

      const existing = await ctx.db.registration.findUnique({
        where: { email },
      });
      if (existing && existing.status !== "REJECTED") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You've already registered a team for SIGNAL QUEST.",
        });
      }

      const data = {
        ...input,
        numParticipants: input.participantNames.length,
        entryFee: input.ieeeMember ? 400 : 500,
        email,
        userId: ctx.session.user.id,
        status: "PENDING" as const,
      };

      // A rejected registration can be corrected and resubmitted by updating
      // the same row (and resetting its status) rather than creating a
      // second one, since `email` is unique.
      if (existing) {
        return ctx.db.registration.update({
          where: { id: existing.id },
          data,
        });
      }

      return ctx.db.registration.create({ data });
    }),

  list: adminProcedure.query(({ ctx }) =>
    ctx.db.registration.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ),

  setStatus: adminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["PENDING", "APPROVED", "REJECTED", "ON_HOLD"]),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.db.registration.update({
        where: { id: input.id },
        data: { status: input.status },
      }),
    ),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.db.registration.delete({ where: { id: input.id } }),
    ),
});
