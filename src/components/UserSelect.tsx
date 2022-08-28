import React from "react";
import UserIcon from "./UserIcon";

interface UserSelectProps {
	enabledUsers: string[];
	setEnabledUsers: React.Dispatch<React.SetStateAction<string[]>>;
	usersInstalledGamesQuery: any;
	groupMembers:
		| (
				| {
						userId: string;
						userName: string | null;
						steamId: string | null;
						image: string | null;
				  }
				| undefined
		  )[]
		| undefined;
	disabledUsers: string[];
	setDisabledUsers: React.Dispatch<React.SetStateAction<string[]>>;
}

export function UserSelect(props: UserSelectProps) {
	return (
		<div className="flex flex-row items-start justify-evenly w-2/4">
			<div className="flex flex-col items-center justify-center w-full">
				<h1>Online</h1>
				<div className="flex flex-row">
					{props.groupMembers?.map((member) => {
						if (props.enabledUsers.includes(member?.steamId as string) && member) {
							return (
								<div
									className="flex flex-col p-3 items-center justify-center"
									onClick={() => {
										// remove from enabled users and add to disabled users
										props.setDisabledUsers([...props.disabledUsers, member.steamId as string]);
										props.setEnabledUsers(
											props.enabledUsers.filter((user) => user !== member.steamId)
										);
										props.usersInstalledGamesQuery.refetch();
									}}
								>
									<UserIcon src={member.image} username={member.userName}></UserIcon>
									<p>{member.userName}</p>
								</div>
							);
						}
					})}
				</div>
			</div>
			<div className="flex flex-col items-center justify-center w-full">
				<h1>Offline</h1>
				<div className="flex flex-row">
					{props.groupMembers?.map((member) => {
						if (props.disabledUsers.includes(member?.steamId as string) && member) {
							return (
								<div
									className="flex flex-col items-center p-3 justify-between"
									onClick={() => {
										// add to enabled users and remove from disabled users
										props.setEnabledUsers([...props.enabledUsers, member.steamId as string]);
										props.setDisabledUsers(
											props.disabledUsers.filter((user) => user !== member.steamId)
										);
										props.usersInstalledGamesQuery.refetch();
									}}
								>
									<UserIcon src={member.image} username={member.userName}></UserIcon>
									<p>{member.userName}</p>
								</div>
							);
						}
					})}
				</div>
			</div>
		</div>
	);
}
