import "source-map-support/register";
import ResponseModel from "@common/response.model";
import { middyfy } from "@common/lambda";
import { getUserInteractions } from "@repositories/interactionRepository";
import errorResponse from "@common/errorResponse";
import { APIGatewayEvent } from "aws-lambda";

const getUserInteractionsHandler = async (event: APIGatewayEvent) => {

    try {
        const userId = event.pathParameters.id;
        const data = await getUserInteractions(userId);
        return ResponseModel.ok(data, "Fetched Interactions logged by user");
    } catch (e) {
        return errorResponse(e);
    }
};
export const main = middyfy(getUserInteractionsHandler);
