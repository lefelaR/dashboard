import 'source-map-support/register';
import ResponseModel, { StatusCode } from '@common/response.model';
import { middyfy } from '@common/lambda';
import { getAllItems } from '../../../repositories/itemsRepository';

const getAllItemsHandler = async () => {
    try {
        const data = await getAllItems();
        return ResponseModel.ok(data, 'Fetched all Items');
    } catch (e) {
        const response = e instanceof ResponseModel ? e : new ResponseModel(null, StatusCode.ERROR, e.message);
        return response.generate();
    }
};
export const main = middyfy(getAllItemsHandler);
