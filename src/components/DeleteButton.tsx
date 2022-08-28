interface DeleteButtonProps {
	groupId: string;
	session: any;
	router: any;
	deleteGroup: any;
	length: number;
}

export function DeleteButton(props: DeleteButtonProps) {
	return (
		<button
			className="p-3 bg-red-700 rounded"
			onClick={() => {
				if (window.confirm("Are you sure you want to delete this group?")) {
					if (props.length > 1) {
						if (
							window.confirm(
								"This group has members other than you. Are you sure you want to delete this group?"
							)
						) {
							props.deleteGroup.mutate({
								groupId: props.groupId,
								userId: props.session?.user?.id as string,
							});
							props.router.push("/groups");
						}
					} else {
						props.deleteGroup.mutate({
							groupId: props.groupId,
							userId: props.session?.user?.id as string,
						});
						props.router.push("/groups");
					}
				}
			}}
		>
			Delete Group
		</button>
	);
}
