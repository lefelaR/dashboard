import { middyfy } from '@common/lambda';
import { APIGatewayEvent } from "aws-lambda";
import { deleteInteraction } from "@repositories/interactionRepository";
import ResponseModel from "@common/response.model";

const deleteInteractionHandler = async (event: APIGatewayEvent) => {
    const interactionId = event.pathParameters.id;
    const data = await deleteInteraction(interactionId)
    // return formatJSONResponse(new ResponseModel({}, StatusCode.OK));
    return ResponseModel.ok(data, "Deleted Interaction");
}

export const main = middyfy(deleteInteractionHandler);
