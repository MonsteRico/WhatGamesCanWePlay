// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { protectedExampleRouter } from "./protected-example-router";
import { libraryRouter } from "./libraryRouter";

export const appRouter = createRouter()
	.transformer(superjson)
	.merge("example.", exampleRouter)
	.merge("library.", libraryRouter)
	.merge("question.", protectedExampleRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
