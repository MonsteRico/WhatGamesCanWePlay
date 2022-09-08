import React from "react";
import { trpc } from "../utils/trpc";

export default function SetSteamIdContent() {
	const setSteamIdMutation = trpc.useMutation(["library.setUserSteamId"], {
		onSuccess: () => {
			window.location.reload();
		},
	});
	return (
		<div>
			<h1 className="text-3xl text-center mt-32 font-bold ">
				You do not have a Steam account linked to your Discord account
			</h1>
			<p className="text-2xl w-1/2 mt-10 mx-auto text-center">
				You can either link your Steam account with your Discord account and then log in again, or you can enter
				your Steam Id manually below. If you do not know your Steam Id, you can find it by going to your Steam
				profile and copying the number at the end of the URL. If you need more help finding it, you can Google
				&quot;How to find my Steam Id&quot;. You can also find more instructions{" "}
				<a
					className="text-violet-500 underline"
					href="https://help.steampowered.com/en/faqs/view/2816-BE67-5B69-0FEC"
				>
					here
				</a>
				.
			</p>
			<div className="flex flex-col justify-center items-center mt-10">
				<input
					className="border-2 border-violet-500 rounded-md p-2 w-1/2"
					type="text"
					placeholder="Steam Id"
				></input>
				<button
					className="bg-violet-500 text-white rounded-md p-2 mt-5 w-1/2"
					onClick={() => {
						setSteamIdMutation.mutate({
							steamId: document.querySelector("input")?.value as string,
						});
					}}
				>
					Update Steam Id
				</button>
			</div>
		</div>
	);
}
