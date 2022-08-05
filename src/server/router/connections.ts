import { createRouter } from "./context";
import { z } from "zod";

export const connectionsRouter = createRouter().query("getConnections", {
	input: z.object({
		userId: z.string().optional(),
	}),
	async resolve({ input, ctx }) {
		const userId = input?.userId;
		if (!userId) {
			return "broke1";
		}
		const account = await ctx.prisma.account.findFirst({ where: { userId } });
		if (!account) {
			return "broke2";
		}
		const connections = await fetch("https://discord.com/api/users/@me/connections", {
			headers: {
				Authorization: `Bearer ${account.access_token}`,
			},
		});
		const json = await connections.json();
		return json;
	},
});
