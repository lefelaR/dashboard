import 'source-map-support/register';

import {APIGatewayEvent} from "aws-lambda";
import {getIssueByRefNumber} from "@repositories/issuesRepository";
import ResponseModel, {StatusCode} from "@common/response.model";
import {middyfy} from "@common/lambda";

const getIssueHandler = async (event: APIGatewayEvent) => {

    const refNumber = event.pathParameters.refNumber;
    try {
        const data = await getIssueByRefNumber(refNumber);
        if (!data) return new ResponseModel({}, StatusCode.NOT_FOUND, `Item with reference number ${refNumber} does not exist.`).generate();
        return new ResponseModel(data, StatusCode.OK).generate();
    } catch (e) {
        const response = e instanceof ResponseModel ? e : new ResponseModel(null, StatusCode.ERROR, e.message);
        return response.generate();
    }

}

export const main = middyfy(getIssueHandler);
