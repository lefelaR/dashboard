export default {
	type: "object",
	properties: {
		id: { type: "string" },
		firstName: { type: "string" },
		lastName: { type: "string" },
		email: { type: "string" },
		department: { type: "string" },
		roles: { type: "array" },
		avatar: { type: "string" },
		lastLoggedIn: { type: "number" },
		isActive: { type: "boolean" },
	},
	required: ["id"],
} as const;
