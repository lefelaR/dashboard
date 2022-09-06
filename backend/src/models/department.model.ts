import { v4 as UUID } from "uuid";

export default class Department {
	id: string;
	title: string;
	description: string;
	createdAt: number;
	categories: string[] = [];
	constructor(title: string, description: string, id = null) {
		this.id = id !== null ? id : UUID();
		this.title = title;
		this.description = description;
	}
}
