import {formatJSONResponse} from '@common/apiGateway';
import {middyfy} from '@common/lambda';
import {APIGatewayEvent} from "aws-lambda";
import {deleteIssue} from "@repositories/issuesRepository";
import ResponseModel, {StatusCode} from "@common/response.model";

const deleteHandler = async (event:APIGatewayEvent) => {
    const issueId = event.pathParameters.id;
    await deleteIssue(issueId)
    return formatJSONResponse(new ResponseModel({}, StatusCode.OK ));
}

export const main = middyfy(deleteHandler);
