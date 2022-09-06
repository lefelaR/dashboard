import DynamoDatabaseService from "@services/DynamoDatabaseService";
import eventBridgeService from "@services/eventBridgeService";
import * as mailChimpService from "@services/mailChimpService";

import MailSubscriber from "@models/mailSubscriber.model";
import MailSubscriberEvents from "@models/mailSubscribers.events";
import { getMailList } from "@services/mailChimpService";

const TableName = process.env.MAIL_SUBSCRIBER_TABLE;

export const addSubscriber = async (mailSubscriber: MailSubscriber) => {
    mailSubscriber.createdAt = new Date().getTime();
    const params = {
        TableName,
        Item: {
            ...mailSubscriber,
        },
    };

     await mailChimpService.addMember(mailSubscriber);
    await DynamoDatabaseService.create(params);
    //dispatch event
    await eventBridgeService
        .putEvents({
            Entries: [
                {
                    EventBusName: MailSubscriberEvents.onCreated.EventBusName,
                    Source: MailSubscriberEvents.onCreated.Source + '-' + process.env.STAGE,
                    DetailType: MailSubscriberEvents.onCreated.DetailType,
                    Detail: JSON.stringify({
                        description: `Mail Subscriber added  at ${new Date(mailSubscriber.createdAt)}`,
                        data: {
                            mailSubscriber
                        },
                    }),
                },
            ],
        })
        .promise();
    return mailSubscriber;
};

export const getAllMembers = async () => {
    return await getMailList();
}