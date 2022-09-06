import "source-map-support/register";
import schema from "./schema";
import { ValidatedEventAPIGatewayProxyEvent } from "@common/apiGateway";
import ResponseModel, { StatusCode } from "@common/response.model";
import { middyfy } from "@common/lambda";
import Interaction from "@models/interaction.model";
import { editInteraction, getInteraction } from "@repositories/interactionRepository";
import errorResponse from "@common/errorResponse";

const createInteractionHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
    async (event) => {
        try {

            const dbItem = await getInteraction(event.pathParameters.id);
            if (!dbItem) return new ResponseModel({}, StatusCode.NOT_FOUND, `Interaction does not exist.`).generate();
            const { body } = event;
            const property = { ...body };
            const data = await editInteraction(property as unknown as Interaction);
            return ResponseModel.created(data, "Interaction created");
        } catch (e) {
            return errorResponse(e);
        }
    };
export const main = middyfy(createInteractionHandler);
