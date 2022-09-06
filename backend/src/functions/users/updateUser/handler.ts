import "source-map-support/register";
import schema from "./schema";
import { ValidatedEventAPIGatewayProxyEvent } from "@common/apiGateway";
import ResponseModel from "@common/response.model";
import { middyfy } from "@common/lambda";
import User from "@models/user.model";
import { getUser, updateUser } from "@repositories/userRepository";
import errorResponse from "@common/errorResponse";

const updateUserHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
	async (event) => {
		try {
			const userId = event.pathParameters.id;

			const { body } = event;

			const user = await getUser(userId) as User;

			if (!user) return ResponseModel.notFound(userId, `User with ID ${userId} was not not found`);

			user.firstName = body.firstName;
			user.lastName = body.lastName;
			user.department = body.department ? body.department : "";
			user.lastLoggedIn = body.lastLoggedIn;
			user.roles = body.roles as string[];

			user.avatar = user.avatar === "" || user.avatar === undefined ? User.DefaultAvatar : user.avatar;

			if (!!body.avatar && body.avatar !== user.avatar) {
				user.avatar = body.avatar;
			}
			user.isActive = body.isActive;
			const data = await updateUser(user);

			return ResponseModel.ok(data, "user updated");
		} catch (error) {
			return errorResponse(error);
		}
	};
export const main = middyfy(updateUserHandler);
