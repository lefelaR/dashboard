import 'source-map-support/register';
import ResponseModel, {StatusCode} from '@common/response.model';
import {middyfy} from '@common/lambda';
import {deleteRole} from "@repositories/rolesRepository";
import {APIGatewayEvent} from "aws-lambda";

const createCategoryHandler = async (event: APIGatewayEvent) => {
    try {
        const userRoleId = event.pathParameters.id;
        const data = await deleteRole(userRoleId);
        return  ResponseModel.ok(data, 'Role deleted');

    } catch (e) {
        const response = e instanceof ResponseModel ? e : new ResponseModel(null, StatusCode.ERROR, e.message);
        return response.generate();
    }
};
export const main = middyfy(createCategoryHandler);
