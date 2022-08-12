import { createRouter } from "./context";
import { z } from "zod";

export const helloRouter = createRouter().query("world", {
	input: z
		.object({
			text: z.string().nullish(),
		})
		.nullish(),
	resolve({ input }) {
		return {
			greeting: `Hello ${input?.text ?? "world"}`,
		};
	},
});
