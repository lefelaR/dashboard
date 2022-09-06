import 'source-map-support/register';
import ResponseModel, {StatusCode} from '@common/response.model';
import {middyfy} from '@common/lambda';
import {getAllRoles} from "@repositories/rolesRepository";

const createCategoryHandler = async () => {
    try {
        const data = await getAllRoles();
        return new ResponseModel(data, StatusCode.Created, 'Fetched all roles').generate();
    } catch (e) {
        const response = e instanceof ResponseModel ? e : new ResponseModel(null, StatusCode.ERROR, e.message);
        return response.generate();
    }
};
export const main = middyfy(createCategoryHandler);
