import "source-map-support/register";
import schema from "./schema";
import { ValidatedEventAPIGatewayProxyEvent } from "@common/apiGateway";
import ResponseModel, { StatusCode } from "@common/response.model";
import { middyfy } from "@common/lambda";
import { getRole, updateRole } from "@repositories/rolesRepository";
import Role from "@models/role.model";

const createUserRoleHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
	async (event) => {
		try {
			const userRoleId = event.pathParameters.id;
			const { body } = event;

			const role =( await getRole(userRoleId)) as Role;

			if (!role) {
				return ResponseModel.notFound(
					null,
					`User Role with id ${userRoleId} does not exist!`
				);
			}
			role.title = body.title;
			role.description = body.description;
			role.permissions = body.permissions as string[];
			const data = await updateRole(role);

			return new ResponseModel(
				data,
				StatusCode.OK,
				"Role updated"
			).generate();

		} catch (e) {
			const response =
				e instanceof ResponseModel
					? e
					: new ResponseModel(null, StatusCode.ERROR, e.message);
			return response.generate();
		}
	};
export const main = middyfy(createUserRoleHandler);
