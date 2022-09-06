import DynamoDatabaseService from "@services/DynamoDatabaseService";
import eventBridgeService from "@services/eventBridgeService";
import Role from "@models/role.model";
import RoleEvents from "@models/role.events";
const TableName = process.env.ROLES_TABLE;

export const addRole = async (role: Role) => {
	role.createdAt = new Date().getTime();

	const params = {
		TableName,
		Item: {
			...role,
		},
	};
	await DynamoDatabaseService.create(params);

	//dispatch event
	await eventBridgeService
		.putEvents({
			Entries: [
				{
					EventBusName: RoleEvents.onCreated.EventBusName,
					Source: RoleEvents.onCreated.Source + '-' + process.env.STAGE,
					DetailType: RoleEvents.onCreated.DetailType,
					Detail: JSON.stringify({
						description: `Role Created at ${new Date(role.createdAt)}`,
						data: role,
					}),
				},
			],
		})
		.promise();
	return role;
};

export const updateRole = async (role: Role) => {
	const updatedAt = new Date().getTime();
	const params = {
		TableName,
		Key: {
			id: role.id,
		},
		UpdateExpression:
			"set #description = :description, #title = :title,#permissions = :permissions, updatedAt = :timestamp",
		ExpressionAttributeNames: {
			"#title": "title",
			"#description": "description",
			"#permissions": "permissions",
		},
		ExpressionAttributeValues: {
			":title": role.title,
			":permissions": role.permissions,
			":description": role.description,
			":timestamp": updatedAt,
		},
		ReturnValues: "UPDATED_NEW",
	};
	// Updates Item in DynamoDB table
	const result = await DynamoDatabaseService.update(params);

	//dispatch event
	await eventBridgeService
		.putEvents({
			Entries: [
				{
					EventBusName: RoleEvents.onUpdated.EventBusName,
					Source: RoleEvents.onUpdated.Source + '-' + process.env.STAGE,
					DetailType: RoleEvents.onUpdated.DetailType,
					Detail: JSON.stringify({
						description: `Role updated at ${new Date(updatedAt)}`,
						data: params,
					}),
				},
			],
		})
		.promise();
	return result.Attributes;
};

export const getRole = async (roleId: string) => {
	const params = {
		TableName,
		Key: {
			id: roleId,
		},
	};
	const item = (await DynamoDatabaseService.get(params)).Item;

	return item;
};

export const getAllRoles = async () => {
	const params = {
		TableName,
	};
	return await DynamoDatabaseService.scan(params);
};

export const deleteRole = async (roleId: string) => {
	const params = {
		TableName,
		Key: { id: roleId },
	};
	await DynamoDatabaseService.delete(params);
	await eventBridgeService
		.putEvents({
			Entries: [
				{
					EventBusName: RoleEvents.onDeleted.EventBusName,
					Source: RoleEvents.onDeleted.Source + '-' + process.env.STAGE,
					DetailType: RoleEvents.onDeleted.DetailType,
					Detail: JSON.stringify({
						description: `Role ${roleId} deleted at ${new Date()}`,
						data: params,
					}),
				},
			],
		})
		.promise();
	return params.Key.id;
};
