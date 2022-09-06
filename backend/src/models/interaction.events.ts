import { Buses } from "@services/eventBridgeService";

const InteractionEvents = {
	onCreated: {
		EventBusName: Buses.notificationBus,
		Source: "wynberg-mma.interaction.created",
		DetailType: "interactionCreated",
	},
	onUpdated: {
		EventBusName: Buses.notificationBus,
		Source: "wynberg-mma.interaction.updated",
		DetailType: "interactionUpdated",
	},
	onDeleted: {
		EventBusName: Buses.notificationBus,
		Source: "wynberg-mma.interaction.deleted",
		DetailType: "interactionDeleted",
	},
};
export default InteractionEvents;

export function getAllInteractionEventBridgeEvents() {
	const eventBriddgeEvents = [];

	for (const key in InteractionEvents) {
		const eventBridgeEvent = {
			eventBridge: {
				eventBus: InteractionEvents[key].EventBusName,
				pattern: {
					source: [InteractionEvents[key].Source],
					["detail-type"]: [InteractionEvents[key].DetailType],
				},
			},
		};
		eventBriddgeEvents.push(eventBridgeEvent);
	}

	return eventBriddgeEvents;
}
