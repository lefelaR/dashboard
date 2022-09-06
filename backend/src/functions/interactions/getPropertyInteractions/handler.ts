import "source-map-support/register";
import ResponseModel from "@common/response.model";
import { middyfy } from "@common/lambda";
import { getPropertyInteractions } from "@repositories/interactionRepository";
import errorResponse from "@common/errorResponse";
import { APIGatewayEvent } from "aws-lambda";

const getPropertyInteractionsHandler = async (event: APIGatewayEvent) => {

    try {
        const propertyId = event.pathParameters.id;
        const data = await getPropertyInteractions(propertyId);
        return ResponseModel.ok(data, "Fetched Interactions for property");
    } catch (e) {
        return errorResponse(e);
    }
};
export const main = middyfy(getPropertyInteractionsHandler);
