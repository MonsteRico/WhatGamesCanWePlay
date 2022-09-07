import React from "react";

interface CoolButtonProps {
	onClick?: () => void;
	children?: React.ReactNode;
	className?: string;
}

export default function CoolButton({ onClick, children, className }: CoolButtonProps) {
	return (
		<button
			onClick={onClick}
			className={
				"transition ease-in-out duration-300 p-3 bg-violet-500 rounded hover:bg-violet-700" +
				(className ? " " + className : "")
			}
		>
			{children}
		</button>
	);
}
