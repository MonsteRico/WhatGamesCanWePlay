import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import NavBar from "../components/NavBar";
import { useRouter } from "next/router";
const Groups: NextPage = () => {
	const { data: session } = useSession();
	let text: string = "Hello World";
	let steamId: string = "";
	if (session) {
		text = session?.user?.name as string;
		steamId = session?.steamId as string;
	}
	const hello = trpc.useQuery(["hello.world", { text }]);
	const groups = trpc.useQuery(["groups.getGroups"]);
	if (groups.data) {
		// console.log(groups.data);
	}
	const createGroup = trpc.useMutation(["groups.createGroup"], {
		onSuccess: (data) => {
			router.push("/groups/[groupId]", `/groups/${data.id}`);
		},
	});
	const joinGroup = trpc.useMutation(["groups.joinGroup"], {
		onSuccess: (data) => {
			if (data.joinedId === null) {
				window.alert("Group join code is invalid");
			} else {
				router.push("/groups/[groupId]", `/groups/${data.joinedId}`);
			}
		},
	});
	const router = useRouter();
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
				<div className="pt-6 text-2xl text-blue-500 flex justify-center items-center w-full">
					<div className="w-full rounded-xl bg-white p-4 shadow-2xl shadow-white/40">
						<p className="mb-8 font-semibold">Created by Gezellligheid</p>
						<div className="mb-4 grid grid-cols-2 gap-4">
							<div className="flex flex-col">
								<label htmlFor="text" className="mb-2 font-semibold">
									Join Code
								</label>
								<input
									type="text"
									id="joinCode"
									className="w-full max-w-lg rounded-lg border border-slate-200 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40"
								/>
							</div>
							<div className="flex flex-col">
								<button
									id="join"
									className="w-full max-w-lg rounded-lg border border-slate-200 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40"
									onClick={() => {
										const joinCodeInput = document.getElementById("joinCode") as HTMLInputElement;
										if (joinCodeInput.value === "") {
											window.alert("Please enter a join code");
										} else {
											joinGroup.mutate({
												joinCode: joinCodeInput.value,
												userId: session?.user?.id as string,
											});
										}
									}}
								>
									Join
								</button>
							</div>
						</div>
					</div>
					{
						// TODO add form to create a group
					}
					<div className="w-full rounded-xl bg-white p-4 shadow-2xl shadow-white/40">
						<p className="mb-8 font-semibold">Created by Gezellligheid</p>
						<div className="mb-4 grid grid-cols-2 gap-4">
							<div className="flex flex-col">
								<label htmlFor="text" className="mb-2 font-semibold">
									Group Name
								</label>
								<input
									type="text"
									id="groupName"
									className="w-full max-w-lg rounded-lg border border-slate-200 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40"
								/>
							</div>
							<div className="flex flex-col">
								<button
									id="submit"
									className="w-full max-w-lg rounded-lg border border-slate-200 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40"
									onClick={() => {
										const groupNameInput = document.getElementById("groupName") as HTMLInputElement;
										if (groupNameInput.value === "") {
											window.alert("Please enter a group name");
										} else {
											createGroup.mutate({
												name: groupNameInput.value as string,
												creatorId: session?.user?.id as string,
											});
										}
									}}
								>
									Submit
								</button>
							</div>
						</div>
					</div>
				</div>
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
