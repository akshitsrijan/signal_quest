import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";
import { isEnvAdminEmail } from "~/lib/admin";
import { env } from "~/env";

function envAdmins(): string[] {
  return (env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export const adminRouter = createTRPCRouter({
  list: adminProcedure.query(async ({ ctx }) => ({
    envAdmins: envAdmins(),
    grantedAdmins: await ctx.db.adminEmail.findMany({
      orderBy: { createdAt: "asc" },
    }),
  })),

  add: adminProcedure
    .input(z.object({ email: z.string().trim().email() }))
    .mutation(async ({ ctx, input }) => {
      const email = input.email.toLowerCase();

      if (isEnvAdminEmail(email)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This email already has built-in admin access.",
        });
      }

      return ctx.db.adminEmail.upsert({
        where: { email },
        update: {},
        create: { email, addedBy: ctx.session.user.email },
      });
    }),

  remove: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const target = await ctx.db.adminEmail.findUnique({
        where: { id: input.id },
      });

      if (target && target.email === ctx.session.user.email?.toLowerCase()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You can't remove your own admin access.",
        });
      }

      return ctx.db.adminEmail.delete({ where: { id: input.id } });
    }),
});
