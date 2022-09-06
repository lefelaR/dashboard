export default {
  type: "object",
  properties: {
    name: { type: "string" },
    verified: { type: "boolean" },
    phoneNumber: { type: "string" },
    email: { type: "string" },
    lastVerificationDate: { type: "number" },
  },
  required: ["name", "email"],
} as const;
