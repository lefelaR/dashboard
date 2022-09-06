import { handlerPath } from '@common/handlerResolver';
import IssueEvents from "@models/issues/issue.events";

const { EventBusName, Source, DetailType } = IssueEvents.onAssigneeAdded;

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
