import { createRouter } from "./context";
import { z } from "zod";
// https://www.npmjs.com/package/steam-api

export const libraryRouter = createRouter()
	.query("getSteamGames", {
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
	})
	.mutation("toggleGameInstalled", {
		input: z.object({
			appId: z.string(),
			userId: z.string(),
			currentlyInstalled: z.boolean(),
		}),
		async resolve({ input, ctx }) {
			const { appId, userId, currentlyInstalled } = input;
			const { prisma } = ctx;
			let game = await prisma.userInstalledGames.findFirst({
				where: {
					userId,
					appId,
				},
			});
			if (!game) {
				game = await prisma.userUninstalledGames.findFirst({
					where: {
						userId,
						appId,
					},
				});
			}
			if (currentlyInstalled && game) {
				await prisma.userInstalledGames.delete({
					where: {
						id: game.id,
					},
				});
				await prisma.userUninstalledGames.create({
					data: {
						userId,
						appId,
					},
				});
			} else if (!currentlyInstalled && game) {
				await prisma.userUninstalledGames.delete({
					where: {
						id: game.id,
					},
				});
				await prisma.userInstalledGames.create({
					data: {
						userId,
						appId,
					},
				});
			} else {
				await prisma.userInstalledGames.create({
					data: {
						userId,
						appId,
					},
				});
			}
			return true;
		},
	})
	.query("getUserInstalledGames", {
		input: z.object({
			userId: z.string(),
		}),
		async resolve({ input, ctx }) {
			const { userId } = input;
			const { prisma } = ctx;
			const games = await prisma.userInstalledGames.findMany({
				where: {
					userId,
				},
			});
			return games.map(({ appId }) => appId);
		},
	});
