import "source-map-support/register";
import ResponseModel, { StatusCode } from "@common/response.model";
import { middyfy } from "@common/lambda";
import { APIGatewayEvent } from "aws-lambda";
import { getLog } from "@repositories/logRepository";

const createCategoryHandler = async (event: APIGatewayEvent) => {
	try {
		const logId = event.pathParameters.id;
		const data = await getLog(logId);
		if (!data)
			return ResponseModel.notFound(null, `Log with id ${logId} was not found`);
		return ResponseModel.ok(data, "Fetched Log");
	} catch (e) {
		const response =
			e instanceof ResponseModel
				? e
				: new ResponseModel(null, StatusCode.ERROR, e.message);
		return response.generate();
	}
};
export const main = middyfy(createCategoryHandler);
