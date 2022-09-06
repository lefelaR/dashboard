import "source-map-support/register";
import { middyfy } from "@common/lambda";
import LogModel, { LogType } from "@models/log.model";
import { createLog } from "@repositories/logRepository";

const createCategoryHandler = async (event) => {
	try {
		const description = event.detail.description;
		const data = event.detail.data;
		let logType = LogType.INFO;
		const logEnvironment = process.env.environment;
		const newLog = new LogModel(description, logType, logEnvironment);
		newLog.data = JSON.stringify(data);
		await createLog(newLog);
	} catch (e) {
		console.log("There was an error sending: ", e);
	}
};
export const main = middyfy(createCategoryHandler);
