import Image from "next/image";
import React from "react";

interface UserIconProps {
	src: string | null;
	username: string | null;
}

export default function UserIcon({ src, username }: UserIconProps) {
	if (src == null || username == null) {
		return <div></div>;
	}
	return (
		<Image alt={username + "'s icon"} src={src} width={75} height={75} className="rounded-full cursor-pointer" />
	);
}
