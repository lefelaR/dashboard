import "source-map-support/register";
import schema from "./schema";
import { ValidatedEventAPIGatewayProxyEvent } from "@common/apiGateway";
import ResponseModel from "@common/response.model";
import { middyfy } from "@common/lambda";
import Interaction from "@models/interaction.model";
import { addInteraction } from "@repositories/interactionRepository";
import errorResponse from "@common/errorResponse";

const updateInteractionHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
    async (event) => {
        try {
            const { body } = event;
            const property = { ...body };
            const data = await addInteraction(property as unknown as Interaction);
            return ResponseModel.created(data, "Interaction created");
        } catch (e) {
            return errorResponse(e);
        }
    };
export const main = middyfy(updateInteractionHandler);
