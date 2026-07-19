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
