import { Buses } from "@services/eventBridgeService";

const DepartmentEvents = {
	onCreated: {
		EventBusName: Buses.notificationBus,
		Source: "wynberg-mma.department.created",
		DetailType: "departmentCreated",
	},
	onUpdated: {
		EventBusName: Buses.notificationBus,
		Source: "wynberg-mma.department.updated",
		DetailType: "departmentUpdated",
	},
	onDeleted: {
		EventBusName: Buses.notificationBus,
		Source: "wynberg-mma.department.deleted",
		DetailType: "departmentDeleted",
	},
};
export default DepartmentEvents;

export function getAllDepartmentEventBridgeEvents() {
	const eventBriddgeEvents = [];

	for (const key in DepartmentEvents) {
		const eventBridgeEvent = {
			eventBridge: {
				eventBus: DepartmentEvents[key].EventBusName,
				pattern: {
					source: [DepartmentEvents[key].Source],
					["detail-type"]: [DepartmentEvents[key].DetailType],
				},
			},
		};
		eventBriddgeEvents.push(eventBridgeEvent);
	}

	return eventBriddgeEvents;
}
