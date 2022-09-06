import { handlerPath } from '@common/handlerResolver';
import PropertyEvents from "@models/property.events";

const { EventBusName, Source, DetailType } = PropertyEvents.onFlagged
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
