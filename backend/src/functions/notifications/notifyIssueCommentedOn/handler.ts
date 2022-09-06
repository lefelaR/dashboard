import "source-map-support/register";
import { middyfy } from "@common/lambda";
import { sendEmail } from "@services/simpleEmailingService";
import Issue from "@models/issues/issue.model";
import Assignee from "@models/issues/assignee.model";
import AppConfig from "../../../../app.config.js";

const notifyIssueCommentedOnHandler = async (event) => {
	const issue: Issue = event.detail.data.issue;
	const comment = event.detail.data.comment;
	const message = `<p>${comment.author} commented with "${comment.message}" on the issue "${issue.description}",reference number : ${issue.reference}.</p>Click <a href="${AppConfig.websiteUrl}/issues/${issue.reference
		}">here</a> to view issue status.`;
	const Subject = '"Wynberg Issue updates"';
	const ToAddresses = [issue.creatorEmail];
	try {
		if (!!issue.assignees && issue.assignees.length > 0) {
			issue.assignees.forEach((assignee: Assignee) => {
				if (assignee.email != issue.creatorEmail)
					ToAddresses.push(assignee.email)
			});
		}
		await sendEmail(message, Subject, ToAddresses);
	} catch (e) {
		console.log("There was an error sending: ", e);
	}
};
export const main = middyfy(notifyIssueCommentedOnHandler);
