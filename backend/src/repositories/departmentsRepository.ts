import DynamoDatabaseService from "@services/DynamoDatabaseService";
import eventBridgeService from "@services/eventBridgeService";

import Department from "@models/department.model";
import DepartmentEvents from "@models/department.events";

const TableName = process.env.DEPARTMENT_TABLE;

export const addDepartment = async (department: Department) => {
	department.createdAt = new Date().getTime();

	const params = {
		TableName,
		Item: {
			...department,
		},
	};
	await DynamoDatabaseService.create(params);
	//dispatch event
	await eventBridgeService
		.putEvents({
			Entries: [
				{
					EventBusName: DepartmentEvents.onCreated.EventBusName,
					Source: DepartmentEvents.onCreated.Source + '-' + process.env.STAGE,
					DetailType: DepartmentEvents.onCreated.DetailType,
					Detail: JSON.stringify({
						description: `Department created at ${new Date(
							department.createdAt
						)}`,
						data: department,
					}),
				},
			],
		})
		.promise();
	return department;
};

export const updateDepartment = async (department: Department) => {
	const updatedAt = new Date().getTime();
	const params = {
		TableName,
		Key: {
			id: department.id,
		},
		UpdateExpression:
			"set #description = :description, #title = :title, updatedAt = :timestamp",
		ExpressionAttributeNames: {
			"#title": "title",
			"#description": "description",
		},
		ExpressionAttributeValues: {
			":title": department.title,
			":description": department.description,
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
					EventBusName: DepartmentEvents.onUpdated.EventBusName,
					Source: DepartmentEvents.onUpdated.Source + '-' + process.env.STAGE,
					DetailType: DepartmentEvents.onUpdated.DetailType,
					Detail: JSON.stringify({
						description: `Department updated at ${new Date(updatedAt)}`,
						data: params,
					}),
				},
			],
		})
		.promise();
	return result.Attributes;
};

export const getDepartment = async (departmentId: string) => {
	const params = {
		TableName,
		Key: {
			id: departmentId,
		},
	};
	return (await DynamoDatabaseService.get(params)).Item;
};

export const getAllDepartments = async () => {
	const params = {
		TableName,
	};
	return await DynamoDatabaseService.scan(params);
};

export const deleteDepartment = async (departmentId: string) => {
	const params = {
		TableName,
		Key: { id: departmentId },
	};
	await DynamoDatabaseService.delete(params);
	//dispatch event
	await eventBridgeService
		.putEvents({
			Entries: [
				{
					EventBusName: DepartmentEvents.onDeleted.EventBusName,
					Source: DepartmentEvents.onDeleted.Source + '-' + process.env.STAGE,
					DetailType: DepartmentEvents.onDeleted.DetailType,
					Detail: JSON.stringify({
						description: `Department deleted at ${new Date()}`,
						data: params,
					}),
				},
			],
		})
		.promise();
	return params.Key.id;
};
