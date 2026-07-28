import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

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
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You've already registered a team for SIGNAL QUEST.",
        });
      }

      return ctx.db.registration.create({
        data: {
          ...input,
          numParticipants: input.participantNames.length,
          entryFee: input.ieeeMember ? 350 : 500,
          email,
          userId: ctx.session.user.id,
        },
      });
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
        status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.db.registration.update({
        where: { id: input.id },
        data: { status: input.status },
      }),
    ),
});
