import 'source-map-support/register';
import schema from './schema';
import {ValidatedEventAPIGatewayProxyEvent} from '@common/apiGateway';
import ResponseModel, {StatusCode} from '@common/response.model';
import {middyfy} from '@common/lambda';
import {addRole} from "@repositories/rolesRepository";
import Role from "@models/role.model";

const createRoleHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    try {
        const { body } = event;
        const role = new Role(body.title,body.description);
        role.permissions= body.permissions as string[];
        const data = await  addRole(role);
        return ResponseModel.ok(data, 'Role created');
    } catch (e) {
        console.log(e)

        const response = e instanceof ResponseModel ? e: new ResponseModel(null,StatusCode.ERROR,e.message);
        return response.generate();
    }
};
export const main = middyfy(createRoleHandler);
