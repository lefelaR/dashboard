import { v4 as UUID } from "uuid";

export enum LogType {
	INFO = "Information",
	WARNING = "Warning",
	ERROR = "Error",
}
export default class LogModel {
	id: string;
	description: string;
	environment: string;
	data: string;
	type: LogType;
	createdAt: number;

	constructor(
		description: string,
		type: LogType,
		environment: string,
		id: string = null
	) {
		this.id = id !== null ? id : UUID();
		this.description = description;
		this.environment = environment;
		this.type = type;
	}
}
