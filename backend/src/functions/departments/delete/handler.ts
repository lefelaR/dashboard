import 'source-map-support/register';
import ResponseModel, {StatusCode} from '@common/response.model';
import {middyfy} from '@common/lambda';
import {deleteDepartment} from "@repositories/departmentsRepository";
import {APIGatewayEvent} from "aws-lambda";

const deleteDepartmentHandler = async (event: APIGatewayEvent) => {
    try {
        const departmentId = event.pathParameters.id;
        const data = await deleteDepartment(departmentId);
        return  ResponseModel.ok(data, 'Department deleted');

    } catch (e) {
        const response = e instanceof ResponseModel ? e : new ResponseModel(null, StatusCode.ERROR, e.message);
        return response.generate();
    }
};
export const main = middyfy(deleteDepartmentHandler);
