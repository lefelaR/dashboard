import DynamoDatabaseService from "@services/DynamoDatabaseService";
import Item from "@models/items.model";

const TableName = process.env.ITEMS_TABLE;

export const addItem = async (item: Item) => {
	item.createdAt = new Date().getTime();
	const params = {
		TableName,
		Item: {
			...item,
		},
	};
	await DynamoDatabaseService.create(params);
	return item.id;
};
// export const updateItem = async (item: Item) => {
// 	const updatedAt = new Date().getTime();
// 	const params = {
// 		TableName,
// 		Key: {
// 			id: item.id,
// 		},
// 		UpdateExpression:
// 			"Set #firstName = :fn, #lastName = :ln,#roles = :roles, #updatedAt = :timestamp, #lastLoggedIn =:lgn, #isActive = :ia, #department = :dep,#avatar= :avatar",
// 		ExpressionAttributeNames: {
// 			"#firstName": "firstName",
// 			"#lastName": "lastName",
// 			"#roles": "roles",
// 			"#updatedAt": "updatedAt",
// 			"#lastLoggedIn": "lastLoggedIn",
// 			"#isActive": "isActive",
// 			"#department": "department",
// 			"#avatar": "avatar",
// 		},
// 		ExpressionAttributeValues: {
// 			":fn": user.firstName,
// 			":ln": user.lastName,
// 			":roles": user.roles,
// 			":timestamp": updatedAt,
// 			":dep": user.department,
// 			":lgn": user.lastLoggedIn,
// 			":ia": user.isActive,
// 			":avatar": user.avatar,
// 		},
// 		ReturnValues: "UPDATED_NEW",
// 	};
// 	// Updates Item in DynamoDB table
// 	return await DynamoDatabaseService.update(params);
// };

// export const getUser = async (UserId: string) => {
// 	const params = {
// 		TableName,
// 		Key: {
// 			id: UserId,
// 		},
// 	};
// 	return (await DynamoDatabaseService.get(params)).Item;
// };

// export const getUserByEmail = async (userEmail: string) => {
// 	const params = {
// 		TableName,
// 		FilterExpression: "#userEmail = :userEmail",
// 		ExpressionAttributeNames: {
// 			"#userEmail": "email",
// 		},
// 		ExpressionAttributeValues: {
// 			":userEmail": userEmail,
// 		},
// 	};
// 	return await DynamoDatabaseService.scan(params);
// };

export const getAllItems = async () => {
	const params = {
		TableName,
	};
	return await DynamoDatabaseService.scan(params);
};

// export const deleteUser = async (UserId: string) => {
// 	const params = {
// 		TableName,
// 		Key: {
// 			id: UserId,
// 		},
// 	};
// 	await DynamoDatabaseService.delete(params);
// 	return params.Key.id;
// };
