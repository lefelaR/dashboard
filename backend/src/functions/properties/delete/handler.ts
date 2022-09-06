import "source-map-support/register";
import ResponseModel from "@common/response.model";
import { middyfy } from "@common/lambda";
import { deleteProperty } from "@repositories/propertyRepository";
import { APIGatewayEvent } from "aws-lambda";
import errorResponse from "@common/errorResponse";

const deletePropertyHandler = async (event: APIGatewayEvent) => {
	try {
		const propertyId = event.pathParameters.id;
		const data = await deleteProperty(propertyId);
		return ResponseModel.ok(data, "Property deleted");
	} catch (e) {
		return errorResponse(e);
	}
};
export const main = middyfy(deletePropertyHandler);
