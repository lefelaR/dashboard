import "source-map-support/register";
import schema from "./schema";
import { ValidatedEventAPIGatewayProxyEvent } from "@common/apiGateway";
import ResponseModel, { StatusCode } from "@common/response.model";
import { middyfy } from "@common/lambda";
import Category from "@models/category.model";
import { addCategory } from "@repositories/categoryRepository";

const createCategoryHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
	async (event) => {
		try {
			const { body } = event;
			const category = new Category(body.name, body.description);
			category.departmentId = body.departmentId;
			const data = await addCategory(category);
			return new ResponseModel(
				data,
				StatusCode.Created,
				"Category created"
			).generate();
		} catch (e) {
			const response =
				e instanceof ResponseModel
					? e
					: new ResponseModel(null, StatusCode.ERROR, e.message);
			return response.generate();
		}
	};
export const main = middyfy(createCategoryHandler);
