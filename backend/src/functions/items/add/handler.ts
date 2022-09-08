import "source-map-support/register";
import schema from "./schema";
import { ValidatedEventAPIGatewayProxyEvent } from "@common/apiGateway";
import ResponseModel from "@common/response.model";
import { middyfy } from "@common/lambda";
import errorResponse from "@common/errorResponse";
import Item from "@models/items.model";
import { addItem } from "@repositories/itemsRepository";



const createRoleHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
	async (event) => {
		try {
			const { body } = event;
			const item = new Item();
			item.id = '',
			item.brand = body.brand;
			item.color = body.color;
			item.category = body.category;
			item.description = body.description;
			item.createdAt = Date.now()
			const result = await addItem(item);
			return ResponseModel.created(result, "member added");
		} catch (error) {
			return errorResponse(error);
		}
	};
export const main = middyfy(createRoleHandler);
