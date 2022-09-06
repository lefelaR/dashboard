import { Buses } from "@services/eventBridgeService";

const featureName = "mailSubscribers";

const MailSubscriberEvents = {
    onCreated: {
        EventBusName: Buses.notificationBus,
        Source: `wynberg-mma.${featureName}.created`,
        DetailType: `${featureName}Created`,
    },
    onUpdated: {
        EventBusName: Buses.notificationBus,
        Source: `wynberg-mma.${featureName}.updated`,
        DetailType: `${featureName}Updated`,
    },
    onDeleted: {
        EventBusName: Buses.notificationBus,
        Source: `wynberg-mma.${featureName}.deleted`,
        DetailType: `${featureName}Deleted`,
    },
};

export default MailSubscriberEvents;

export function getAllMailSubscriberEventBridgeEvents() {
    const eventBriddgeEvents = [];

    for (const key in MailSubscriberEvents) {
        const eventBridgeEvent = {
            eventBridge: {
                eventBus: MailSubscriberEvents[key].EventBusName,
                pattern: {
                    source: [MailSubscriberEvents[key].Source],
                    ["detail-type"]: [MailSubscriberEvents[key].DetailType],
                },
            },
        };
        eventBriddgeEvents.push(eventBridgeEvent);
    }

    return eventBriddgeEvents;
}
