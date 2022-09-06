import "source-map-support/register";
import { middyfy } from "@common/lambda";
import { sendEmail } from "@services/simpleEmailingService";
import AppConfig from "../../../../app.config.js";
import moment from "moment";
import MailSubscriber from "@models/mailSubscriber.model.js";

const sendEmailHandler = async (event) => {
    const mailSubscriber = event.detail.data.mailSubscriber as MailSubscriber;

    const formattedDate = moment(new Date(mailSubscriber.createdAt)).format("Do MMMM YYYY, h:mm a");
    const message = `
    Good Day Admin,
    <br/><br/>
    A new user with the following details has subscribed to the Wynberg manage my area mail list.
    <br/>
        User full names : ${mailSubscriber.name}
    <br/>
        user email: ${mailSubscriber.email}
    <br/>
        Date subscribed: ${formattedDate}<br/><br/>
    <br/>
    Click <a href="${AppConfig.websiteUrl}/portal/mail-subscribers/${mailSubscriber.id}">here</a> to view the user.<br/>`;
    const subject = "New user subscribed to mail list";
    const toAddresses = ["admin@turati.co.za", "adriano@turati.co.za", "nicolas@turati.co.za"];

    try {
        console.log(mailSubscriber)
        await sendEmail(message, subject, toAddresses);

    } catch (e) {
        console.log("There was an error sending: ", e);
    }
};
export const main = middyfy(sendEmailHandler);