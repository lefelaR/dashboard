import "source-map-support/register";
import schema from "./schema";
import { ValidatedEventAPIGatewayProxyEvent } from "@common/apiGateway";
import Issue, { IssueStatus } from "@models/issues/issue.model";
import { createIssue } from "@repositories/issuesRepository";
import ResponseModel, { StatusCode } from "@common/response.model";
import LocationModel from "@models/issues/Location.model";
import { middyfy } from "@common/lambda";

const create: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
	event
) => {
	try {
		const { body } = event;
		// @ts-ignore
		const { longitude, latitude } = body.coordinates;
		const location = new LocationModel(latitude, longitude);

		const issue = new Issue();
		issue.description = body.description;
		issue.coordinates = location;
		issue.status = IssueStatus.PENDING;
		issue.createdBy = body.createdBy;
		issue.creatorEmail = body.creatorEmail;
		issue.images = body.images as string[];
		issue.categoryId = body.categoryId;
		issue.startTime = body.startTime;
		issue.endTime = body.endTime;
		issue.cause = body.cause;
		
		const data = await createIssue(issue);

		return ResponseModel.ok(data, "issue created");
	} catch (e) {
		const response =
			e instanceof ResponseModel
				? e
				: new ResponseModel(null, StatusCode.ERROR, e.message);
		return response.generate();
	}
};
export const main = middyfy(create);
