import "source-map-support/register";
import ResponseModel from "@common/response.model";
import { middyfy } from "@common/lambda";
import { getProperty } from "@repositories/propertyRepository";
import { APIGatewayEvent } from "aws-lambda";
import errorResponse from "@common/errorResponse";

const getPropertyhandler = async (event: APIGatewayEvent) => {
	try {
		const propertyId = event.pathParameters.id;

		const data = await getProperty(propertyId);
		return ResponseModel.ok(data, "Fetched Properties");
	} catch (e) {
		return errorResponse(e);
	}
};
export const main = middyfy(getPropertyhandler);
