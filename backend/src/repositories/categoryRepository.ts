import DynamoDatabaseService from "@services/DynamoDatabaseService";
import eventBridgeService from "@services/eventBridgeService";

import Category from "@models/category.model";
import CategoryEvents from "@models/category.events";

const TableName = process.env.CATEGORY_TABLE;

export const addCategory = async (category: Category) => {
	category.createdAt = new Date().getTime();
	const params = {
		TableName,
		Item: {
			...category,
		},
	};
	await DynamoDatabaseService.create(params);
	//dispatch event
	await eventBridgeService
		.putEvents({
			Entries: [
				{
					EventBusName: CategoryEvents.onCreated.EventBusName,
					Source: CategoryEvents.onCreated.Source + '-' + process.env.STAGE,
					DetailType: CategoryEvents.onCreated.DetailType,
					Detail: JSON.stringify({
						description: `Category created  at ${new Date(category.createdAt)}`,
						data: category,
					}),
				},
			],
		})
		.promise();
	return category;
};

export const updateCategory = async (category: Category) => {
	const updatedAt = new Date().getTime();
	const params = {
		TableName,
		Key: {
			id: category.id,
		},
		UpdateExpression:
			`set 
			#name = :name,
			#description = :description,
			updatedAt = :timestamp,
			departmentId = :departmentId`,

		ExpressionAttributeNames: {
			"#name": "name",
			"#description": "description",
		},
		ExpressionAttributeValues: {
			":name": category.name,
			":description": category.description,
			":departmentId": category.departmentId,
			":timestamp": updatedAt
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
					EventBusName: CategoryEvents.onUpdated.EventBusName,
					Source: CategoryEvents.onUpdated.Source + '-' + process.env.STAGE,
					DetailType: CategoryEvents.onUpdated.DetailType,
					Detail: JSON.stringify({
						description: `Category Updated at ${new Date(updatedAt)}`,
						data: result,
					}),
				},
			],
		})
		.promise();
	return result.Attributes;
};

export const getCategory = async (categoryId: string) => {
	const params = {
		TableName,
		Key: {
			id: categoryId,
		},
	};
	return (await DynamoDatabaseService.get(params)).Item;
};

export const getAllCategories = async () => {
	const params = {
		TableName,
	};
	return await DynamoDatabaseService.scan(params);
};

export const deleteCategory = async (categoryId: string) => {
	const params = {
		TableName,
		Key: {
			id: categoryId,
		},
	};
	await DynamoDatabaseService.delete(params);
	//dispatch event
	await eventBridgeService
		.putEvents({
			Entries: [
				{
					EventBusName: CategoryEvents.onDeleted.EventBusName,
					Source: CategoryEvents.onDeleted.Source + '-' + process.env.STAGE,
					DetailType: CategoryEvents.onDeleted.DetailType,
					Detail: JSON.stringify({
						description: `Category Deleted at ${new Date()}`,
						data: params,
					}),
				},
			],
		})
		.promise();
	return params.Key.id;
};
