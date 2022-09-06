import "source-map-support/register";
import schema from "./schema";
import { ValidatedEventAPIGatewayProxyEvent } from "@common/apiGateway";
import ResponseModel, { StatusCode } from "@common/response.model";
import { middyfy } from "@common/lambda";
import Category from "@models/category.model";
import { getCategory, updateCategory } from "@repositories/categoryRepository";

const updateCategoryHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
	async (event) => {
		try {
			const categoryId = event.pathParameters.id;
			const { body } = event;

			const dbItem = await getCategory(categoryId) as Category;
			if (!dbItem) {
				return ResponseModel.notFound(
					null,
					`Category with id ${categoryId} does not exist!`
				);
			}

			dbItem.name = body.name;
			dbItem.description = body.description;
			dbItem.departmentId = body.departmentId;

			const data = await updateCategory(dbItem);

			return new ResponseModel(
				data,
				StatusCode.OK,
				"Category updated"
			).generate();
		} catch (e) {
			const response =
				e instanceof ResponseModel
					? e
					: new ResponseModel(null, StatusCode.ERROR, e.message);
			return response.generate();
		}
	};
export const main = middyfy(updateCategoryHandler);
