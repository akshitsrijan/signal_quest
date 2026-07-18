import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const announcementRouter = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) =>
    ctx.db.announcement.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ),
});
