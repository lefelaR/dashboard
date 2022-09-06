import 'source-map-support/register';
import ResponseModel, {StatusCode} from '@common/response.model';
import {middyfy} from '@common/lambda';
import {getAllDepartments} from "@repositories/departmentsRepository";

const getAllDepartmentsHandler = async () => {
    try {
        const data = await getAllDepartments();
        return  ResponseModel.ok(data, 'Fetched all Departments');
    } catch (e) {
        const response = e instanceof ResponseModel ? e : new ResponseModel(null, StatusCode.ERROR, e.message);
        return response.generate();
    }
};
export const main = middyfy(getAllDepartmentsHandler);
