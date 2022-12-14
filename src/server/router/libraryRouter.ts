import { createProtectedRouter } from "./protected-router";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { createRouter } from "./context";
import safeAppIds from "../../utils/homeScreenAppIds";
// https://www.npmjs.com/package/steam-api

export const libraryRouter = createProtectedRouter()
	.query("getSteamGames", {
		input: z.object({
			steamId: z.string(),
		}),
		async resolve({ input, ctx }) {
			const { steamId } = input;
			const { steam } = ctx;
			console.log("pregames");
			try {
				const games = await steam.getUserOwnedGames(steamId as string);
				console.log("games");
				console.log(games);
				return games;
			} catch (e) {
				return [null];
			}
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
			steamId: z.string(),
			currentlyInstalled: z.boolean(),
		}),
		async resolve({ input, ctx }) {
			const { appId, steamId, currentlyInstalled } = input;
			const { prisma } = ctx;
			let game = await prisma.userInstalledGames.findFirst({
				where: {
					steamId,
					appId,
				},
			});
			if (!game) {
				game = await prisma.userUninstalledGames.findFirst({
					where: {
						steamId,
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
						steamId,
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
						steamId,
						appId,
					},
				});
			} else {
				await prisma.userInstalledGames.create({
					data: {
						steamId,
						appId,
					},
				});
			}
			return true;
		},
	})
	.query("getUserInstalledGames", {
		input: z.object({
			steamId: z.string(),
		}),
		async resolve({ input, ctx }) {
			const { steamId } = input;
			const { prisma } = ctx;
			const games = await prisma.userInstalledGames.findMany({
				where: {
					steamId,
				},
			});
			return games.map((game) => game.appId);
		},
	})
	.query("getUsersInstalledGames", {
		input: z.object({
			steamIds: z.array(z.string().nullable()).nullable(),
		}),
		async resolve({ input, ctx }): Promise<any> {
			const { steamIds } = input;
			const { prisma } = ctx;

			// if any steamIds are null, remove them
			if (steamIds && steamIds.length > 0) {
				const filteredSteamIds = steamIds.filter((steamId) => steamId !== null) as string[];

				if (filteredSteamIds.length !== steamIds.length) {
					return [];
				}
				const games = await prisma.userInstalledGames.findMany({
					where: {
						steamId: {
							in: filteredSteamIds,
						},
					},
				});

				// filter the array to only include games that are in all steamIds
				const gamesFiltered = games.filter((game) => {
					const gameCount = games.filter((game2) => game2.appId === game.appId).length;
					return gameCount === filteredSteamIds.length;
				});
				let gameIds = gamesFiltered.map((game) => game.appId);
				// remove duplicates from gameIds
				gameIds = gameIds.filter((gameId, index) => gameIds.indexOf(gameId) === index);
				return gameIds;
			}
		},
	})
	.mutation("setUserSteamId", {
		input: z.object({
			steamId: z.string(),
		}),
		async resolve({ input, ctx }) {
			const { steamId } = input;
			const { prisma, session } = ctx;
			const user = session.user;
			await prisma.user.update({
				where: {
					id: user.id,
				},
				data: {
					steamId,
				},
			});
			if (user.steamId) {
				await prisma.userInstalledGames.updateMany({
					where: {
						steamId: user.steamId,
					},
					data: {
						steamId,
					},
				});
				await prisma.userUninstalledGames.updateMany({
					where: {
						steamId: user.steamId,
					},
					data: {
						steamId,
					},
				});
			}
			return true;
		},
	});
