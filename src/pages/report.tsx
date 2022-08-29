import type { NextPage } from "next";
import Head from "next/head";
import CoolButton from "../components/CoolButton";
import NavBar from "../components/NavBar";

type TechnologyCardProps = {
	name: string;
	description: string;
	documentation: string;
};

const Documentation: NextPage = () => {
	return (
		<>
			<Head>
				<title>Create T3 App - Documentation</title>
				<meta name="description" content="Generated by create-t3-app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<NavBar></NavBar>
			{
				//TODO add about stuff
			}
			<main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
				<h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold">Find a bug?</h1>
				<p>
					You know how to submit a bug report on GitHub probably, the whole code is on there just do it
					please. You can also DM Monster#8681 on Discord. Let me know of any bugs you find, anything you
					think is hard to understand or not intuitive, any design things that should change whatever. All
					feedback is appreciated. Thank you!
				</p>
				<CoolButton
					onClick={() => {
						window.open("https://github.com/MonsteRico/WhatGamesCanWePlay/");
					}}
				>
					GitHub Link
				</CoolButton>
			</main>
		</>
	);
};

const TechnologyCard = ({ name, description, documentation }: TechnologyCardProps) => {
	return (
		<section className="flex flex-col justify-center p-6 duration-500 border-2 border-gray-500 rounded shadow-xl motion-safe:hover:scale-105">
			<h2 className="text-lg text-gray-700">{name}</h2>
			<p className="text-sm text-gray-600">{description}</p>
			<a
				className="mt-3 text-sm underline text-violet-500 decoration-dotted underline-offset-2"
				href={documentation}
				target="_blank"
				rel="noreferrer"
			>
				Documentation
			</a>
		</section>
	);
};

export default Documentation;
