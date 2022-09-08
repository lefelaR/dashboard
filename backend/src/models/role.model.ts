import { v4 as UUID } from "uuid";

export default class Role {
	id: string;
	title: string;
	description: string;
	permissions: string[];
	createdAt: number;

	constructor(title: string, description: string, id = null) {
		this.id = id !== null ? id : UUID();
		this.title = title;
		this.description = description;
	}

	addPermissions(permissions: string[]) {
		if (permissions.length > 0) {
			permissions.forEach((permission) => this.permissions.push(permission));
		}
	}
}
