import 'source-map-support/register';
import ResponseModel, {StatusCode} from '@common/response.model';
import {middyfy} from '@common/lambda';
import {deleteCategory} from "@repositories/categoryRepository";
import {APIGatewayEvent} from "aws-lambda";

const createCategoryHandler = async (event: APIGatewayEvent) => {
    try {
        const categoryId = event.pathParameters.id;
        const data = await deleteCategory(categoryId);
        return  ResponseModel.ok(data, 'Category deleted');

    } catch (e) {
        const response = e instanceof ResponseModel ? e : new ResponseModel(null, StatusCode.ERROR, e.message);
        return response.generate();
    }
};
export const main = middyfy(createCategoryHandler);
