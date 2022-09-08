
import MailChimp from "mailchimp-api-v3";
import MailSubscriber from '../models/mailSubscriber.model';

const LIST_ID = "";
const API_KEY = ""

const mailChimp = new MailChimp(API_KEY);

export const addMember = async (mailSubscriber: MailSubscriber) => {
    try {
        await mailChimp.post(`/lists/${LIST_ID}/members`, {
            email_address: mailSubscriber.email,
            full_name: mailSubscriber.name,
            status: 'subscribed',
            web_id: mailSubscriber.id
        });
    } catch (error) {
        console.log("Failed to add member to mail chimp reason :" + error)
        throw error;
    }
}
export const getMailList = async () => {

    try {

        //Todo : Make Pagination dynamic by dynamically replacing offset, count values;
        const offset = 0;
        const count = 1000;

        const result = await mailChimp.get({
            path: `/lists/${LIST_ID}/members?count=${count}&offset=${offset}`
        });

        return result.members.map(m => {
            return {
                id: m.id,
                name: m.full_name,
                email: m.email_address,
                status: m.status
            }
        });
    } catch (error) {
        console.log("Failed to get members to mail chimp reason :" + error)
        throw error;
    }
}
