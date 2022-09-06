import 'source-map-support/register';

import {middyfy} from '@common/lambda';
import {getIssueComments} from "@repositories/issuesRepository";
import ResponseModel, {StatusCode} from "@common/response.model";
import {APIGatewayEvent} from "aws-lambda";

const getIssueCommentsHandler= async (event:APIGatewayEvent) => {

    try {
        const issueId = event.pathParameters.id;
        const data = await getIssueComments(issueId);
        return new ResponseModel(data).generate();
    } catch (e) {
        return e instanceof ResponseModel? e.generate() :
            new ResponseModel(undefined,StatusCode.ERROR,e.message).generate()
    }
}

export const main = middyfy(getIssueCommentsHandler);
