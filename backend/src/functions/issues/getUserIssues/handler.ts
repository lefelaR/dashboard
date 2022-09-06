import 'source-map-support/register';
import {formatJSONResponse} from '@common/apiGateway';
import {middyfy} from '@common/lambda';
import {getUserIssues} from "@repositories/issuesRepository";
import ResponseModel from "@common/response.model";
import {APIGatewayEvent} from "aws-lambda";

const getUserIssuesHandler= async (event:APIGatewayEvent) => {
    const userId = event.pathParameters.userId
    try {
        const data = await getUserIssues(userId);
        return formatJSONResponse(new ResponseModel(data));
    } catch (e) {
        return e.generate()
    }
}

export const main = middyfy(getUserIssuesHandler);
