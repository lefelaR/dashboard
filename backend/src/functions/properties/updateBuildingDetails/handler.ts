import "source-map-support/register";
import schema from "./schema";
import { ValidatedEventAPIGatewayProxyEvent } from "@common/apiGateway";
import ResponseModel from "@common/response.model";
import { middyfy } from "@common/lambda";
import { BuildingDetails } from "@models/property.model";
import { updateBuildingDetails } from "@repositories/propertyRepository";
import errorResponse from "@common/errorResponse";

const updatePropertiesHandler: ValidatedEventAPIGatewayProxyEvent<
	typeof schema
> = async (event) => {
	try {
		const properyId = event.pathParameters.id;
		const { body } = event;
		const update = { ...body } as unknown as BuildingDetails;
		const data = await updateBuildingDetails(properyId, update);

		return ResponseModel.ok(data, "Property updated");
	} catch (e) {
		return errorResponse(e);
	}
};
export const main = middyfy(updatePropertiesHandler);
