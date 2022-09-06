import { handlerPath } from "@common/handlerResolver";
import InteractionEvents from "@models/interaction.events";

const { EventBusName, Source, DetailType } = InteractionEvents.onCreated;

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
