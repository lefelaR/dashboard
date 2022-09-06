export default {
	type: "object",
	properties: {
		issueId: { type: "string" },
		jobReference: { type: "string" },
	},
	required: ["jobReference"],
} as const;
