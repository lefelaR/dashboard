const owner = {
	type: "object",
	properties: {
		name: { type: "string" },
	},
};
const building = {
	type: "object",
	properties: {
		name: { type: "string" },
	},
};
export default {
	type: "object",
	properties: {
		erfNumber: { type: "string" },
		erfSize: { type: "number" },
		officeNumber: { type: "string" },
		officeEmail: { type: "string" },
		fax: { type: "string" },
		accountNumber: { type: "string" },
		currentBalance: { type: "number" },
		isOverdue: { type: "boolean" },
		managementCompany: { type: "string" },
		propertyId: { type: "string" },
		tradingAs: { type: "string" },
		vat: { type: "string" },
		mdaAccNumber: { type: "string" },
		municipalValue: { type: "string" },
		notes: { type: "string" },
		allocatedUserId: { type: "string" },
		approached: { type: "string" },
		contributorStatus: { type: "string" },
		contributionInteraction: { type: "string" },
		owner,
		building,
	},
	required: ["erfNumber"],
} as const;
