import "source-map-support/register";
import ResponseModel from "@common/response.model";
import { middyfy } from "@common/lambda";
import { getUnverifiedProperties } from "@repositories/propertyRepository";
import errorResponse from "@common/errorResponse";

const getUnverifiedPropertiesHandler = async () => {
	try {
		const data = await getUnverifiedProperties();
		return ResponseModel.ok(data, "Fetched all unverified properties");
	} catch (e) {
		return errorResponse(e);
	}
};
export const main = middyfy(getUnverifiedPropertiesHandler);
