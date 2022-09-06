import "source-map-support/register";
import schema from "./schema";
import { ValidatedEventAPIGatewayProxyEvent } from "@common/apiGateway";
import ResponseModel from "@common/response.model";
import { middyfy } from "@common/lambda";
import errorResponse from "@common/errorResponse";
import MailSubscriber from "@models/mailSubscriber.model";
import { addSubscriber } from "@repositories/mailSubscribers";

const createRoleHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
	async (event) => {
		try {
			const { body } = event;
			const mailSubscriber = new MailSubscriber(body.name, body.email);
			const result = await addSubscriber(mailSubscriber);
			return ResponseModel.created(result, "member added");
		} catch (error) {
			return errorResponse(error);
		}
	};
export const main = middyfy(createRoleHandler);
