import { createRouter } from "./context";
import { z } from "zod";
// https://www.npmjs.com/package/steam-api

export const libraryRouter = createRouter()
	.query("getGames", {
		input: z.object({
			steamId: z.string(),
		}),
		async resolve({ input, ctx }) {
			const { steamId } = input;
			const { steam } = ctx;
			const games = await steam.getUserOwnedGames(steamId as string);
			// console.log(games);
			return games;
		},
	})
	.query("getGame", {
		input: z.object({
			appId: z.string(),
		}),
		async resolve({ input, ctx }) {
			const { appId } = input;
			const { steam } = ctx;
			const game = await steam.getAppDetails(appId as string);
			// console.log(game);
			return game;
		},
	});
