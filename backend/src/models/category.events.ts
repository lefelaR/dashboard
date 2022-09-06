import { Buses } from "@services/eventBridgeService";

const CategoryEvents = {
	onCreated: {
		EventBusName: Buses.notificationBus,
		Source: "wynberg-mma.category.created",
		DetailType: "categoryCreated",
	},
	onUpdated: {
		EventBusName: Buses.notificationBus,
		Source: "wynberg-mma.category.updated",
		DetailType: "categoryUpdated",
	},
	onDeleted: {
		EventBusName: Buses.notificationBus,
		Source: "wynberg-mma.category.deleted",
		DetailType: "categoryDeleted",
	},
};
export default CategoryEvents;

export function getAllCategoryEventBridgeEvents() {
	const eventBriddgeEvents = [];

	for (const key in CategoryEvents) {
		const eventBridgeEvent = {
			eventBridge: {
				eventBus: CategoryEvents[key].EventBusName,
				pattern: {
					source: [CategoryEvents[key].Source],
					["detail-type"]: [CategoryEvents[key].DetailType],
				},
			},
		};
		eventBriddgeEvents.push(eventBridgeEvent);
	}

	return eventBriddgeEvents;
}
