import "source-map-support/register";
import schema from "./schema";
import { ValidatedEventAPIGatewayProxyEvent } from "@common/apiGateway";
import ResponseModel from "@common/response.model";
import { middyfy } from "@common/lambda";
import User from "@models/user.model";
import { addUser } from "@repositories/userRepository";
import errorResponse from "@common/errorResponse";

const createRoleHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
	async (event) => {
		try {
			const { body } = event;
			const user = new User(body.id);
			user.firstName = body.firstName;
			user.lastName = body.lastName;
			user.email = body.email;
			user.department = body.department;
			user.roles = body.roles as string[];
			user.avatar = body.avatar;
			const data = await addUser(user);
			return ResponseModel.ok(data, "user created");
		} catch (error) {
			return errorResponse(error);
		}
	};
export const main = middyfy(createRoleHandler);
