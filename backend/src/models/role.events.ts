import { Buses } from "@services/eventBridgeService";
const RoleEvents = {
	onCreated: {
		EventBusName: Buses.notificationBus,
		Source: "wynberg-mma.role.created",
		DetailType: "roleCreated",
	},
	onUpdated: {
		EventBusName: Buses.notificationBus,
		Source: "wynberg-mma.role.updated",
		DetailType: "roleUpdated",
	},
	onDeleted: {
		EventBusName: Buses.notificationBus,
		Source: "wynberg-mma.role.deleted",
		DetailType: "roleDeleted",
	},
};
export default RoleEvents;

export function getAllRoleEventBridgeEvents() {
	const eventBriddgeEvents = [];

	for (const key in RoleEvents) {
		const eventBridgeEvent = {
			eventBridge: {
				eventBus: RoleEvents[key].EventBusName,
				pattern: {
					source: [RoleEvents[key].Source],
					["detail-type"]: [RoleEvents[key].DetailType],
				},
			},
		};
		eventBriddgeEvents.push(eventBridgeEvent);
	}

	return eventBriddgeEvents;
}
