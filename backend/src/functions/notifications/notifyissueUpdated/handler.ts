import "source-map-support/register";
import { middyfy } from "@common/lambda";
import { sendEmail } from "@services/simpleEmailingService";
import Issue from "@models/issues/issue.model";
import Assignee from "@models/issues/assignee.model";
const create = async (event) => {
	const issue: Issue = event.detail.data.issue;
	const timeOfChange = event.detail.data.formattedDate
	const message = `Your issue has been recently updated to "${issue.description
		}" and the current issue status is ${issue.status
		}. \n
	Update happened on ${timeOfChange}.`;
	const subject = "Wynberg issue updated";
	const toAddresses = [issue.creatorEmail];
	try {
		if (!!issue.assignees && issue.assignees.length > 0) {
			issue.assignees.forEach((assignee: Assignee) => {
				if (assignee.email != issue.creatorEmail) {
					toAddresses.push(assignee.email)
				}
			});
		}
		await sendEmail(message, subject, toAddresses);
	} catch (e) {
		console.log("There was an error sending: ", e);
	}
};

export const main = middyfy(create);
