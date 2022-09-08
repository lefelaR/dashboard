import 'source-map-support/register';
import ResponseModel, { StatusCode } from '@common/response.model';
import { middyfy } from '@common/lambda';
import { getAllMembers } from '../../../repositories/mailSubscribers';

const getAllMembersHandler = async () => {
    try {
        const data = await getAllMembers();
        return ResponseModel.ok(data, 'Fetched all Members');
    } catch (e) {
        const response = e instanceof ResponseModel ? e : new ResponseModel(null, StatusCode.ERROR, e.message);
        return response.generate();
    }
};
export const main = middyfy(getAllMembersHandler);
