import 'source-map-support/register';
import ResponseModel, {StatusCode} from '@common/response.model';
import {middyfy} from '@common/lambda';
import { getRole} from "@repositories/rolesRepository";
import {APIGatewayEvent} from "aws-lambda";

const createCategoryHandler = async (event:APIGatewayEvent) => {
    try {
        const id = event.pathParameters.id;

        const data = await getRole(id);

        return new ResponseModel(data, StatusCode.Created, 'Fetched user role').generate();
    } catch (e) {
        const response = e instanceof ResponseModel ? e : new ResponseModel(null, StatusCode.ERROR, e.message);
        return response.generate();
    }
};
export const main = middyfy(createCategoryHandler);
