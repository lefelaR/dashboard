import "source-map-support/register";
import { middyfy } from "@common/lambda";
import Assignee from "@models/issues/assignee.model";
import Issue from "@models/issues/issue.model";
import { sendEmail } from "@services/simpleEmailingService";

const notify = async (event) => {
	const issue: Issue = event.detail.data.issue;
	const assignee: Assignee = event.detail.data.assignee;
	const message = `Good Day ${assignee.name},\nYou have been assigned to the following issue <a href="https://wynberg.org.za/${issue.reference}">"${issue.reference}"</a>.`;
	const subject = "Wynberg issue updated";
	const toAddresses = [assignee.email];
	try {
		await sendEmail(message, subject, toAddresses);
	} catch (e) {
		console.log("There was an error sending: ", e);
	}
};
export const main = middyfy(notify);
