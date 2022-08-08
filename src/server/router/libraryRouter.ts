import { createRouter } from "./context";
import { z } from "zod";
import SteamAPI, { AppDetails, OwnedGame, SteamCategory } from "type-steamapi";

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
	// .query("getMultiplayerGames", {
	// 	input: z.object({
	// 		steamId: z.string(),
	// 	}),
	// 	async resolve({ input, ctx }) {
	// 		const { steamId } = input;
	// 		const { steam } = ctx;
	// 		let multiplayerGames: OwnedGame[] = [];
	// 		const games = await steam.getUserOwnedGames(steamId as string);
	// 		let gameData: AppDetails | null;
	// 		if (games) {
	// 			for (let i = 0; i < games.length; i++) {
	// 				const data = await fetch(`https://nebukam.github.io/steam-db/app/${games[i]?.appId}/infos.json`)
	// 					.then((res) => res.json())
	// 					.then((data) => data);
	// 				if (data) {
	// 					console.log(data);
	// 				}
	// 			}
	// 		}
	// 		// console.log(games);
	// 		return multiplayerGames;
	// 	},
	// })
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

async function isMultiplayer(appId: string, steam: SteamAPI) {
	const game = await steam.getAppDetails(appId);
	if (game) {
		const { categories } = game;
		if (categories.includes({ id: 1, dscription: "Multi-player" } as any)) {
			return true;
		}
	}
	return false;
}
