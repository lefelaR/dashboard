import "source-map-support/register";
import { middyfy } from "@common/lambda";
import permissions from "@permissions/index";
import ResponseModel, { StatusCode } from "@common/response.model";
import AppConfig from "../../../../app.config.js";
const getAllHandler = async () => {
	try {
		const data = {
			...AppConfig,
			permissions,
		};
		return new ResponseModel(data).generate();
	} catch (e) {
		return e instanceof ResponseModel
			? e.generate()
			: new ResponseModel(undefined, StatusCode.ERROR, e.message).generate();
	}
};

export const main = middyfy(getAllHandler);
