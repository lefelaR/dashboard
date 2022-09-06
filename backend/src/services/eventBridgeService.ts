import AWS from "./awsService";

export const Buses = {
	notificationBus:
		"arn:aws:events:eu-central-1:550384794237:event-bus/notifications",
};
const setEventBridgeConfig = () => {
	let eventBridgeOption = {};

	if (process.env.IS_OFFLINE) {
		eventBridgeOption = {
			endpoint: "http://127.0.0.1:4080",
		};
	}

	return eventBridgeOption;
};
export default new AWS.EventBridge(setEventBridgeConfig());
