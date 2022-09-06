import { Buses } from "@services/eventBridgeService";

const PropertyEvents = {
	onCreated: {
		EventBusName: Buses.notificationBus,
		Source: "wynberg-mma.property.created",
		DetailType: "propertyCreated",
	},
	onUpdated: {
		EventBusName: Buses.notificationBus,
		Source: "wynberg-mma.property.updated",
		DetailType: "propertyUpdated",
	},
	onDeleted: {
		EventBusName: Buses.notificationBus,
		Source: "wynberg-mma.property.deleted",
		DetailType: "propertyDeleted",
	},
	onFlagged: {
		EventBusName: Buses.notificationBus,
		Source: "wynberg-mma.property.flagged",
		DetailType: "propertyFlagged",
	}
};
export default PropertyEvents;

export function getAllPropertyEventBridgeEvents() {
	const eventBriddgeEvents = [];

	for (const key in PropertyEvents) {
		const eventBridgeEvent = {
			eventBridge: {
				eventBus: PropertyEvents[key].EventBusName,
				pattern: {
					source: [PropertyEvents[key].Source],
					["detail-type"]: [PropertyEvents[key].DetailType],
				},
			},
		};
		eventBriddgeEvents.push(eventBridgeEvent);
	}

	return eventBriddgeEvents;
}
