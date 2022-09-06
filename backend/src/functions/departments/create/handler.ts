import 'source-map-support/register';
import schema from './schema';
import {ValidatedEventAPIGatewayProxyEvent} from '@common/apiGateway';
import ResponseModel, {StatusCode} from '@common/response.model';
import {middyfy} from '@common/lambda';
import Department from "@models/department.model";
import {addDepartment} from "@repositories/departmentsRepository";

const createDepartmentHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    try {
        const { body } = event;
        const department = new Department(body.title,body.description);
        const data = await  addDepartment(department);
        return ResponseModel.ok(data, 'Department created');
    } catch (e) {
        const response = e instanceof ResponseModel ? e: new ResponseModel(null,StatusCode.ERROR,e.message);
        return response.generate();
    }
};
export const main = middyfy(createDepartmentHandler);
