import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../../utils/trpc";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import NavBar from "../../components/NavBar";
import { useRouter } from "next/router";
const GroupPage: NextPage = () => {
	const { data: session } = useSession();
	let steamId: string = "";
	if (session) {
		steamId = session?.steamId as string;
	}
	const router = useRouter();
	const { groupId } = router.query;
	if (!groupId || typeof groupId !== "string") {
		return <div>Invalid Group Page</div>;
	}
	const groupQuery = trpc.useQuery(["groups.getGroup", { groupId }]);
	const hello = trpc.useQuery(["hello.world", { text: "Hello World" }]);
	const group = groupQuery.data;
	const groupMembersQuery = trpc.useQuery(["groups.getGroupMembers", { groupId }]);
	const deleteGroup = trpc.useMutation(["groups.deleteGroup"]);
	const leaveGroup = trpc.useMutation(["groups.leaveGroup"]);
	const groupMembers = groupMembersQuery.data;
	if (!groupQuery.data) {
		// TODO add error page
		return <div>Invalid Group Page</div>;
	}
	// check if user is in group
	const isMember = groupMembers?.some((member) => member?.userId === session?.user?.id);
	if (!isMember) {
		return <div>You are not a member of this group.</div>;
	}

	if (group) {
		const { ownerId, name, joinCode, id: groupId } = group;

		const isOwner = ownerId === session?.user?.id;
		console.log(group);
		console.log(groupMembers);

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
						<p>Your steamId {steamId}</p>
					</div>
					<p className="text-5xl">Group Name: {name}</p>
					<p className="text-2xl">Group Id: {groupId}</p>
					<p className="text-2xl">Join Code: {joinCode}</p>
					{groupMembers &&
						groupMembers.map((member) => {
							if (member && member?.userId === ownerId) {
								return (
									<div
										className="border border-yellow-500 text-yellow-500 p-5 mt-4"
										key={member.userId}
									>
										<p className="text-2xl">User Id: {member.userId}</p>
										<p className="text-2xl">User Name: {member.userName}</p>
										<p className="text-2xl">
											User Steam Id: {member.steamId ? member.steamId : "N/A"}
										</p>
									</div>
								);
							} else if (member) {
								return (
									<div className="border p-5 mt-4" key={member.userId}>
										<p className="text-2xl">User Id: {member.userId}</p>
										<p className="text-2xl">User Name: {member.userName}</p>
										<p className="text-2xl">
											User Steam Id: {member.steamId ? member.steamId : "N/A"}
										</p>
									</div>
								);
							} else {
								return null;
							}
						})}
					{isOwner && groupMembers ? (
						<button
							onClick={() => {
								if (window.confirm("Are you sure you want to delete this group?")) {
									if (groupMembers.length > 1) {
										if (
											window.confirm(
												"This group has members other than you. Are you sure you want to delete this group?"
											)
										) {
											deleteGroup.mutate({
												groupId,
												userId: session?.user?.id as string,
											});
											router.push("/groups");
										}
									} else {
										deleteGroup.mutate({
											groupId,
											userId: session?.user?.id as string,
										});
										router.push("/groups");
									}
								}
							}}
						>
							Delete Group
						</button>
					) : (
						<button
							onClick={() => {
								if (session?.user?.id !== group.ownerId) {
									leaveGroup.mutate({
										groupId,
										userId: session?.user?.id as string,
									});
									window.alert("You have left the group.");
									router.push("/groups");
								} else {
									window.alert(
										"You can't leave the group you made. This shouldn't even be possible honestly."
									);
								}
							}}
						>
							Leave Group
						</button>
					)}
				</main>
			</>
		);
	}

	return <div>Loading</div>;
};

export async function getServerSideProps(context: any) {
	const session = await getSession(context);
	// TODO potentially. if you are trying to view a group that you don't belong to, you should be redirected to the groups page.
	// or if the group doesn't exist, you should be redirected to the groups page.
	// not sure if it should notify before redirect or just redirect
	// also not sure how to do it
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

export default GroupPage;
