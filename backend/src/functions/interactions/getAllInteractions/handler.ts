import "source-map-support/register";
import ResponseModel from "@common/response.model";
import { middyfy } from "@common/lambda";
import { getAllInteractions } from "@repositories/interactionRepository";
import errorResponse from "@common/errorResponse";

const getAllInteractionsHandler = async () => {
    try {
        const data = await getAllInteractions();
        return ResponseModel.ok(data, "Fetched all Categories");
    } catch (e) {
        return errorResponse(e);
    }
};
export const main = middyfy(getAllInteractionsHandler);
