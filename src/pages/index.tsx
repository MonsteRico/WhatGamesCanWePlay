import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { useSession, signIn, signOut } from "next-auth/react";
import NavBar from "../components/NavBar";
const Home: NextPage = () => {
	const { data: session } = useSession();
	let text: string = "World";
	let steamId: string = "";
	if (session) {
		text = session?.user?.name as string;
		steamId = session?.steamId as string;
	}
	const hello = trpc.useQuery(["hello.world", { text }]);
	return (
		<>
			<Head>
				<title>Index</title>
				<meta name="description" content="Find out what games you and your group all actually can play!" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<NavBar></NavBar>

			<main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
				<h1 className="text-5xl">Home Page</h1>
				<div className="pt-6 text-2xl text-blue-500 flex justify-center items-center w-full">
					{hello.data ? <p>{hello.data.greeting}</p> : <p>Loading...</p>}
				</div>
			</main>
		</>
	);
};

export default Home;
