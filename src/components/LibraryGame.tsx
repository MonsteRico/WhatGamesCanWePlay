import { UserInstalledGames } from "@prisma/client";
import { Session } from "next-auth";
import React from "react";
import { OwnedGame } from "type-steamapi";
import { LEAGUE_OF_LEGENDS, LEAGUE_OF_LEGENDS_APPID, OVERWATCH_APPID, VALORANT_APPID } from "../utils/gameConstants";
import GameCover from "./GameCover";

interface LibraryGameProps {
	gameInstalled: boolean;
	game: OwnedGame;
	toggleInstall: (session: Session | null, game: OwnedGame, currentlyInstalled: boolean) => void;
	session: Session | null;
}

export default function LibraryGame({ gameInstalled, game, toggleInstall, session, ...rest }: LibraryGameProps) {
	return (
		<div className="text-xl content-center self-center text-center">
			<GameCover
				className="transition ease-in-out duration-1000"
				installed={gameInstalled}
				appId={game.appId}
				alt={game.name}
			></GameCover>

			<label htmlFor={"toggle" + game.appId} className="inline-flex relative items-center cursor-pointer">
				<input
					type="checkbox"
					checked={gameInstalled}
					id={"toggle" + game.appId}
					className="sr-only peer"
					onChange={() => {
						toggleInstall(session, game, gameInstalled);
					}}
				/>
				<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-violet-500"></div>
				<span className="ml-3 text-md font-medium">{gameInstalled ? "Installed" : "Uninstalled"}</span>
			</label>
		</div>
	);
}
