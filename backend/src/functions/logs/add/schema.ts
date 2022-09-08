export default {
	type: "object",
	properties: {
		type: { type: "string" },
		environment: { type: "string" },
		description: { type: "string" },
	},
	required: ["type", "description", "environment"],
} as const;
