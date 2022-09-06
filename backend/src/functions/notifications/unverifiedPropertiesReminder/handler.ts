import "source-map-support/register";
import { middyfy } from "@common/lambda";
import PropertyModel from "@models/property.model.js";
import { sendEmail } from "@services/simpleEmailingService";
import { getUnverifiedProperties } from "@repositories/propertyRepository";
import AppConfig from "../../../../app.config.js";
import ResponseModel from "../../../common/response.model";

const notify = async () => {
  try {
    const adminEmails = [process.env.ADMIN_EMAIL];
    const properties = await getUnverifiedProperties();
    const mappedProperties = properties.Items.map(
      (property: PropertyModel) =>
        `<a href="${AppConfig.websiteUrl}/portal/properties/${property?.propertyId}">ERF: ${property?.erfNumber};       Building name: ${property?.building?.name}</a><br/>`
    );
    const htmlIssueList = mappedProperties.join(",").replace(/,/g, "");
    const subject = "Unverified Issues Reminder";
    const propertyLength = () => {
      if (properties.Items.length === 1) {
        return `${properties.Items.length} property`;
      } else {
        return `${properties.Items.length} properties`;
      }
    };
    const message = `You have ${propertyLength()} not verified, linked below:
        <br/> <br/> ${htmlIssueList}`;
    if (properties.Items.length > 0) {
      try {
        await sendEmail(message, subject, adminEmails);
      } catch (e) {
        console.log("There was an error sending email - ", e);
      }
    }
    return ResponseModel.ok(undefined, "Sent unverified properties reminder");
  } catch (err) {
    console.log(err);
  }
};
export const main = middyfy(notify);
