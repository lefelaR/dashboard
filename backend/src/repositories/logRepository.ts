import DynamoDatabaseService from "@services/DynamoDatabaseService";
import Log from "@models/log.model";

const TableName = process.env.LOG_TABLE;

export const createLog = async (log: Log) => {
	log.createdAt = new Date().getTime();
	const params = {
		TableName,
		Item: {
			...log,
		},
	};
	await DynamoDatabaseService.create(params);
	return log.id;
};

export const getLog = async (logId: string) => {
	const params = {
		TableName,
		Key: {
			id: logId,
		},
	};
	return (await DynamoDatabaseService.get(params)).Item;
};

export const getAllLogs = async () => {
	const params = {
		TableName,
	};
	return await DynamoDatabaseService.scan(params);
};

export const deleteLog = async (logId: string) => {
	const params = {
		TableName,
		Key: {
			id: logId,
		},
	};
	await DynamoDatabaseService.delete(params);
	return params.Key.id;
};
