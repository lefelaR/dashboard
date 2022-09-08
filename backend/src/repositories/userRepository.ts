import DynamoDatabaseService from "@services/DynamoDatabaseService";
import User from "@models/user.model";

const TableName = process.env.USERS_TABLE;

export const addUser = async (user: User) => {
	user.createdAt = new Date().getTime();
	user.roles = [];
	const params = {
		TableName,
		Item: {
			...user,
		},
	};
	await DynamoDatabaseService.create(params);
	return user.id;
};
export const updateUser = async (user: User) => {
	const updatedAt = new Date().getTime();
	const params = {
		TableName,
		Key: {
			id: user.id,
		},
		UpdateExpression:
			"Set #firstName = :fn, #lastName = :ln,#roles = :roles, #updatedAt = :timestamp, #lastLoggedIn =:lgn, #isActive = :ia, #department = :dep,#avatar= :avatar",
		ExpressionAttributeNames: {
			"#firstName": "firstName",
			"#lastName": "lastName",
			"#roles": "roles",
			"#updatedAt": "updatedAt",
			"#lastLoggedIn": "lastLoggedIn",
			"#isActive": "isActive",
			"#department": "department",
			"#avatar": "avatar",
		},
		ExpressionAttributeValues: {
			":fn": user.firstName,
			":ln": user.lastName,
			":roles": user.roles,
			":timestamp": updatedAt,
			":dep": user.department,
			":lgn": user.lastLoggedIn,
			":ia": user.isActive,
			":avatar": user.avatar,
		},
		ReturnValues: "UPDATED_NEW",
	};
	// Updates Item in DynamoDB table
	return await DynamoDatabaseService.update(params);
};

export const getUser = async (UserId: string) => {
	const params = {
		TableName,
		Key: {
			id: UserId,
		},
	};
	return (await DynamoDatabaseService.get(params)).Item;
};

export const getUserByEmail = async (userEmail: string) => {
	const params = {
		TableName,
		FilterExpression: "#userEmail = :userEmail",
		ExpressionAttributeNames: {
			"#userEmail": "email",
		},
		ExpressionAttributeValues: {
			":userEmail": userEmail,
		},
	};
	return await DynamoDatabaseService.scan(params);
};

export const getAllUsers = async () => {
	const params = {
		TableName,
	};
	return await DynamoDatabaseService.scan(params);
};

export const deleteUser = async (UserId: string) => {
	const params = {
		TableName,
		Key: {
			id: UserId,
		},
	};
	await DynamoDatabaseService.delete(params);
	return params.Key.id;
};
