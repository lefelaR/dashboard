import "source-map-support/register";
import ResponseModel, { StatusCode } from "@common/response.model";
import { middyfy } from "@common/lambda";
import { getAllLogs } from "@repositories/logRepository";

const createCategoryHandler = async () => {
	try {
		const data = (await getAllLogs()).Items;
		return ResponseModel.ok(data, "Fetched all Logs");
	} catch (e) {
		const response =
			e instanceof ResponseModel
				? e
				: new ResponseModel(null, StatusCode.ERROR, e.message);
		return response.generate();
	}
};
export const main = middyfy(createCategoryHandler);
