import "source-map-support/register";
import { middyfy } from "@common/lambda";
import { sendEmail } from "@services/simpleEmailingService";
import Issue from "@models/issues/issue.model";
import Assignee from "@models/issues/assignee.model";
import AppConfig from "../../../../app.config.js";

const create = async (event) => {
	const issue: Issue = event.detail.data.issue;
	const timeOfChange = event.detail.data.formattedDate;
	const message = `<p>The status of issue with the reference number of ${issue.reference
		} has been changed  to "${issue.status}".</p>
		Click <a href="${AppConfig.websiteUrl}/issues/${issue.reference
		}">here</a> to view issue status.
                    <p><br/>Update happened on ${timeOfChange}
		.</p>`;
	const subject = "Wynberg issue status updated";
	const toAddresses = [issue.creatorEmail];
	try {
		if (!!issue.assignees && issue.assignees.length > 0) {
			issue.assignees.forEach((assignee: Assignee) => {
				if (assignee.email != issue.creatorEmail) {
					toAddresses.push(assignee.email)
				}
			}
			);
		}
		await sendEmail(message, subject, toAddresses);
	} catch (e) {
		console.log("There was an error sending: ", e);
	}
};

export const main = middyfy(create);
