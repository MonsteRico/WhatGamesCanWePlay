import React, { useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import logo from "../logoStuff/logo_final.png";
import Image from "next/future/image";
import CoolButton from "./CoolButton";
import SetSteamIdContent from "./SetSteamIdContent";
import Modal from "./Modal";

export default function NavBar() {
	const { data: session } = useSession();
	const user = session?.user;
	const [steamIdModalOpen, setSteamIdModalOpen] = useState(false);
	console.log("user: " + user);
	console.log("steamId" + user?.steamId);
	return (
		<>
			<div className="relative bg-slate-600 border-b-4 border-violet-500">
				<div className="mx-auto px-4 sm:px-6">
					<div className="flex justify-between items-center py-3 md:justify-start md:space-x-10">
						<div className="flex justify-start">
							<Link href="/">
								<Image
									alt="Logo"
									className="h-20 w-auto hover:cursor-pointer"
									src={logo}
									width={300}
									height={300}
									unoptimized
								></Image>
							</Link>
						</div>
						<nav className="md:flex space-x-10">
							<Link href="/">
								<a className="text-base font-medium hover:text-neutral-400">Home</a>
							</Link>
							<Link href="/about">
								<a className="text-base font-medium hover:text-neutral-400">About</a>
							</Link>
							<Link href="/report">
								<a className="text-base font-medium hover:text-neutral-400">Report Bugs and Stuff</a>
							</Link>
							{user ? (
								<>
									<Link href="/library">
										<a className="text-base font-medium hover:text-neutral-400">My Library</a>
									</Link>
									<Link href="/groups">
										<a className="text-base font-medium hover:text-neutral-400">Groups</a>
									</Link>
								</>
							) : null}
						</nav>
						<div className="md:flex items-center justify-end md:flex-1 lg:w-0">
							{user?.steamId == null && user !== undefined ? (
								<button
									className="p-3 bg-red-700 mr-4 rounded"
									onClick={() => {
										setSteamIdModalOpen(true);
									}}
								>
									Missing Steam ID!
								</button>
							) : null}
							{user ? (
								<div className="flex items-center justify-between">
									<p className="text-2xl mr-4 font-medium">{user.name}</p>
									<CoolButton onClick={() => signOut({ callbackUrl: `${window.location.origin}` })}>
										Sign Out
									</CoolButton>
								</div>
							) : (
								<CoolButton onClick={() => signIn("discord")}>Sign in with Discord</CoolButton>
							)}
						</div>
					</div>
				</div>
			</div>
			{steamIdModalOpen ? (
				<Modal size="md" setOpenFunction={setSteamIdModalOpen} title="Join a Group">
					<SetSteamIdContent />
				</Modal>
			) : null}
		</>
	);
}
