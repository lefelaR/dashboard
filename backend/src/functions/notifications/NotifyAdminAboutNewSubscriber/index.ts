import { handlerPath } from '@common/handlerResolver';
import MailSubscriberEvents from "@models/mailSubscribers.events";

const { EventBusName, Source, DetailType } = MailSubscriberEvents.onCreated
export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    tracing: true,
    events: [
        {
            eventBridge: {
                eventBus: EventBusName,
                pattern: {
                    source: [Source + "-${self:provider.stage}"],
                    ["detail-type"]: [DetailType],
                },
            },
        },
    ],
};
