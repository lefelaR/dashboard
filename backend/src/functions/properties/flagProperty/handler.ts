import "source-map-support/register";
import schema from "./schema";
import { ValidatedEventAPIGatewayProxyEvent } from "@common/apiGateway";
import ResponseModel from "@common/response.model";
import { middyfy } from "@common/lambda";
import errorResponse from "@common/errorResponse";
import { flagPropertyForValidation, getProperty } from "@repositories/propertyRepository";

const flagPropertyHandler: ValidatedEventAPIGatewayProxyEvent<
	typeof schema
> = async (event) => {
	try {
		const propertyId = event.pathParameters.id;
		const { body } = event;
		const property = await getProperty(propertyId);

		if (!property) return ResponseModel.notFound(`Property with id ${propertyId} was not Found.`);

		await flagPropertyForValidation(propertyId, body.message);

		return ResponseModel.ok({}, "Property Flagged for update");
	} catch (e) {
		return errorResponse(e);
	}
};
export const main = middyfy(flagPropertyHandler);
