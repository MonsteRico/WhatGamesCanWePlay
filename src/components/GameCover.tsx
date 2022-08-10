import React, { useState } from "react";
import Image from "next/image";
import { trpc } from "../utils/trpc";
import { LEAGUE_OF_LEGENDS_APPID, OVERWATCH_APPID, VALORANT_APPID } from "../utils/gameConstants";

interface GameCoverProps {
	appId: string;
	width: number;
	height: number;
	alt: string;
	installed: boolean;
	className?: string;
	src?: string;
}

const GameCover = ({ appId, width, alt, height, installed, className, src, ...rest }: GameCoverProps) => {
	const [imgSrc, setImgSrc] = useState(`https://steamcdn-a.akamaihd.net/steam/apps/${appId}/library_600x900.jpg`);
	const fallbackSrc = `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;

	if (src != undefined) {
		return (
			<Image
				className={className + (installed ? " " : " grayscale")}
				{...rest}
				alt={alt}
				src={src as string}
				width={imgSrc !== fallbackSrc ? width : 300}
				height={imgSrc !== fallbackSrc ? height : 140}
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
			width={imgSrc !== fallbackSrc ? width : 300}
			height={imgSrc !== fallbackSrc ? height : 140}
		/>
	);
};

export default GameCover;
