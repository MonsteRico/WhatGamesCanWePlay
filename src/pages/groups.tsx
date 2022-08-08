import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import NavBar from "../components/NavBar";
const Groups: NextPage = () => {
	const { data: session } = useSession();
	let text: string = "Hello World";
	let steamId: string = "";
	if (session) {
		text = session?.user?.name as string;
		steamId = session?.steamId as string;
	}
	const hello = trpc.useQuery(["example.hello", { text }]);
	return (
		<>
			<Head>
				<title>Groups</title>
				<meta name="description" content="Generated by create-t3-app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<NavBar></NavBar>

			<main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
				<div className="pt-6 text-2xl text-blue-500 flex justify-center items-center w-full">
					{hello.data ? <p>{hello.data.greeting}</p> : <p>Loading..</p>}
				</div>
				{steamId ? (
					<div className="pt-6 text-2xl text-blue-500 flex justify-center items-center w-full">
						<p>Your steamId {steamId}</p>
					</div>
				) : (
					<div>
						<p>You do not have a linked Steam id.</p>
						{
							// TODO
							// optionally have an option to link a steam account manually
							// also can link to the link steam account page
						}
					</div>
				)}
			</main>
		</>
	);
};

export async function getServerSideProps(context: any) {
	const session = await getSession(context);
	if (!session) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}
	return {
		props: {
			session,
		},
	};
}

export default Groups;