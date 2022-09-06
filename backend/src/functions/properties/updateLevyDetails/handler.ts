import "source-map-support/register";
import schema from "./schema";
import { ValidatedEventAPIGatewayProxyEvent } from "@common/apiGateway";
import ResponseModel from "@common/response.model";
import { middyfy } from "@common/lambda";
import { LevyModel } from "@models/property.model";
import { updatePropertyLevy } from "@repositories/propertyRepository";
import errorResponse from "@common/errorResponse";

const updatePropertiesHandler: ValidatedEventAPIGatewayProxyEvent<
	typeof schema
> = async (event) => {
	try {
		const propertyId = event.pathParameters.id;
		const { body } = event;
		const update = { ...body } as unknown as LevyModel;
		const data = await updatePropertyLevy(propertyId, update);

		return ResponseModel.ok(data, "Property updated");
	} catch (e) {
		return errorResponse(e);
	}
};
export const main = middyfy(updatePropertiesHandler);
