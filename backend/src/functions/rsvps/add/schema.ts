const proxyDetailsSchema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    phoneNumber: { type: "string" },
    email: { type: "string" },
    isOwner: { type: "boolean" },
    erfNumber: { type: "array" },
  },
  required: ["firstName", "lastName", "phoneNumber", "erfNumber"],
};

export default {
  type: "object",
  properties: {
    rsvpId: { type: "string" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    phoneNumber: { type: "string" },
    companyName: { type: "string" },
    email: { type: "string" },
    isOwner: { type: "boolean" },
    dateAGM: { type: "string" },
    proxy: { type: "string" },
    erfNumber: { type: "array" },
    proxyDetails: proxyDetailsSchema,
  },
  required: [
    "rsvpId",
    "firstName",
    "lastName",
    "phoneNumber",
    "companyName",
    "email",
    "isOwner",
    "dateAGM",
    "proxy",
    "erfNumber",
  ],
} as const;
