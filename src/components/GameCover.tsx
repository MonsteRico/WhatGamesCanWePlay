import React, { useState } from "react";
import Image from "next/image";
import { trpc } from "../utils/trpc";
import { LEAGUE_OF_LEGENDS_APPID, OVERWATCH_APPID, VALORANT_APPID } from "../utils/gameConstants";
import leagueCover from "../../public/leagueCover.jpg";
import overwatchCover from "../../public/overwatchCover.jpg";
import valorantCover from "../../public/valorantCover.png";
interface GameCoverProps {
	appId: string;
	alt: string;
	installed: boolean;
	className?: string;
}

const GameCover = ({ appId, alt, installed, className, ...rest }: GameCoverProps) => {
	const [imgSrc, setImgSrc] = useState(`https://steamcdn-a.akamaihd.net/steam/apps/${appId}/library_600x900.jpg`);
	const fallbackSrc = `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;
	// check if imgSrc is valid
	const width = 300;
	const height = imgSrc !== fallbackSrc ? 450 : 140;
	if (appId === LEAGUE_OF_LEGENDS_APPID) {
		return (
			<Image
				className={className + (installed ? " " : " grayscale")}
				{...rest}
				alt={alt}
				src={leagueCover}
				onError={() => {
					console.log("fallback", fallbackSrc);
					setImgSrc(fallbackSrc);
				}}
				width={300}
				height={height}
			/>
		);
	} else if (appId === OVERWATCH_APPID) {
		return (
			<Image
				className={className + (installed ? " " : " grayscale")}
				{...rest}
				alt={alt}
				src={overwatchCover}
				onError={() => {
					console.log("fallback", fallbackSrc);
					setImgSrc(fallbackSrc);
				}}
				width={300}
				height={height}
			/>
		);
	} else if (appId === VALORANT_APPID) {
		return (
			<Image
				className={className + (installed ? " " : " grayscale")}
				{...rest}
				alt={alt}
				src={valorantCover}
				onError={() => {
					console.log("fallback", fallbackSrc);
					setImgSrc(fallbackSrc);
				}}
				width={300}
				height={height}
			/>
		);
	}
	return (
		<Image
			className={className + (installed ? " " : " grayscale")}
			{...rest}
			alt={alt}
			src={imgSrc}
			onError={() => {
				console.log("fallback", fallbackSrc);
				setImgSrc(fallbackSrc);
			}}
			width={300}
			height={height}
		/>
	);
};

export default GameCover;
