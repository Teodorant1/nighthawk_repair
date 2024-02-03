import { publicProcedure, router } from "./trpc";
import { z } from "zod";

export const appRouter = router({
  getTodos: publicProcedure.input(z.string()).query(async () => {
    return [10, 20, 30];
  }),
});

export type appRouter = typeof appRouter;
