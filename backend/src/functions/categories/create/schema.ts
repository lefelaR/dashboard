export default {
	type: "object",
	properties: {
		name: { type: "string" },
		description: { type: "string" },
		departmentId: { type: "string" },
	},
	required: ["name", "description", "departmentId"],
} as const;
