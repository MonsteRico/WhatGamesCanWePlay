import { z } from "zod";
import { Group } from "../../types/types";
import { createProtectedRouter } from "./protected-router";

// Example router with queries that can only be hit if the user requesting is signed in
export const groupsRouter = createProtectedRouter()
	.mutation("createGroup", {
		input: z.object({
			name: z.string(),
			creatorId: z.string(),
		}),
		async resolve({ input, ctx }): Promise<Group> {
			const { name, creatorId: ownerId } = input;
			const { prisma } = ctx;
			// TODO better way of generating join code
			let joinCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
			let group = await prisma.group.create({
				data: {
					name,
					joinCode,
				},
			});
			while (!group) {
				joinCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
				group = await prisma.group.create({
					data: {
						name,
						joinCode,
					},
				});
			}
			console.log("Group " + name + " join code is: " + joinCode);
			const groupOwner = await prisma.groupOwner.create({
				data: {
					group: {
						connect: {
							id: group.id,
						},
					},
					user: {
						connect: {
							id: ownerId,
						},
					},
				},
			});
			const groupMember = await prisma.groupMember.create({
				data: {
					group: {
						connect: {
							id: group.id,
						},
					},
					user: {
						connect: {
							id: ownerId,
						},
					},
				},
			});
			return {
				id: group.id,
				name: group.name,
				joinCode: group.joinCode,
				ownerId: groupOwner.userId,
				memberIds: [groupMember.userId],
			};
		},
	})
	.query("getGroups", {
		async resolve({ ctx }) {
			const { prisma } = ctx;
			const dbGroups = await prisma.group.findMany();
			const groups: Group[] = [];
			for (let i = 0; i < dbGroups.length; i++) {
				const group = dbGroups[i];
				if (group) {
					const groupMembers = await prisma.groupMember.findMany({
						where: {
							group: {
								id: group.id,
							},
						},
					});
					const groupCreator = await prisma.groupOwner.findFirst({
						where: {
							group: {
								id: group.id,
							},
						},
					});
					groups.push({
						id: group.id,
						name: group.name,
						joinCode: group.joinCode,
						ownerId: groupCreator?.userId as string,
						memberIds: groupMembers.map((member) => member.userId),
					});
				}
			}
			return groups;
		},
	})
	.query("getGroup", {
		input: z.object({
			groupId: z.string(),
		}),
		async resolve({ input, ctx }) {
			const { groupId } = input;
			const { prisma } = ctx;
			const group = await prisma.group.findFirst({
				where: {
					id: groupId,
				},
			});
			if (!group) {
				return null;
			}
			const groupMembers = await prisma.groupMember.findMany({
				where: {
					group: {
						id: group.id,
					},
				},
			});
			const groupOwner = await prisma.groupOwner.findFirst({
				where: {
					group: {
						id: group.id,
					},
				},
			});
			return {
				id: group.id,
				name: group.name,
				joinCode: group.joinCode,
				ownerId: groupOwner?.userId as string,
				memberIds: groupMembers.map((member) => member.userId),
			};
		},
	})
	.mutation("joinGroup", {
		input: z.object({
			joinCode: z.string(),
			userId: z.string(),
		}),
		async resolve({ input, ctx }) {
			const { joinCode, userId } = input;
			const { prisma } = ctx;
			const group = await prisma.group.findFirst({
				where: {
					joinCode,
				},
			});
			if (ctx.session.user.id === userId && group) {
				// check if user is already a member of the group
				const groupMember = await prisma.groupMember.findFirst({
					where: {
						group: {
							id: group.id,
						},
						user: {
							id: userId,
						},
					},
				});
				if (!groupMember) {
					const groupMember = await prisma.groupMember.create({
						data: {
							group: {
								connect: {
									id: group.id,
								},
							},
							user: {
								connect: {
									id: userId,
								},
							},
						},
					});
				}
				console.log("Group: " + group?.joinCode);
				return {
					joinedId: group.id,
				};
			} else {
				return {
					joinedId: null,
				};
			}
		},
	})
	.mutation("leaveGroup", {
		input: z.object({
			groupId: z.string(),
			userId: z.string(),
		}),
		async resolve({ input, ctx }) {
			const { groupId, userId } = input;
			const { prisma } = ctx;
			const group = await prisma.group.findFirst({
				where: {
					id: groupId,
				},
			});

			if (ctx.session.user.id === userId && group) {
				const groupMember = await prisma.groupMember.findFirst({
					where: {
						group: {
							id: groupId,
						},
						user: {
							id: userId,
						},
					},
				});

				if (groupMember) {
					await prisma.groupMember.delete({
						where: {
							id: groupMember.id,
						},
					});

					return true;
				} else {
					return false;
				}
			}
		},
	})
	.mutation("deleteGroup", {
		input: z.object({
			groupId: z.string(),
			userId: z.string(),
		}),
		async resolve({ input, ctx }) {
			const { groupId, userId } = input;
			const { prisma } = ctx;
			const group = await prisma.group.findFirst({
				where: {
					id: groupId,
				},
			});
			const groupOwner = await prisma.groupOwner.findFirst({
				where: {
					group: {
						id: groupId,
					},
				},
			});
			if (group && groupOwner && userId == groupOwner.userId) {
				await prisma.group.delete({
					where: {
						id: groupId,
					},
				});
			}
		},
	})
	.query("getGroupMembers", {
		input: z.object({
			groupId: z.string(),
		}),
		async resolve({ input, ctx }) {
			const { groupId } = input;
			const { prisma } = ctx;
			const groupMembersInMembersTable = await prisma.groupMember.findMany({
				where: {
					group: {
						id: groupId,
					},
				},
			});
			const groupMembers = groupMembersInMembersTable.map(async (groupMemberEntry) => {
				const user = await prisma.user.findFirst({
					where: {
						id: groupMemberEntry.userId,
					},
				});
				if (user && groupMemberEntry.userId == user.id) {
					return { userId: user.id, userName: user.name, steamId: user.steamId };
				}
			});
			return await Promise.all(groupMembers);
		},
	});
