import 'source-map-support/register';
import ResponseModel, {StatusCode} from '@common/response.model';
import {middyfy} from '@common/lambda';
import { getCategory} from "@repositories/categoryRepository";
import {APIGatewayEvent} from "aws-lambda";

const createCategoryHandler = async (event:APIGatewayEvent) => {
    try {
        const categoryId = event.pathParameters.id;

        const data = await getCategory(categoryId);

        return new ResponseModel(data, StatusCode.Created, 'Fetched Category').generate();
    } catch (e) {
        const response = e instanceof ResponseModel ? e : new ResponseModel(null, StatusCode.ERROR, e.message);
        return response.generate();
    }
};
export const main = middyfy(createCategoryHandler);
