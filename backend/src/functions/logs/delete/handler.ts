import "source-map-support/register";
import ResponseModel, { StatusCode } from "@common/response.model";
import { middyfy } from "@common/lambda";
import { APIGatewayEvent } from "aws-lambda";
import { deleteLog } from "@repositories/logRepository";

const createCategoryHandler = async (event: APIGatewayEvent) => {
	try {
		const logId = event.pathParameters.id;
		const data = await deleteLog(logId);
		return ResponseModel.ok(data, "Log deleted");
	} catch (e) {
		const response =
			e instanceof ResponseModel
				? e
				: new ResponseModel(null, StatusCode.ERROR, e.message);
		return response.generate();
	}
};
export const main = middyfy(createCategoryHandler);
