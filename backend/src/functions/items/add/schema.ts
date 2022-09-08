export default {
	type: "object",
	properties: {
		id: { type: "string" },
		name: { type: "string" },
		brand: { type: "string" },
		color: { type: "string" },
		size: { type: "number" },
		category: { type: "string" },
		description: { type: "string" },
	},
	required: ["name",],
} as const;
