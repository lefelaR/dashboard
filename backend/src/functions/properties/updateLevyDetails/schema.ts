export default {
  type: "object",
  properties: {
    contact: { type: "string" },
    email: { type: "string" },
    exclusive: { type: "string" },
    fax: { type: "string" },
    lastVerificationDate: { type: "number" },
    mobile: { type: "string" },
    telephone: { type: "string" },
    verified: { type: "boolean" },
  },
} as const;
