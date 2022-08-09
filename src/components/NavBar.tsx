import React from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import logo from "../../public/platRat.png";
import Image from "next/future/image";

export default function NavBar() {
	const { data: session } = useSession();
	const user = session?.user;

	return (
		<div className="relative bg-white">
			<div className="mx-auto px-4 sm:px-6">
				<div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
					<div className="flex justify-start">
						<Link href="/">
							<Image
								alt="Logo"
								className="h-20 w-auto hover:cursor-pointer"
								src={logo}
								width={200}
								height={200}
							></Image>
						</Link>
					</div>
					<nav className="md:flex space-x-10">
						<Link href="/">
							<a className="text-base font-medium text-gray-500 hover:text-gray-900">Home</a>
						</Link>
						<Link href="/documentation">
							<a className="text-base font-medium text-gray-500 hover:text-gray-900">About</a>
						</Link>
						{user ? (
							<>
								<Link href="/library">
									<a className="text-base font-medium text-gray-500 hover:text-gray-900">
										My Library
									</a>
								</Link>
								<Link href="/groups">
									<a className="text-base font-medium text-gray-500 hover:text-gray-900">Groups</a>
								</Link>
							</>
						) : null}
					</nav>
					<div className="md:flex items-center justify-end md:flex-1 lg:w-0">
						{user ? (
							<div className="flex items-center justify-between">
								<p className="text-2xl mr-4 font-medium text-gray-900">{user.name}</p>
								<button
									className="p-3 bg-blue-400 text-white rounded"
									onClick={() => signOut({ callbackUrl: `${window.location.origin}` })}
								>
									Sign Out
								</button>
							</div>
						) : (
							<button className="p-3 bg-blue-400 text-white rounded" onClick={() => signIn("discord")}>
								Sign in with Discord
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
