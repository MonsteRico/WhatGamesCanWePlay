import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { useSession, signIn, signOut } from "next-auth/react";
import NavBar from "../components/NavBar";
import { motion } from "framer-motion";
import GameCover from "../components/GameCover";
import CoolButton from "../components/CoolButton";
import { useRef } from "react";
import useWindowDimensions from "../utils/useWindowDimensions";
import safeAppIds from "../utils/homeScreenAppIds";
const Home: NextPage = () => {
	const { data: session } = useSession();
	let text: string = "World";
	let steamId: string = "";
	if (session) {
		text = session?.user?.name as string;
		steamId = session?.steamId as string;
	}
	let arr: any[] = ["placeholder"];
	const { width, height } = useWindowDimensions();
	if (width && height) {
		let numCols = 2;
		let numRows = 3;
		if (height > 1000) {
			numRows = 4;
		}
		if (width >= 640) {
			numCols = 3;
			numRows = 3;
			if (height > 1000) {
				numRows = 4;
			}
		}
		if (width >= 768) {
			numCols = 4;
			numRows = 3;
			if (height > 1000) {
				numRows = 4;
			}
		}
		if (width >= 1024) {
			numCols = 6;
			numRows = 3;
			if (height > 1000) {
				numRows = 4;
			}
		}
		if (width >= 1280) {
			numCols = 7;
			numRows = 3;
			if (height > 1000) {
				numRows = 4;
			}
		}
		if (width >= 1536) {
			numCols = 9;
			numRows = 3;
		}
		if (width >= 2048) {
			numCols = 9;
			numRows = 4;
		}
		arr = [];
		for (let i = 0; i < numCols * numRows; i++) {
			arr.push(i);
		}
	}
	const getRandomGames = (number: number): string[] => {
		const gameIds = safeAppIds;
		const uniqueGameIds = gameIds.filter((gameId, index) => gameIds.indexOf(gameId) === index);
		const randomGameIds = shuffle(uniqueGameIds).slice(0, number);
		return randomGameIds;
	};

	const shuffle = (array: any[]) => {
		let currentIndex = array.length,
			randomIndex;

		// While there remain elements to shuffle.
		while (currentIndex != 0) {
			// Pick a remaining element.
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			// And swap it with the current element.
			[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
		}

		return array;
	};

	const randomGames = getRandomGames(arr.length);

	const scrollRef = useRef<any>(null);
	return (
		<>
			<Head>
				<title>Index</title>
				<meta name="description" content="Find out what games you and your group all actually can play!" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<NavBar></NavBar>
			<div
				className="grid xs:grid-cols-2 xs:grid-rows-3
				3xl:grid-cols-9 3xl:grid-rows-4
				 sm:grid-cols-3 sm:grid-rows-3
				 lg:grid-rows-3 lg:grid-cols-6
				 xl:grid-rows-3 xl:grid-cols-7
				 2xl:grid-rows-3 2xl:grid-cols-9
				  md:grid-rows-3 md:grid-cols-4
				   overflow-hidden z-1"
			>
				{randomGames &&
					arr.map((i) => {
						return (
							<motion.div
								key={i}
								initial={{ opacity: 0, rotateY: 180 }}
								animate={{ opacity: 1, rotateY: 0 }}
								transition={{ duration: 0.25, delay: Math.random() * 0.5 }}
								className="col-span-1 row-span-1 p-5"
								style={{ width: "200px", height: "300px" }}
							>
								<GameCover alt="Game Cover" appId={randomGames[i] as string} installed />
							</motion.div>
						);
					})}
			</div>
			<div className="absolute bottom-1/2 left-1/4 right-1/4 top-1/4 text-center z-10">
				<h1 className="text-center text-7xl mb-5 px-5 pb-5 font-bold border-violet-500 border-b-4">
					What Games Can We Play?
				</h1>
				<p className="text-center text-4xl">A website to help you and your indecisive friends!</p>
				<div className="h-full"></div>
				<motion.p
					initial={{ opacity: 0.8, y: 100 }}
					animate={{ opacity: 1, y: [0, 10] }}
					transition={{ duration: 0.5, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
					className="mt-20 text-6xl text-violet-500 font-extrabold characterOutline cursor-pointer w-1/12 mx-auto"
					onClick={() => {
						if (scrollRef.current) {
							scrollRef.current.scrollIntoView({ behavior: "smooth" });
						}
					}}
				>
					∨
				</motion.p>
			</div>
			<div
				style={{ top: "6.75em" }}
				className={`bg-black z-2 absolute left-0 h-full w-full bg-opacity-70 border-b-2 border-violet-500`}
			>
				<div style={{ height: "300px", width: "200px" }}></div>
			</div>

			<main className="container mx-auto flex flex-col items-center justify-center align-center p-4">
				<motion.div
					// animate={{ opacity: 1, y: 0 }}
					// initial={{ opacity: 0, y: 100 }}
					// transition={{ duration: 0.5, delay: 0.5 }}
					ref={scrollRef}
					className="mb-64 flex flex-col justify-center items-center mx-auto w-full"
				>
					<h1 className="text-center text-7xl mb-5 px-5 pb-5 font-bold border-violet-500 border-b-4">
						How does it work?
					</h1>
					<p className="text-center text-4xl">
						This website lets you log in with Discord, checks your Steam ID from your Discord Connections,
						and lets you see the games you and your friends have in common. That&apos;s all there is too it!
						No more arguing over what game to play or going through each persons owned games to find what
						you all can play together!
					</p>
					<div className="mt-10 flex flex-row jusitfy-center items-center mx-auto align-center">
						<h1 className="text-center p-5 text-5xl font-bold text-violet-500">You ready to try?</h1>
						<CoolButton
							className="mt-2"
							onClick={() => {
								signIn("discord");
							}}
						>
							<p className="font-bold">Click here to sign in!</p>
						</CoolButton>
					</div>
				</motion.div>
			</main>
		</>
	);
};

export default Home;
