import { UserInstalledGames } from "@prisma/client";
import { Session } from "next-auth";
import React from "react";
import { OwnedGame } from "type-steamapi";
import {
	ERROR_GAME,
	LEAGUE_OF_LEGENDS,
	LEAGUE_OF_LEGENDS_APPID,
	OVERWATCH_APPID,
	VALORANT_APPID,
} from "../utils/gameConstants";
import { trpc } from "../utils/trpc";
import GameCover from "./GameCover";

interface LibraryGameProps {
	gameInstalled: boolean;
	game: OwnedGame;
	toggleInstall: (session: Session | null, game: OwnedGame, currentlyInstalled: boolean) => void;
	session: Session | null;
}

export default function LibraryGame({ gameInstalled, game, toggleInstall, session, ...rest }: LibraryGameProps) {
	const errorMutation = trpc.useMutation(["library.setUserSteamId"], {
		onSuccess: () => {
			window.location.reload();
		},
	});
	return (
		<div
			onMouseEnter={() => {
				document.getElementById("hover" + game.appId.toString())?.classList.add("z-10");
				document.getElementById("cover" + game.appId.toString())?.classList.add("opacity-5");
			}}
			onMouseLeave={() => {
				document.getElementById("hover" + game.appId.toString())?.classList.remove("z-10");
				document.getElementById("cover" + game.appId.toString())?.classList.remove("opacity-5");
			}}
			className="text-center self-center content-center relative"
		>
			<div
				style={{ top: "100px" }}
				id={"hover" + game.appId}
				className="flex flex-col justify-center items-center absolute w-full"
			>
				<p className="text-lg font-medium text-center">{game.name}</p>
				{game !== ERROR_GAME ? (
					<span className="text-md py-2">{gameInstalled ? "Installed" : "Uninstalled"}</span>
				) : (
					<span className="text-md py-2">
						You can try reentering it below. Instructions on finding your Steam ID can be found{" "}
						<a
							className="text-violet-500 underline"
							href="https://help.steampowered.com/en/faqs/view/2816-BE67-5B69-0FEC"
						>
							here
						</a>
					</span>
				)}

				<div>
					{game !== ERROR_GAME ? (
						<label
							htmlFor={"toggle" + game.appId}
							className="inline-flex relative items-start cursor-pointer"
						>
							<input
								type="checkbox"
								checked={gameInstalled}
								id={"toggle" + game.appId}
								className="sr-only peer"
								onChange={() => {
									toggleInstall(session, game, gameInstalled);
								}}
							/>
							<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-violet-500"></div>
						</label>
					) : (
						<div className="flex flex-col justify-center items-center mt-10">
							<input
								className="border-2 border-violet-500 rounded-md p-2 w-1/2"
								type="text"
								placeholder="Steam Id"
							></input>
							<button
								className="bg-violet-500 text-white rounded-md p-2 mt-5 w-1/2"
								onClick={() => {
									errorMutation.mutate({
										steamId: document.querySelector("input")?.value as string,
									});
								}}
							>
								Update Steam Id
							</button>
						</div>
					)}
				</div>
			</div>
			<div id={"cover" + game.appId} className="transition ease-in-out duration-500 text-xl">
				<GameCover
					className="transition ease-in-out duration-1000"
					installed={gameInstalled}
					appId={game.appId}
					alt={game.name}
				></GameCover>
			</div>
		</div>
	);
}
