import "source-map-support/register";
import { APIGatewayEvent } from "aws-lambda";
import { getIssue } from "@repositories/issuesRepository";
import ResponseModel, { StatusCode } from "@common/response.model";
import { middyfy } from "@common/lambda";

const getIssueHandler = async (event: APIGatewayEvent) => {
	try {
		const issueId = event.pathParameters.id;
		const data = await getIssue(issueId);
		if (!data)
			return ResponseModel.notFound(
				null,
				`Item with id ${issueId} does not exist.`
			);
		return new ResponseModel(data, StatusCode.OK).generate();
	} catch (e) {
		const response =
			e instanceof ResponseModel
				? e
				: new ResponseModel(null, StatusCode.ERROR, e.message);
		return response.generate();
	}
};

export const main = middyfy(getIssueHandler);
