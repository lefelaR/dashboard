import "source-map-support/register";
import schema from "./schema";
import { ValidatedEventAPIGatewayProxyEvent } from "@common/apiGateway";
import ResponseModel, { StatusCode } from "@common/response.model";
import { middyfy } from "@common/lambda";
import LogModel, { LogType } from "@models/log.model";
import { createLog } from "@repositories/logRepository";

const createCategoryHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
	async (event) => {
		try {
			const { body } = event;
			let logType = body.type as LogType;

			const description = body.description;
			const logEnvironment = body.description;
			const newLog = new LogModel(description, logType, logEnvironment);
			const result = await createLog(newLog);
			return ResponseModel.ok(result, "Log created");
		} catch (e) {
			const response =
				e instanceof ResponseModel
					? e
					: new ResponseModel(null, StatusCode.ERROR, e.message);
			return response.generate();
		}
	};
export const main = middyfy(createCategoryHandler);
