import { handlerPath } from "@common/handlerResolver";
import { getAllCategoryEventBridgeEvents } from "@models/category.events";
import { getAllDepartmentEventBridgeEvents } from "@models/department.events";
import { getAllIssueEventBridgeEvents } from "@models/issues/issue.events";
import { getAllRoleEventBridgeEvents } from "@models/role.events";
const events = [
	...getAllCategoryEventBridgeEvents(),
	...getAllRoleEventBridgeEvents(),
	...getAllIssueEventBridgeEvents(),
	...getAllDepartmentEventBridgeEvents(),
];
export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	events,
};
