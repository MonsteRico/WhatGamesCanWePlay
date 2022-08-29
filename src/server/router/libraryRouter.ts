import { createProtectedRouter } from "./protected-router";
import { z } from "zod";
import { Prisma } from "@prisma/client";
// https://www.npmjs.com/package/steam-api

export const libraryRouter = createProtectedRouter()
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
			// TODO REPLACE THIS WITH A SINGLE QUERY CALL TO THE DATABASE
			// 			console.log(steamIds);
			// 			const steamIdsString = steamIds.map((steamId) => `"${steamId}"`);
			// 			const steamIdsStringJoined = "(" + steamIdsString.join(",") + ")";
			// 			const games = await prisma.$queryRaw(Prisma.sql`
			// 				SELECT id FROM (
			//     (
			//         SELECT UserInstalledGames.appId AS id, COUNT(UserInstalledGames.steamId) AS amt, items.total AS total
			//         FROM (
			//             UserInstalledGames
			//             CROSS JOIN (
			//                 SELECT COUNT(DISTINCT UserInstalledGames.steamId) AS total
			//                     FROM UserInstalledGames WHERE UserInstalledGames.steamId IN ${steamIdsStringJoined}
			//             ) AS items
			//         )
			//         WHERE UserInstalledGames.steamId IN ${steamIdsStringJoined}
			//         GROUP BY UserInstalledGames.appId
			//     ) AS table_name
			// ) where (amt = total)
			// 				`);

			// if any steamIds are null, remove them
			if (steamIds) {
				const filteredSteamIds = steamIds.filter((steamId) => steamId !== null) as string[];

				if (filteredSteamIds.length !== steamIds.length) {
					return [];
				}
				// TODO fix this
				const games = await prisma.userInstalledGames.findMany({
					where: {
						steamId: {
							in: filteredSteamIds,
						},
					},
				});
				let gameIds = games.map((game) => game.appId);
				if (steamIds.length > 1) {
					gameIds = gameIds.filter(
						(
							(s) => (v) =>
								s.has(v) || !s.add(v)
						)(new Set())
					);
				}
				return gameIds;
			}
		},
	});
