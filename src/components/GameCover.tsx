import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { trpc } from "../utils/trpc";
import { ERROR_GAME_APPID, LEAGUE_OF_LEGENDS_APPID, OVERWATCH_APPID, VALORANT_APPID } from "../utils/gameConstants";
import leagueCover from "../../public/leagueCover.jpg";
import errorCover from "../../public/errorCover.jpg";
import overwatchCover from "../../public/overwatchCover.jpg";
import valorantCover from "../../public/valorantCover.png";
import genericCover from "../../public/genericCover.jpg";
interface GameCoverProps {
	appId: string;
	alt: string;
	installed: boolean;
	className?: string;
}

const GameCover = ({ appId, alt, installed, className, ...rest }: GameCoverProps) => {
	const width = 300;
	const height = 450;
	let initialImgSrc:
		| string
		| StaticImageData = `https://steamcdn-a.akamaihd.net/steam/apps/${appId}/library_600x900.jpg`;
	if (appId === LEAGUE_OF_LEGENDS_APPID) {
		initialImgSrc = leagueCover;
	}
	if (appId === OVERWATCH_APPID) {
		initialImgSrc = overwatchCover;
	}
	if (appId === VALORANT_APPID) {
		initialImgSrc = valorantCover;
	}
	if (appId === ERROR_GAME_APPID) {
		initialImgSrc = errorCover;
	}

	const [imgSrc, setImgSrc] = useState<string | StaticImageData>(initialImgSrc);
	const [fallbackSrc, setFallbackSrc] = useState<string | StaticImageData>(
		`https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`
	);
	const firstFallbackSrc = `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;
	const finalFallbackSrc = `https://cdn.akamai.steamstatic.com/steam/apps/20/library_600x900.jpg`;
	// check if imgSrc is valid

	if (appId === LEAGUE_OF_LEGENDS_APPID) {
		return (
			<Image
				className={className + (installed ? " " : " grayscale")}
				{...rest}
				alt={alt}
				src={leagueCover}
				width={300}
				height={height}
				unoptimized
			/>
		);
	}
	if (appId === OVERWATCH_APPID) {
		return (
			<Image
				className={className + (installed ? " " : " grayscale")}
				{...rest}
				alt={alt}
				src={overwatchCover}
				width={300}
				height={height}
				unoptimized
			/>
		);
	}
	if (appId === VALORANT_APPID) {
		return (
			<Image
				className={className + (installed ? " " : " grayscale")}
				{...rest}
				alt={alt}
				src={valorantCover}
				width={300}
				height={height}
				unoptimized
			/>
		);
	}

	if (imgSrc == firstFallbackSrc && !(parseInt(appId) < 0)) {
		console.log("first fallback");
		return (
			<div className="relative">
				<Image
					src={imgSrc}
					width={300}
					height={height}
					alt={alt}
					style={{
						filter: "blur(10px)",
					}}
					onError={() => {
						console.log("fallback", fallbackSrc);
						setImgSrc(fallbackSrc);
						setFallbackSrc(genericCover);
					}}
					unoptimized
				></Image>
				<div className="absolute top-14">
					<Image
						className={installed ? " " : " grayscale"}
						{...rest}
						alt={alt}
						src={imgSrc}
						width={300}
						height={140}
						unoptimized
					/>
				</div>
			</div>
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
				setFallbackSrc(genericCover);
			}}
			width={300}
			height={height}
			unoptimized
		/>
	);
};

export default GameCover;
