import "source-map-support/register";
import ResponseModel from "@common/response.model";
import { middyfy } from "@common/lambda";
import { getAllProperties } from "@repositories/propertyRepository";
import errorResponse from "@common/errorResponse";

const getAllPropertyiesHandler = async () => {
	try {
		const data = await getAllProperties();
		return ResponseModel.ok(data, "Fetched all Categories");
	} catch (e) {
		return errorResponse(e);
	}
};
export const main = middyfy(getAllPropertyiesHandler);
