import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { useSession, signIn, signOut } from "next-auth/react";
import NavBar from "../components/NavBar";
import { motion } from "framer-motion";
import GameCover from "../components/GameCover";
import CoolButton from "../components/CoolButton";
import { useRef } from "react";
const Home: NextPage = () => {
	const { data: session } = useSession();
	let text: string = "World";
	let steamId: string = "";
	if (session) {
		text = session?.user?.name as string;
		steamId = session?.steamId as string;
	}
	const hello = trpc.useQuery(["hello.world", { text }]);
	// create an array with 30 elements
	const arr = Array.from(Array(27).keys());
	const randomAppIdsQuery = trpc.useQuery(["randomGame.getRandomGames", { number: arr.length }], {
		refetchOnWindowFocus: false,
	});
	const scrollRef = useRef<any>(null);
	return (
		<>
			<Head>
				<title>Index</title>
				<meta name="description" content="Find out what games you and your group all actually can play!" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<NavBar></NavBar>
			<div className="grid grid-cols-9 grid-rows-3 overflow-hidden z-1">
				{randomAppIdsQuery.data &&
					arr.map((i) => {
						const middleRow = i > 8 && i < 17;
						return (
							<motion.div
								key={i}
								initial={middleRow ? { opacity: 0, x: 100 } : { opacity: 0, x: -100 }}
								animate={middleRow ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
								transition={
									middleRow
										? { duration: 0.25, delay: (8 - (i % 9)) * 0.1 }
										: { duration: 0.25, delay: (i % 9) * 0.1 }
								}
								className="p-4"
								style={{ width: "200px", height: "300px" }}
							>
								<GameCover alt="Game Cover" appId={randomAppIdsQuery.data[i]} installed />
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
				className="bg-black z-2 grid grid-cols-9 grid-rows-3 absolute left-0 h-full w-full bg-opacity-70 border-b-2 border-violet-500"
			>
				{" "}
			</div>

			<main className="container mx-auto flex flex-col items-center justify-center p-4">
				<div ref={scrollRef} className="pt-6 text-2xl text-blue-500 flex justify-center items-center w-full">
					{hello.data ? <p>{hello.data.greeting}</p> : <p>Loading...</p>}
				</div>
			</main>
		</>
	);
};

export default Home;
