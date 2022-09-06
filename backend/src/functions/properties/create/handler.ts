import "source-map-support/register";
import schema from "./schema";
import { ValidatedEventAPIGatewayProxyEvent } from "@common/apiGateway";
import ResponseModel from "@common/response.model";
import { middyfy } from "@common/lambda";
import PropertyModel from "@models/property.model";
import { addProperty } from "@repositories/propertyRepository";
import errorResponse from "@common/errorResponse";

const createPropertyHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
	async (event) => {
		try {
			const { body } = event;
			const property = { ...body };
			const data = await addProperty(property as unknown as PropertyModel);
			return ResponseModel.created(data, "Property created");
		} catch (e) {
			return errorResponse(e);
		}
	};
export const main = middyfy(createPropertyHandler);
