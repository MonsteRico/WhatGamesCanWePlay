export interface Connections {
	type: string;
	id: string;
	name: string;
	visibility: number;
	friendSync: boolean;
	showActivity: boolean;
	verified: boolean;
	twoWayLink: boolean;
}

export interface Group {
	id: string;
	name: string;
	joinCode: string;
	ownerId: string;
	memberIds: string[];
}
