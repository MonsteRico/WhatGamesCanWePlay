interface LeaveButtonProps {
	groupId: string;
	session: any;
	push: any;
	ownerId: string;
	mutate: any;
}
export function LeaveButton(props: LeaveButtonProps) {
	return (
		<button
			className="p-3 bg-red-700 rounded"
			onClick={() => {
				if (props.session?.user?.id !== props.ownerId) {
					props.mutate({
						groupId: props.groupId,
						userId: props.session?.user?.id as string,
					});
					window.alert("You have left the group.");
					props.push("/groups");
				} else {
					window.alert("You can't leave the group you made. This shouldn't even be possible honestly.");
				}
			}}
		>
			Leave Group
		</button>
	);
}
