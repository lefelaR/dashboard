import { APIGatewayEvent } from "aws-lambda";
import ResponseModel from '@common/response.model';
import { middyfy } from '@common/lambda';
import { getArticle } from "@repositories/newsletterRepository";
import errorResponse from '@common/errorResponse';

const getArticleHandler = async (event: APIGatewayEvent) => {
    try {
        const slug = event.pathParameters.id;
        const data = await getArticle(slug);
        return ResponseModel.ok(data, 'Article Fetched.');
    }
    catch (e) {
        return errorResponse(e);
    }

}
export const main = middyfy(getArticleHandler);