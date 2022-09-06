import 'source-map-support/register';
import type {ValidatedEventAPIGatewayProxyEvent} from '@common/apiGateway';
import {formatJSONResponse} from '@common/apiGateway';
import {middyfy} from '@common/lambda';

import schema from './schema';
import ResponseModel, {StatusCode} from "@common/response.model";
import Issue from "@models/issues/issue.model";
import {getIssue, updateIssue} from "@repositories/issuesRepository";

const update: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const id = event.pathParameters.id;
    try {
        const dbItem = await getIssue(id);
        if(!dbItem) return new ResponseModel({},StatusCode.NOT_FOUND,`Item with id ${id} does not exist.`).generate();

        const issue :Issue = dbItem;
        issue.description = event.body.description;
        const data = await updateIssue(issue);

        return formatJSONResponse(new ResponseModel(data, StatusCode.OK, 'issue updated'));
    } catch (e) {
        return e.generate()
    }
}

export const main = middyfy(update);
