import React from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import logo from "../../public/platRat.png";
import Image from "next/future/image";
import CoolButton from "./CoolButton";

export default function NavBar() {
	const { data: session } = useSession();
	const user = session?.user;

	return (
		<div className="relative bg-slate-600 border-b-4 border-violet-500">
			<div className="mx-auto px-4 sm:px-6">
				<div className="flex justify-between items-center py-3 md:justify-start md:space-x-10">
					<div className="flex justify-start">
						<Link href="/">
							<Image
								alt="Logo"
								className="h-20 w-auto hover:cursor-pointer"
								src={logo}
								width={200}
								height={200}
								unoptimized
							></Image>
						</Link>
					</div>
					<nav className="md:flex space-x-10">
						<Link href="/">
							<a className="text-base font-medium hover:text-neutral-400">Home</a>
						</Link>
						<Link href="/documentation">
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
	);
}
