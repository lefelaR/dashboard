import 'source-map-support/register';
import type {ValidatedEventAPIGatewayProxyEvent} from '@common/apiGateway';
import {formatJSONResponse} from '@common/apiGateway';
import {middyfy} from '@common/lambda';

import schema from './schema';
import ResponseModel, {StatusCode} from "@common/response.model";
import Issue from "@models/issues/issue.model";
import {addAssignee, getIssue} from "@repositories/issuesRepository";
import Assignee from "@models/issues/assignee.model";

const addAssigneeHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    try {
        const issueId = event.pathParameters.id;
        const assignee = new Assignee(event.body.name, event.body.email);

        const issue: Issue = await getIssue(issueId);
        if (!issue) return new ResponseModel({}, StatusCode.NOT_FOUND, `Item with id ${issueId} does not exist.`).generate();
        const data = await addAssignee(issue, assignee);

        return formatJSONResponse(new ResponseModel(data, StatusCode.OK, 'issue updated'));
    } catch (e) {
        return e.generate()
    }
}

export const main = middyfy(addAssigneeHandler);
