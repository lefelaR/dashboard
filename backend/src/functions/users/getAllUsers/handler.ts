import "source-map-support/register";
import ResponseModel from "@common/response.model";
import { middyfy } from "@common/lambda";
import { getAllUsers } from "@repositories/userRepository";
import errorResponse from "@common/errorResponse";

const createCategoryHandler = async () => {
	try {
		const data = await getAllUsers();
		return ResponseModel.ok(data, "Fetched all Users");
	} catch (e) {
		return errorResponse(e);
	}
};
export const main = middyfy(createCategoryHandler);
