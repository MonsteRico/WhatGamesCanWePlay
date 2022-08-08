import React, { useState } from "react";
import Image from "next/image";
import { trpc } from "../utils/trpc";

interface GameCoverProps {
	appId: string;
	width: number;
	height: number;
	alt: string;
}

const GameCover = ({ appId, width, alt, height, ...rest }: GameCoverProps) => {
	const [imgSrc, setImgSrc] = useState(`https://steamcdn-a.akamaihd.net/steam/apps/${appId}/library_600x900.jpg`);
	const fallbackSrc = `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;
	return (
		<Image
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
