import 'source-map-support/register';
import ResponseModel, {StatusCode} from '@common/response.model';
import {middyfy} from '@common/lambda';
import {getAllCategories} from "@repositories/categoryRepository";

const createCategoryHandler = async () => {
    try {
        const data = await getAllCategories();

        return new ResponseModel(data, StatusCode.Created, 'Fetched all Categories').generate();
    } catch (e) {
        const response = e instanceof ResponseModel ? e : new ResponseModel(null, StatusCode.ERROR, e.message);
        return response.generate();
    }
};
export const main = middyfy(createCategoryHandler);
