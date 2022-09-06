import { Buses } from "@services/eventBridgeService";


const IssueEvents = {
	onCreated: {
		EventBusName: Buses.notificationBus,
		Source: "wynberg-mma.issue.created",
		DetailType: "IssueCreated",
	},
	onDeleted: {
		EventBusName: Buses.notificationBus,
		Source: "wynberg-mma.issue.deleted",
		DetailType: "IssueDeleted",
	},

	onUpdated: {
		EventBusName: Buses.notificationBus,
		Source: "wynberg-mma.issue.updated",
		DetailType: "IssueUpdated",
	},

	onConditionChanged: {
		EventBusName: Buses.notificationBus,
		Source: "wynberg-mma.issue.conditionChanged",
		DetailType: "IssueConditionChanged",
	},

	onAssigneeAdded: {
		EventBusName: Buses.notificationBus,
		Source: "wynberg-mma.issue.userAssigned",
		DetailType: "userAssigned",
	},
	onCommentAdded: {
		EventBusName: Buses.notificationBus,
		Source: "wynberg-mma.issue.issueHasNewComment",
		DetailType: "issueHasNewComment",
	},
};
export default IssueEvents;

export function getAllIssueEventBridgeEvents() {
	const eventBriddgeEvents = [];

	for (const key in IssueEvents) {
		const eventBridgeEvent = {
			eventBridge: {
				eventBus: IssueEvents[key].EventBusName,
				pattern: {
					source: [IssueEvents[key].Source],
					["detail-type"]: [IssueEvents[key].DetailType],
				},
			},
		};
		eventBriddgeEvents.push(eventBridgeEvent);
	}

	return eventBriddgeEvents;
}
