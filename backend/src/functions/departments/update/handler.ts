import "source-map-support/register";
import schema from "./schema";
import { ValidatedEventAPIGatewayProxyEvent } from "@common/apiGateway";
import ResponseModel, { StatusCode } from "@common/response.model";
import { middyfy } from "@common/lambda";
import {getDepartment, updateDepartment,} from "@repositories/departmentsRepository";
import Department from "@models/department.model";

const updateDepartmentHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
	async (event) => {
		try {
			const categoryId = event.pathParameters.id;
			const { body } = event;

			const dbItem = await getDepartment(categoryId);

			if (!dbItem) {
				return ResponseModel.notFound(
					null,
					`Department with id ${categoryId} does not exist!`
				);
			}

			const department = new Department(body.title,body.description,dbItem.id);

			department.createdAt = dbItem.createdAt;

			const data = await updateDepartment(department);

			return new ResponseModel(
				data,
				StatusCode.OK,
				"Department updated"
			).generate();
		} catch (e) {
			const response =
				e instanceof ResponseModel
					? e
					: new ResponseModel(null, StatusCode.ERROR, e.message);
			return response.generate();
		}
	};
export const main = middyfy(updateDepartmentHandler);
