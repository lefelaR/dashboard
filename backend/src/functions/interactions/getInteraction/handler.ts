import "source-map-support/register";
import ResponseModel from "@common/response.model";
import { middyfy } from "@common/lambda";
import { getInteraction } from "@repositories/interactionRepository";
import errorResponse from "@common/errorResponse";
import { APIGatewayEvent } from "aws-lambda";

const getInteractionHandler = async (event: APIGatewayEvent) => {

    try {
        const interactionId = event.pathParameters.id;
        const data = await getInteraction(interactionId);
        if (!data)
            return ResponseModel.notFound(
                null,
                `Interaction does not exist.`
            );
        return ResponseModel.ok(data, "Fetched Interaction");
    } catch (e) {
        return errorResponse(e);
    }
};
export const main = middyfy(getInteractionHandler);
