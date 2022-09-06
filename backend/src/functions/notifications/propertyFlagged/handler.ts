import "source-map-support/register";
import { middyfy } from "@common/lambda";
import { sendEmail } from "@services/simpleEmailingService";
import AppConfig from "../../../../app.config.js";
import PropertyModel from '../../../models/property.model';
import { getUser } from '../../../repositories/userRepository';
import User from '../../../models/user.model';
import moment from "moment";

const sendEmailHandler = async (event) => {
    const property = event.detail.data.property as PropertyModel;
    const { dateFlagged, message: flagMessage } = event.detail.data;

    const user = await getUser(property.allocatedUserId) as User;
    const formattedDate = moment(new Date(dateFlagged)).format("Do MMMM YYYY, h:mm a");
    const message = `
    Good Day ${user.firstName} ${user.lastName},
    <br/><br/>
    A property with the following details was flagged for update.
    <br/>
        Property Building Name : ${property.building.name}
    <br/>
        Property Owner Name : ${property.owner.name}
    <br/>
        Property ERF number : ${property.erfNumber}
    <br/>
    Reason for being flagged : ${flagMessage}
    <br/>
    Date Flagged: ${formattedDate}<br/><br/>
    <br/>
        The property has now been reset to not verified, please review all it's details and verify again.
    <br/>
    Click <a href="${AppConfig.websiteUrl}/portal/properties/${property.id}">here</a> to view the Property.<br/>`;
    const subject = "Property Flagged";
    const toAddresses = [user.email];
    try {
        await sendEmail(message, subject, toAddresses);
    } catch (e) {
        console.log("There was an error sending: ", e);
    }
};
export const main = middyfy(sendEmailHandler);