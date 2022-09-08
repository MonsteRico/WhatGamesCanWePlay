import { OwnedGame } from "type-steamapi";
import leagueCover from "../../public/leagueCover.jpg";
import overwatchCover from "../../public/overwatchCover.jpg";
import valorantCover from "../../public/valorantCover.png";
import genericCover from "../../public/genericCover.jpg";
import errorCover from "../../public/errorCover.jpg";
export const LEAGUE_OF_LEGENDS_APPID = "-1";
export const OVERWATCH_APPID = "-2";
export const VALORANT_APPID = "-3";
export const ERROR_GAME_APPID = "-4";
export const LEAGUE_OF_LEGENDS: OwnedGame = {
	appId: LEAGUE_OF_LEGENDS_APPID,
	name: "League of Legends",
	playtime2weeks: 0,
	imgIconUrl: leagueCover.src,
	imgLogoUrl: leagueCover.src,
	playtimeTotal: 0,
};
export const OVERWATCH: OwnedGame = {
	appId: OVERWATCH_APPID,
	name: "Overwatch",
	playtime2weeks: 0,
	imgIconUrl: overwatchCover.src,
	imgLogoUrl: overwatchCover.src,
	playtimeTotal: 0,
};
export const VALORANT: OwnedGame = {
	appId: VALORANT_APPID,
	name: "Valorant",
	playtime2weeks: 0,
	imgIconUrl: valorantCover.src,
	imgLogoUrl: valorantCover.src,
	playtimeTotal: 0,
};
export const ERROR_GAME: OwnedGame = {
	appId: ERROR_GAME_APPID,
	name: "Invalid Steam ID",
	playtime2weeks: 0,
	imgIconUrl: errorCover.src,
	imgLogoUrl: errorCover.src,
	playtimeTotal: 0,
};
