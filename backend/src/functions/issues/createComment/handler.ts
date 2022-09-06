import "source-map-support/register";
import schema from "./schema";
import { ValidatedEventAPIGatewayProxyEvent } from "@common/apiGateway";
import { addComment } from "@repositories/issuesRepository";
import Comment from "@models/issues/comment.model";
import ResponseModel, { StatusCode } from "@common/response.model";
import { middyfy } from "@common/lambda";

const createCommentHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
	async (event) => {
		try {
			const issueId = event.pathParameters.id;
			const newComment = new Comment(event.body.message, event.body.author);
			//update issue
			const data = await addComment(issueId, newComment);
			return ResponseModel.ok(data, "issue created");
		} catch (e) {
			const response =
				e instanceof ResponseModel
					? e
					: new ResponseModel({}, StatusCode.ERROR, e.message);
			return response.generate();
		}
	};
export const main = middyfy(createCommentHandler);
