import 'source-map-support/register';
import { middyfy } from '@common/lambda';
import { getAll } from "@repositories/issuesRepository";
import ResponseModel, { StatusCode } from "@common/response.model";
import { APIGatewayEvent } from "aws-lambda";

const getAllHandler = async (event: APIGatewayEvent) => {
    try {
        let details = false;
        if (!!event.queryStringParameters && !!event.queryStringParameters.details) {
            if (event.queryStringParameters.details === "true") {
                details = true;
            }
        }
        const data = await getAll(details);
        return new ResponseModel(data).generate();
    } catch (e) {
        return e instanceof ResponseModel ? e.generate() :
            new ResponseModel(undefined, StatusCode.ERROR, e.message).generate()
    }
}
export const main = middyfy(getAllHandler);