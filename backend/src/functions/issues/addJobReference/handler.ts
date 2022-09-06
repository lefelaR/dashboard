import "source-map-support/register";
import schema from "./schema";
import { ValidatedEventAPIGatewayProxyEvent } from "@common/apiGateway";
import ResponseModel, { StatusCode } from "@common/response.model";
import { middyfy } from "@common/lambda";
import { addIssueJobReference, getIssue } from "@repositories/issuesRepository";

const create: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
	event
) => {
	try {
		const issueId = event.pathParameters.id;

		const { body } = event;

		const issueExists = await getIssue(issueId);

		if (!issueExists)
			return ResponseModel.notFound(
				{ id: issueId },
				"Issue with id " + issueId + " was not found"
			);
		const data = addIssueJobReference(issueId, body.jobReference);
		return ResponseModel.ok(data, "Job reference assigned");
	} catch (e) {
		const response =
			e instanceof ResponseModel
				? e
				: new ResponseModel(null, StatusCode.ERROR, e.message);
		return response.generate();
	}
};
export const main = middyfy(create);
