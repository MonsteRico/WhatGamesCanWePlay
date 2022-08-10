import SteamAPI from "type-steamapi";

export const steam = new SteamAPI({
	apiKey: process.env.STEAM_API_KEY as string,
	cache: {
		enabled: true,
		expiresIn: 1000 * 60 * 5, // 5 min
	},
});
