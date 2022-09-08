import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server.mjs";
import { Connections } from "../../../types/types";
import { steam } from "../../../utils/steam";
export const authOptions: NextAuthOptions = {
	// Include user.id on session
	callbacks: {
		async session({ session, user }) {
			if (session.user) {
				session.user.id = user.id;
				session.user.steamId = user.steamId as string;
				if (user.steamId) {
					await prisma.user.upsert({
						where: { id: user.id },
						update: { steamId: session.user.steamId },
						create: { id: user.id },
					});
				}
			}
			return session;
		},
		async signIn({ user, account, profile, email, credentials }) {
			const connections = await fetch("https://discord.com/api/users/@me/connections", {
				headers: {
					Authorization: `Bearer ${account.access_token}`,
				},
			});
			const json = (await connections.json()) as Connections[];
			const steamConnection = json.find((x) => x.type === "steam");
			if (steamConnection) {
				const steamId = steamConnection.id;
				if (steamId) {
					user.steamId = steamId;
					const steamGames = await steam.getUserOwnedGames(steamId);
					const games = steamGames?.forEach(async (game) => {
						const installedGame = await prisma.userInstalledGames.findFirst({
							where: {
								steamId,
								appId: game.appId.toString(),
							},
						});
						const uninstalledGame = await prisma.userUninstalledGames.findFirst({
							where: {
								steamId,
								appId: game.appId.toString(),
							},
						});
						if (!installedGame && !uninstalledGame) {
							// console.log("Installing game");
							await prisma.userInstalledGames.create({
								data: {
									steamId,
									appId: game.appId.toString(),
								},
							});
						}
					});
				}
			}
			return true;
		},
	},
	// Configure one or more authentication providers
	adapter: PrismaAdapter(prisma),
	providers: [
		DiscordProvider({
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET,
			authorization: { params: { scope: "identify connections" } },
		}),
		// ...add more providers here
	],
};

export default NextAuth(authOptions);
