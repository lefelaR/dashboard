import "source-map-support/register";
import { middyfy } from "@common/lambda";

import Issue from "@models/issues/issue.model";
import { sendEmail } from "@services/simpleEmailingService";
import AppConfig from "../../../../app.config.js";


const create = async (event) => {
	const { issue, reference, formattedDate }: { issue: Issue, reference: string, formattedDate: string } = event.detail.data;

	const message = `Thank you for letting us know, below are the details of the issue you reported, we will update you soon, thank you. 
  <br/><br/>Reference Number: ${reference}
  <br/>Issue description: ${issue.description}
  <br/>Issue reported by: ${issue.createdBy}<br/>Date reported: ${formattedDate}<br/><br/>Click <a href="${AppConfig.websiteUrl
		}/issues/${reference}">here</a> to view the issue.<br/>`;
	const subject = "Issue Created";
	const toAddresses = [issue.creatorEmail];
	try {
		await sendEmail(message, subject, toAddresses);
	} catch (e) {
		console.log("There was an error sending: ", e);
	}
};
export const main = middyfy(create);
