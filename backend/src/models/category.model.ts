import { v4 as UUID } from "uuid";

export default class Category {
	id: string;
	name: string;
	description: string;
	departmentId: string;
	createdAt: number;

	constructor(name: string, description: string, id = null) {
		this.id = id !== null ? id : UUID();
		this.name = name;
		this.description = description;
	}
}
