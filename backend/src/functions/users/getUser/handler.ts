import "source-map-support/register";
import ResponseModel from "@common/response.model";
import { middyfy } from "@common/lambda";
import { APIGatewayEvent } from "aws-lambda";
import errorResponse from "@common/errorResponse";
import { getUser } from "@repositories/userRepository";

const createCategoryHandler = async (event: APIGatewayEvent) => {
	try {
		const id = event.pathParameters.id;
		const data = await getUser(id);
		return ResponseModel.ok(data, "Fetched user");
	} catch (e) {
		return errorResponse(e);
	}
};
export const main = middyfy(createCategoryHandler);
